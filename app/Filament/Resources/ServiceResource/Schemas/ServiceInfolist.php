<?php

namespace App\Filament\Resources\ServiceResource\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ServiceInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Service Overview')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('name')
                                    ->label('Name'),
                                TextEntry::make('slug')
                                    ->label('Slug'),
                                TextEntry::make('serviceCategory.name')
                                    ->label('Service Category')
                                    ->badge(),
                                TextEntry::make('estimated_duration')
                                    ->label('Estimated Duration'),
                                TextEntry::make('max_concurrent_bookings')
                                    ->label('Max Concurrent Bookings')
                                    ->placeholder('No limit'),
                                TextEntry::make('base_price')
                                    ->label('Base Price')
                                    ->money('USD')
                                    ->placeholder('Not set'),
                                IconEntry::make('is_active')
                                    ->label('Active')
                                    ->boolean(),
                            ]),
                        TextEntry::make('description')
                            ->label('Description')
                            ->placeholder('No description.')
                            ->columnSpanFull(),
                    ]),
                Section::make('Service Details')
                    ->schema([
                        TextEntry::make('details')
                            ->label('Details')
                            ->formatStateUsing(function ($state): ?string {
                                if (! is_array($state) || $state === []) {
                                    return null;
                                }

                                return collect($state)
                                    ->map(function ($value, $key): string {
                                        $valueText = is_array($value)
                                            ? json_encode($value)
                                            : (string) $value;

                                        return sprintf('%s: %s', $key, $valueText);
                                    })
                                    ->implode(' • ');
                            })
                            ->placeholder('No details provided.')
                            ->columnSpanFull(),
                    ]),
                Section::make('Timestamps')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('created_at')
                                    ->label('Created')
                                    ->dateTime('M d, Y g:i A'),
                                TextEntry::make('updated_at')
                                    ->label('Updated')
                                    ->dateTime('M d, Y g:i A'),
                            ]),
                    ]),
            ]);
    }
}
