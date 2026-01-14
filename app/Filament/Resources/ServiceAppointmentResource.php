<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceAppointmentResource\Pages;
use App\Models\ServiceAppointment;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use UnitEnum;
use BackedEnum;

class ServiceAppointmentResource extends Resource
{
    protected static ?string $model = ServiceAppointment::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-calendar-days';

    protected static string|UnitEnum|null $navigationGroup = 'Appointments';

    protected static ?string $navigationLabel = 'Appointments';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Appointment Details')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'name')
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
                        Forms\Components\Toggle::make('sms_updates')
                            ->label('SMS Updates'),
                    ])
                    ->columns(2),

                Components\Section::make('Services')
                    ->schema([
                        Forms\Components\Select::make('services')
                            ->relationship('services', 'name')
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
                                    $detail = $appointmentService->details;
                                    
                                    if (!$detail) {
                                        $details[] = "<strong>{$serviceName}</strong>: No additional details provided.";
                                        continue;
                                    }
                                    
                                    $info = ["<strong>{$serviceName}</strong>:"];
                                    
                                    // Tire details
                                    if ($detail->tire_condition) $info[] = "• Tire Condition: {$detail->tire_condition}";
                                    if ($detail->number_of_tires) $info[] = "• Number of Tires: {$detail->number_of_tires}";
                                    if ($detail->tpms_service) $info[] = "• TPMS Service: Yes";
                                    if ($detail->alignment_service) $info[] = "• Alignment Service: Yes";
                                    
                                    // Oil details
                                    if ($detail->oil_type) $info[] = "• Oil Type: {$detail->oil_type}";
                                    if ($detail->last_change_date) $info[] = "• Last Change Date: " . $detail->last_change_date->format('M d, Y');
                                    
                                    // Brake details
                                    if ($detail->brake_position) $info[] = "• Brake Position: {$detail->brake_position}";
                                    if ($detail->noise_or_vibration) $info[] = "• Noise/Vibration: Yes";
                                    if ($detail->warning_light) $info[] = "• Warning Light: Yes";
                                    
                                    // Repair details
                                    if ($detail->problem_description) $info[] = "• Problem: {$detail->problem_description}";
                                    if ($detail->vehicle_drivable) $info[] = "• Vehicle Drivable: {$detail->vehicle_drivable}";
                                    
                                    $details[] = implode('<br>', $info);
                                }
                                
                                return new \Illuminate\Support\HtmlString(implode('<br><br>', $details) ?: 'No service details available.');
                            }),
                    ])
                    ->collapsible()
                    ->collapsed(false),

                Components\Section::make('Pricing & Status')
                    ->schema([
                        Forms\Components\TextInput::make('estimated_price')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\TextInput::make('final_price')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'confirmed' => 'Confirmed',
                                'in_progress' => 'In Progress',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                            ])
                            ->default('pending')
                            ->required(),
                    ])
                    ->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
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
                Tables\Columns\TextColumn::make('appointment_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('appointment_time'),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'primary' => 'confirmed',
                        'info' => 'in_progress',
                        'success' => 'completed',
                        'danger' => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('estimated_price')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'in_progress' => 'In Progress',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                // Actions configured in pages
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
