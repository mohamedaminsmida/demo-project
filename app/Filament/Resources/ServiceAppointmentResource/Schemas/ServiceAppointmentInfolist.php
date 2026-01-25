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
                    ->collapsible()
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('status')
                                    ->badge()
                                    ->color(function ($state): string {
                                        $status = $state instanceof AppointmentStatus
                                            ? $state
                                            : AppointmentStatus::from($state);

                                        return $status->badgeColor();
                                    }),
                                          InfolistComponents\TextEntry::make('final_price')
                                    ->label('Final Price')
                                    ->money('USD')
                                    ->badge()
                                    ->placeholder('Not set'),
                                InfolistComponents\TextEntry::make('appointment_date')
                                    ->label('Date')
                                    ->date('l, F j, Y'),
                                InfolistComponents\TextEntry::make('appointment_time')
                                    ->label('Time'),
                            ]),
                    ]),

                Section::make('Customer Information')
                    ->collapsible()
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
                                InfolistComponents\TextEntry::make('customer_address')
                                    ->label('Address')
                                    ->placeholder('Not provided'),
                            ]),
                    ]),

                Section::make('Vehicle Information')
                    ->collapsible()
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
                                InfolistComponents\TextEntry::make('vehicle.vin')
                                    ->label('VIN')
                                    ->placeholder('Not provided'),
                                InfolistComponents\TextEntry::make('vehicle.notes')
                                    ->label('Vehicle Notes')
                                    ->placeholder('No notes')
                                    ->columnSpanFull(),
                            ]),
                    ]),

                Section::make('Service Details')
                    ->collapsible()
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
                                    $rawPrice = $appointmentService->price ?? $appointmentService->service->base_price;
                                    $servicePrice = $rawPrice !== null
                                        ? '$' . number_format((float) $rawPrice, 2)
                                        : 'Not priced';

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

                                            return "<div class='flex flex-col rounded-md border border-gray-100 bg-white/60 px-3 py-2'><div class='text-xs uppercase tracking-wide text-gray-500'>{$label}</div><div class='text-sm font-medium text-gray-900'>{$formatted}</div></div>";
                                        })
                                        ->filter(fn ($line) => $line !== null && $line !== '')
                                        ->values();

                                    if ($requirements->isEmpty()) {
                                        $details[] = "<div class='rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm'><div class='flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3'><strong class='text-lg text-gray-900'>{$serviceName}</strong><span class='text-sm font-semibold text-emerald-700'>{$servicePrice}</span></div><p class='mt-3 text-sm text-gray-500'>No additional details provided.</p></div>";
                                        continue;
                                    }

                                    $info = ["<div class='rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm'><div class='flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3'><strong class='text-lg text-gray-900'>{$serviceName}</strong><span class='text-sm font-semibold text-emerald-700'>{$servicePrice}</span></div><div class='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2'>"];
                                    $info[] = implode('', $requirements->all());
                                    $info[] = "</div></div>";
                                    $details[] = implode('', $info);
                                }

                                return new HtmlString(implode('', $details) ?: '<p class="text-gray-500">No service details available.</p>');
                            }),
                    ])
                    ->collapsible(),
            ]);
    }
}
