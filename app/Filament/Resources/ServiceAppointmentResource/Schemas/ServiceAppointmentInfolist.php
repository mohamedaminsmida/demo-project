<?php

namespace App\Filament\Resources\ServiceAppointmentResource\Schemas;

use App\Enums\AppointmentStatus;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Infolists\Components as InfolistComponents;
use Illuminate\Support\HtmlString;

class ServiceAppointmentInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Appointment Information')
                    ->schema([
                        Grid::make(2)
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

                Section::make('Customer Information')
                    ->schema([
                        Grid::make(2)
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

                Section::make('Vehicle Information')
                    ->schema([
                        Grid::make(2)
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

                Section::make('Service Details')
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
                                if (! $record) {
                                    return 'No details available.';
                                }

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

                Section::make('Pricing')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('final_price')
                                    ->label('Final Price')
                                    ->money('USD')
                                    ->placeholder('Not set'),
                            ]),
                    ]),

                Section::make('Timestamps')
                    ->schema([
                        Grid::make(2)
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
}
