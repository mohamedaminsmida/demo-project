<?php

namespace App\Filament\Resources\ServiceAppointmentResource\Tables;

use App\Enums\AppointmentStatus;
use App\Filament\Resources\ServiceAppointmentResource;
use App\Models\ServiceAppointment;
use Carbon\Carbon;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables;
use Filament\Tables\Table;

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
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'scheduled' => 'Scheduled',
                        'in_progress' => 'In Progress',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                        'no_show' => 'No-show',
                    ]),
                Tables\Filters\TrashedFilter::make(),
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
