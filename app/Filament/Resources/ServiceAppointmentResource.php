<?php

namespace App\Filament\Resources;

use App\Enums\AppointmentStatus;
use App\Filament\Resources\ServiceAppointmentResource\Pages;
use App\Models\ServiceAppointment;
use Filament\Forms;
use Filament\Infolists\Components as InfolistComponents;
use Filament\Resources\Resource;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;
use Carbon\Carbon;
use UnitEnum;
use BackedEnum;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;

class ServiceAppointmentResource extends Resource
{
    protected static ?string $model = ServiceAppointment::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-calendar-days';

    protected static string|UnitEnum|null $navigationGroup = 'Appointments';

    protected static ?string $navigationLabel = 'Appointments';

    protected static ?int $navigationSort = 0;

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::count();
    }

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Appointment Details')
                    ->schema([
                        Forms\Components\Select::make('customer_id')
                            ->relationship('customer', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('vehicle_id')
                            ->relationship('vehicle', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->year} {$record->brand} {$record->model}")
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\DatePicker::make('appointment_date')
                            ->required(),
                        Forms\Components\Select::make('appointment_time')
                            ->options([
                                '8:00 AM' => '8:00 AM',
                                '9:00 AM' => '9:00 AM',
                                '10:00 AM' => '10:00 AM',
                                '11:00 AM' => '11:00 AM',
                                '12:00 PM' => '12:00 PM',
                                '1:00 PM' => '1:00 PM',
                                '2:00 PM' => '2:00 PM',
                                '3:00 PM' => '3:00 PM',
                                '4:00 PM' => '4:00 PM',
                                '5:00 PM' => '5:00 PM',
                            ])
                            ->required(),
                    ])
                    ->columns(2),

                Components\Section::make('Customer Contact')
                    ->schema([
                        Forms\Components\TextInput::make('customer_name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('customer_phone')
                            ->tel()
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('customer_email')
                            ->email()
                            ->required()
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Components\Section::make('Services')
                    ->schema([
                        Forms\Components\Select::make('services')
                            ->relationship(
                                name: 'services',
                                titleAttribute: 'name',
                                modifyQueryUsing: fn ($query) => $query->select(['services.id', 'services.name', 'services.slug', 'services.category', 'services.base_price'])
                            )
                            ->multiple()
                            ->preload()
                            ->searchable(),
                    ]),

                Components\Section::make('Service Details (Customer Provided)')
                    ->description('Details filled by customer during booking')
                    ->schema([
                        Forms\Components\Placeholder::make('service_details_info')
                            ->label('')
                            ->content(function ($record) {
                                if (!$record) return 'Save the appointment first to see service details.';
                                
                                $details = [];
                                foreach ($record->appointmentServices as $appointmentService) {
                                    $serviceName = $appointmentService->service->name ?? 'Unknown Service';

                                    $appointmentService->loadMissing(['requirementValues.requirement']);

                                    $requirements = $appointmentService->requirementValues
                                        ->map(function ($value) {
                                            $label = $value->requirement?->label
                                                ?? $value->requirement?->key
                                                ?? 'Requirement';
                                            $rawValue = $value->value;
                                            $formatted = match (true) {
                                                is_array($rawValue) => implode(', ', array_filter($rawValue, fn ($item) => $item !== null && $item !== '')),
                                                is_bool($rawValue) => $rawValue ? 'Yes' : 'No',
                                                $rawValue === null || $rawValue === '' => 'Not provided',
                                                default => (string) $rawValue,
                                            };

                                            return "• {$label}: {$formatted}";
                                        })
                                        ->filter(fn ($line) => $line !== null && $line !== '')
                                        ->values();

                                    if ($requirements->isEmpty()) {
                                        $details[] = "<strong>{$serviceName}</strong>: No additional details provided.";
                                        continue;
                                    }

                                    $details[] = "<strong>{$serviceName}</strong>:<br>" . implode('<br>', $requirements->all());
                                }
                                
                                return new \Illuminate\Support\HtmlString(implode('<br><br>', $details) ?: 'No service details available.');
                            }),
                    ])
                    ->collapsible()
                    ->collapsed(false),

                Components\Section::make('Pricing & Status')
                    ->schema([
                        Forms\Components\TextInput::make('final_price')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\Select::make('status')
                            ->options([
                                'scheduled' => 'Scheduled',
                                'in_progress' => 'In Progress',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                                'no_show' => 'No-show',
                            ])
                            ->default('scheduled')
                            ->required(),
                    ])
                    ->columns(3),
            ]);
    }

    public static function infolist(Schema $infolist): Schema
    {
        return $infolist
            ->schema([
                Components\Section::make('Appointment Information')
                    ->schema([
                        Components\Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('id')
                                    ->label('Appointment ID')
                                    ->badge()
                                    ->color('gray'),
                                InfolistComponents\TextEntry::make('status')
                                    ->badge()
                                    ->color(function ($state): string {
                                        $status = $state instanceof AppointmentStatus
                                            ? $state
                                            : AppointmentStatus::from($state);

                                        return $status->badgeColor();
                                    }),
                                InfolistComponents\TextEntry::make('appointment_date')
                                    ->label('Date')
                                    ->date('l, F j, Y'),
                                InfolistComponents\TextEntry::make('appointment_time')
                                    ->label('Time'),
                            ]),
                    ]),

                Components\Section::make('Customer Information')
                    ->schema([
                        Components\Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('customer_name')
                                    ->label('Full Name')
                                    ->icon('heroicon-o-user'),
                                InfolistComponents\TextEntry::make('customer_phone')
                                    ->label('Phone')
                                    ->icon('heroicon-o-phone'),
                                InfolistComponents\TextEntry::make('customer_email')
                                    ->label('Email')
                                    ->icon('heroicon-o-envelope'),
                            ]),
                    ]),

                Components\Section::make('Vehicle Information')
                    ->schema([
                        Components\Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('vehicle.year')
                                    ->label('Year'),
                                InfolistComponents\TextEntry::make('vehicle.brand')
                                    ->label('Brand'),
                                InfolistComponents\TextEntry::make('vehicle.model')
                                    ->label('Model'),
                                InfolistComponents\TextEntry::make('vehicle.type')
                                    ->label('Type'),
                                InfolistComponents\TextEntry::make('vehicle.tire_size')
                                    ->label('Tire Size')
                                    ->placeholder('Not specified'),
                                InfolistComponents\TextEntry::make('vehicle.vin')
                                    ->label('VIN')
                                    ->placeholder('Not provided'),
                            ]),
                        InfolistComponents\TextEntry::make('vehicle.notes')
                            ->label('Vehicle Notes')
                            ->placeholder('No notes')
                            ->columnSpanFull(),
                    ]),

                Components\Section::make('Service Details')
                    ->schema([
                        InfolistComponents\TextEntry::make('services.name')
                            ->label('Selected Services')
                            ->badge()
                            ->color('success')
                            ->separator(', '),
                        InfolistComponents\TextEntry::make('service_details_display')
                            ->label('Details')
                            ->html()
                            ->state(function ($record) {
                                if (!$record) return 'No details available.';
                                
                                $details = [];
                                foreach ($record->appointmentServices as $appointmentService) {
                                    $serviceName = $appointmentService->service->name ?? 'Unknown Service';
                                    $servicePrice = $appointmentService->price ? '-$' . number_format($appointmentService->price, 2) : '-$100.00';

                                    $appointmentService->loadMissing(['requirementValues.requirement']);
                                    $requirements = $appointmentService->requirementValues
                                        ->map(function ($value) {
                                            $label = $value->requirement?->label
                                                ?? $value->requirement?->key
                                                ?? 'Requirement';
                                            $rawValue = $value->value;
                                            $formatted = match (true) {
                                                is_array($rawValue) => implode(', ', array_filter($rawValue, fn ($item) => $item !== null && $item !== '')),
                                                is_bool($rawValue) => $rawValue ? 'Yes' : 'No',
                                                $rawValue === null || $rawValue === '' => 'Not provided',
                                                default => (string) $rawValue,
                                            };

                                            return "<li>• {$label}: <span class='font-medium'>{$formatted}</span></li>";
                                        })
                                        ->filter(fn ($line) => $line !== null && $line !== '')
                                        ->values();

                                    if ($requirements->isEmpty()) {
                                        $details[] = "<div class='mb-8 pb-6 border-b-2 border-gray-300 last:border-0'><div class='flex justify-between items-start mb-4'><strong class='text-lg text-gray-900'>{$serviceName}</strong><span class='text-base font-bold text-green-600 ml-4'>{$servicePrice}</span></div><p class='text-gray-500'>No additional details provided.</p></div>";
                                        continue;
                                    }

                                    $info = ["<div class='mb-8 pb-6 border-b-2 border-gray-300 last:border-0'><div class='flex justify-between items-start mb-4'><strong class='text-lg text-gray-900'>{$serviceName}</strong><span class='text-base font-bold text-green-600 ml-4 whitespace-nowrap'>{$servicePrice}</span></div><ul class='mt-2 space-y-1.5'>"];
                                    $info[] = implode('', $requirements->all());
                                    $info[] = "</ul></div>";
                                    $details[] = implode('', $info);
                                }
                                
                                return new HtmlString(implode('', $details) ?: '<p class="text-gray-500">No service details available.</p>');
                            }),
                    ])
                    ->collapsible(),

                Components\Section::make('Pricing')
                    ->schema([
                        Components\Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('final_price')
                                    ->label('Final Price')
                                    ->money('USD')
                                    ->placeholder('Not set'),
                            ]),
                    ]),

                Components\Section::make('Timestamps')
                    ->schema([
                        Components\Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('created_at')
                                    ->label('Created')
                                    ->dateTime(),
                                InfolistComponents\TextEntry::make('updated_at')
                                    ->label('Last Updated')
                                    ->dateTime(),
                            ]),
                    ]),

            ]);
    }

    public static function table(Table $table): Table
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
            ->actions([
                ActionGroup::make([
                    ViewAction::make()
                        ->icon('heroicon-o-eye')
                        ->color('gray')
                        ->url(fn (ServiceAppointment $record) => static::getUrl('view', ['record' => $record])),
                    EditAction::make()
                        ->icon('heroicon-o-pencil-square')
                        ->url(fn (ServiceAppointment $record) => static::getUrl('edit', ['record' => $record]))
                        ->color('primary'),
                    DeleteAction::make()
                        ->icon('heroicon-o-trash')
                        ->requiresConfirmation()
                        ->modalHeading('Delete Appointment')
                        ->modalDescription('Are you sure you want to delete this appointment? This action cannot be undone.')
                        ->modalSubmitActionLabel('Yes, delete'),
                ])
            ])
            ->bulkActions([
                // Bulk actions configured here
            ])
            ->defaultSort('appointment_date', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServiceAppointments::route('/'),
            'create' => Pages\CreateServiceAppointment::route('/create'),
            'view' => Pages\ViewServiceAppointment::route('/{record}'),
            'edit' => Pages\EditServiceAppointment::route('/{record}/edit'),
        ];
    }
}
