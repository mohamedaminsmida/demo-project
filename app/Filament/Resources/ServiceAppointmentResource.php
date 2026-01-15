<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceAppointmentResource\Pages;
use App\Models\ServiceAppointment;
use Filament\Forms;
use Filament\Infolists\Components as InfolistComponents;
use Filament\Resources\Resource;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Actions\Action as TableAction;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;
use UnitEnum;
use BackedEnum;

class ServiceAppointmentResource extends Resource
{
    protected static ?string $model = ServiceAppointment::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-calendar-days';

    protected static string|UnitEnum|null $navigationGroup = 'Appointments';

    protected static ?string $navigationLabel = 'Appointments';

    protected static ?int $navigationSort = 1;

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
                                    if ($detail->symptom_type) {
                                        $symptomLabels = [
                                            'noise' => 'Unusual noise',
                                            'vibration' => 'Vibration or shaking',
                                            'warning_light' => 'Warning light on dashboard',
                                            'performance' => 'Performance issue',
                                            'leak' => 'Fluid leak',
                                            'electrical' => 'Electrical problem',
                                            'other' => 'Other',
                                        ];
                                        $symptomLabel = $symptomLabels[$detail->symptom_type] ?? $detail->symptom_type;
                                        $info[] = "• Symptom Type: {$symptomLabel}";
                                    }
                                    if ($detail->other_symptom_description) $info[] = "• Other Symptom: {$detail->other_symptom_description}";
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
                                    ->color(fn (string $state): string => match ($state) {
                                        'pending' => 'warning',
                                        'confirmed' => 'primary',
                                        'in_progress' => 'info',
                                        'completed' => 'success',
                                        'cancelled' => 'danger',
                                        default => 'gray',
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
                                InfolistComponents\IconEntry::make('sms_updates')
                                    ->label('SMS Updates')
                                    ->boolean(),
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
                                    $detail = $appointmentService->details;
                                    
                                    if (!$detail) {
                                        $details[] = "<div class='mb-8 pb-6 border-b-2 border-gray-300 last:border-0'><div class='flex justify-between items-start mb-4'><strong class='text-lg text-gray-900'>{$serviceName}</strong><span class='text-base font-bold text-green-600 ml-4'>{$servicePrice}</span></div><p class='text-gray-500'>No additional details provided.</p></div>";
                                        continue;
                                    }
                                    
                                    $info = ["<div class='mb-8 pb-6 border-b-2 border-gray-300 last:border-0'><div class='flex justify-between items-start mb-4'><strong class='text-lg text-gray-900'>{$serviceName}</strong><span class='text-base font-bold text-green-600 ml-4 whitespace-nowrap'>{$servicePrice}</span></div><ul class='mt-2 space-y-1.5'>"];
                                    
                                    // Tire details
                                    if ($detail->tire_condition) $info[] = "<li>• Tire Condition: <span class='font-medium'>{$detail->tire_condition}</span></li>";
                                    if ($detail->number_of_tires) $info[] = "<li>• Number of Tires: <span class='font-medium'>{$detail->number_of_tires}</span></li>";
                                    if ($detail->tpms_service) $info[] = "<li>• TPMS Service: <span class='font-medium text-green-600'>Yes</span></li>";
                                    if ($detail->alignment_service) $info[] = "<li>• Alignment Service: <span class='font-medium text-green-600'>Yes</span></li>";
                                    
                                    // Oil details
                                    if ($detail->oil_type) $info[] = "<li>• Oil Type: <span class='font-medium'>{$detail->oil_type}</span></li>";
                                    if ($detail->last_change_date) $info[] = "<li>• Last Change Date: <span class='font-medium'>" . $detail->last_change_date->format('M d, Y') . "</span></li>";
                                    
                                    // Brake details
                                    if ($detail->brake_position) $info[] = "<li>• Brake Position: <span class='font-medium'>{$detail->brake_position}</span></li>";
                                    if ($detail->noise_or_vibration) $info[] = "<li>• Noise/Vibration: <span class='font-medium text-yellow-600'>Yes</span></li>";
                                    if ($detail->warning_light) $info[] = "<li>• Warning Light: <span class='font-medium text-red-600'>Yes</span></li>";
                                    
                                    // Repair details
                                    if ($detail->symptom_type) {
                                        $symptomLabels = [
                                            'noise' => 'Unusual noise',
                                            'vibration' => 'Vibration or shaking',
                                            'warning_light' => 'Warning light on dashboard',
                                            'performance' => 'Performance issue',
                                            'leak' => 'Fluid leak',
                                            'electrical' => 'Electrical problem',
                                            'other' => 'Other',
                                        ];
                                        $symptomLabel = $symptomLabels[$detail->symptom_type] ?? $detail->symptom_type;
                                        $info[] = "<li>• Symptom Type: <span class='font-medium'>{$symptomLabel}</span></li>";
                                    }
                                    if ($detail->other_symptom_description) $info[] = "<li>• Other Symptom: <span class='font-medium'>{$detail->other_symptom_description}</span></li>";
                                    if ($detail->problem_description) $info[] = "<li>• Problem Description: <span class='font-medium'>{$detail->problem_description}</span></li>";
                                    if ($detail->vehicle_drivable) {
                                        $drivableClass = $detail->vehicle_drivable === 'yes' ? 'text-green-600' : 'text-red-600';
                                        $drivableText = $detail->vehicle_drivable === 'yes' ? 'Yes' : 'No (needs towing)';
                                        $info[] = "<li>• Vehicle Drivable: <span class='font-medium {$drivableClass}'>{$drivableText}</span></li>";
                                    }
                                    
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
                                InfolistComponents\TextEntry::make('estimated_price')
                                    ->label('Estimated Price')
                                    ->money('USD')
                                    ->placeholder('Not set'),
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
                    ])
                    
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
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
                TableAction::make('view')
                    ->icon('heroicon-o-eye')
                    ->color('gray')
                    ->url(fn (ServiceAppointment $record) => static::getUrl('view', ['record' => $record]))
                    ->openUrlInNewTab(),
                TableAction::make('edit')
                    ->icon('heroicon-o-pencil-square')
                    ->url(fn (ServiceAppointment $record) => static::getUrl('edit', ['record' => $record]))
                    ->color('primary'),
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
