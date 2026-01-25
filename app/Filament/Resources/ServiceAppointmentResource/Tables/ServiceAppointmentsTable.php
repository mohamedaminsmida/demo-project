<?php

namespace App\Filament\Resources\ServiceAppointmentResource\Tables;

use App\Enums\AppointmentStatus;
use App\Filament\Resources\ServiceAppointmentResource;
use App\Models\Service;
use App\Models\ServiceAppointment;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Tables;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;
use Maatwebsite\Excel\Excel as ExcelWriter;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use pxlrbt\FilamentExcel\Columns\Column;
use pxlrbt\FilamentExcel\Exports\ExcelExport;

class ServiceAppointmentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('vehicle.brand')
                    ->label('Vehicle')
                    ->formatStateUsing(fn ($record) => "{$record->vehicle->year} {$record->vehicle->brand} {$record->vehicle->model}"),
                Tables\Columns\TextColumn::make('services.name')
                    ->label('Services')
                    ->badge()
                    ->separator(', '),
                Tables\Columns\TextColumn::make('appointment_date_time')
                    ->label('Appointment Date')
                    ->getStateUsing(fn (ServiceAppointment $record) => Carbon::parse($record->appointment_date)->setTimeFromTimeString($record->appointment_time))
                    ->dateTime('M d, Y g:i A')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->color(function ($state): string {
                        $status = $state instanceof AppointmentStatus
                            ? $state
                            : AppointmentStatus::from($state);

                        return $status->badgeColor();
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\Filter::make('appointment_date')
                    ->form([
                        DatePicker::make('from')->label('From')
                                                ->native(false)
                                                ->reactive()
,
                        DatePicker::make('until')->label('Until')
                                                ->native(false)
                                                ->minDate(fn (callable $get) => $get('from'))
                                                ->rules([
                                                    'nullable',
                                                    'date',
                                                    'after_or_equal:from',
                                                ])
,
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when(
                                $data['from'] ?? null,
                                fn ($q, $date) => $q->whereDate('appointment_date', '>=', $date),
                            )
                            ->when(
                                $data['until'] ?? null,
                                fn ($q, $date) => $q->whereDate('appointment_date', '<=', $date),
                            );
                    }),
                Tables\Filters\SelectFilter::make('service')
                    ->label('Service type')
                    ->options(fn () => Service::query()->orderBy('name')->pluck('name', 'id')->toArray())
                    ->searchable()
                    ->multiple()
                    ->query(function ($query, array $data) {
                        $values = $data['values'] ?? null;

                        return $query->when(
                            filled($values),
                            fn ($q) => $q->whereHas('services', fn ($serviceQuery) => $serviceQuery->whereIn('services.id', $values)),
                        );
                    }),
                Tables\Filters\SelectFilter::make('customer_id')
                    ->label('Customer')
                    ->relationship('customer', 'name')
                    ->searchable()
                    ->preload(),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'scheduled' => 'Scheduled',
                        'in_progress' => 'In Progress',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                        'no_show' => 'No-show',
                    ]),
            ], layout: FiltersLayout::Modal)
            ->filtersTriggerAction(fn (Action $action) => $action
                ->button()
                ->label('Filter')
                ->slideOver())
            ->headerActions([
                ExportAction::make('export_service_appointments')
                    ->label('Export CSV')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->exports([
                        ExcelExport::make('service-appointments-table')
                            ->fromTable()
                            ->modifyQueryUsing(fn ($query) => $query->with([
                                'customer',
                                'vehicle',
                                'services',
                                'appointmentServices.service',
                                'appointmentServices.requirementValues.requirement',
                            ]))
                            ->withColumns([
                                Column::make('id')
                                    ->heading('ID'),
                                Column::make('customer_name')
                                    ->heading('Customer'),
                                Column::make('customer_phone')
                                    ->heading('Phone'),
                                Column::make('customer_email')
                                    ->heading('Email'),
                                Column::make('vehicle')
                                    ->heading('Vehicle')
                                    ->formatStateUsing(fn (ServiceAppointment $record) => optional($record->vehicle, fn ($vehicle) => trim("{$vehicle->year} {$vehicle->brand} {$vehicle->model}")) ?: 'N/A'),
                                Column::make('services_list')
                                    ->heading('Services')
                                    ->formatStateUsing(fn (ServiceAppointment $record) => $record->services->pluck('name')->filter()->join(', ') ?: 'N/A'),
                                Column::make('appointment_date_time')
                                    ->heading('Appointment Date')
                                    ->formatStateUsing(fn (ServiceAppointment $record) => $record->appointment_date?->format('Y-m-d') . ' ' . ($record->appointment_time ?? '')),
                                Column::make('status')
                                    ->heading('Status')
                                    ->formatStateUsing(function (ServiceAppointment $record) {
                                        $status = $record->status instanceof AppointmentStatus
                                            ? $record->status
                                            : AppointmentStatus::from($record->status);

                                        return $status->value;
                                    }),
                                Column::make('final_price')
                                    ->heading('Final Price')
                                    ->formatStateUsing(fn (ServiceAppointment $record) => $record->final_price !== null ? number_format((float) $record->final_price, 2) : 'Not set'),
                                Column::make('service_details')
                                    ->heading('Service Details')
                                    ->formatStateUsing(function (ServiceAppointment $record) {
                                        $sections = [];

                                        foreach ($record->appointmentServices as $appointmentService) {
                                            $serviceName = $appointmentService->service->name ?? 'Service';

                                            $details = $appointmentService->requirementValues
                                                ->map(function ($value) {
                                                    $label = $value->requirement?->label
                                                        ?? $value->requirement?->key
                                                        ?? 'Detail';
                                                    $raw = $value->value;

                                                    $formatted = match (true) {
                                                        is_array($raw) => implode(', ', array_filter($raw, fn ($item) => $item !== null && $item !== '')),
                                                        is_bool($raw) => $raw ? 'Yes' : 'No',
                                                        $raw === null || $raw === '' => 'Not provided',
                                                        default => (string) $raw,
                                                    };

                                                    return "{$label}: {$formatted}";
                                                })
                                                ->filter()
                                                ->values();

                                            $sections[] = $serviceName . ': ' . ($details->isNotEmpty() ? $details->join(' | ') : 'No additional details');
                                        }

                                        return implode(PHP_EOL, $sections) ?: 'No service details available';
                                    }),
                                Column::make('created_at')
                                    ->heading('Created At')
                                    ->formatStateUsing(fn (ServiceAppointment $record) => optional($record->created_at)?->toDateTimeString()),
                            ])
                            ->withWriterType(ExcelWriter::CSV)
                            ->withFilename(fn () => 'appointments-' . now()->format('Y-m-d_His'))
                            ->queue()
                            ->withChunkSize(200),
                    ]),
            ])
            ->recordActions([
                ActionGroup::make([
                    ViewAction::make()
                        ->icon('heroicon-o-eye')
                        ->color('gray')
                        ->url(fn (ServiceAppointment $record) => ServiceAppointmentResource::getUrl('view', ['record' => $record])),
                    EditAction::make()
                        ->icon('heroicon-o-pencil-square')
                        ->url(fn (ServiceAppointment $record) => ServiceAppointmentResource::getUrl('edit', ['record' => $record]))
                        ->color('primary'),
                    DeleteAction::make()
                        ->icon('heroicon-o-trash')
                        ->requiresConfirmation()
                        ->modalHeading('Delete Appointment')
                        ->modalDescription('Are you sure you want to delete this appointment? This action cannot be undone.')
                        ->modalSubmitActionLabel('Yes, delete'),
                ]),
            ])
            ->bulkActions([])
            ->defaultSort('appointment_date', 'desc');
    }
}
