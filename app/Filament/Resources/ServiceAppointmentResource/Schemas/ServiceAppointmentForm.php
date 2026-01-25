<?php

namespace App\Filament\Resources\ServiceAppointmentResource\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;

class ServiceAppointmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Appointment Details')
                    ->schema([
                        Select::make('customer_id')
                            ->relationship('customer', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Select::make('vehicle_id')
                            ->relationship('vehicle', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->year} {$record->brand} {$record->model}")
                            ->searchable()
                            ->preload()
                            ->required(),
                        DatePicker::make('appointment_date')
                            ->required(),
                        Select::make('appointment_time')
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

                Section::make('Customer Contact')
                    ->schema([
                        TextInput::make('customer_name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('customer_phone')
                            ->tel()
                            ->required()
                            ->maxLength(255),
                        TextInput::make('customer_email')
                            ->email()
                            ->required()
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Section::make('Services')
                    ->schema([
                        Select::make('services')
                            ->relationship(
                                name: 'services',
                                titleAttribute: 'name',
                                modifyQueryUsing: fn ($query) => $query->select(['services.id', 'services.name', 'services.slug', 'services.base_price'])
                            )
                            ->multiple()
                            ->preload()
                            ->searchable(),
                    ]),

                Section::make('Service Details (Customer Provided)')
                    ->description('Details filled by customer during booking')
                    ->schema([
                        Placeholder::make('service_details_info')
                            ->label('')
                            ->content(function ($record) {
                                if (! $record) {
                                    return 'Save the appointment first to see service details.';
                                }

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

                                return new HtmlString(implode('<br><br>', $details) ?: 'No service details available.');
                            }),
                    ])
                    ->collapsible()
                    ->collapsed(false),

                Section::make('Pricing & Status')
                    ->schema([
                        TextInput::make('final_price')
                            ->numeric()
                            ->prefix('$'),
                        Select::make('status')
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
}
