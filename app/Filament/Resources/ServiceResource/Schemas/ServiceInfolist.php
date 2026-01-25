<?php

namespace App\Filament\Resources\ServiceResource\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
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
                    ->columnSpanFull()
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
                Section::make('Service Image')
                    ->columnSpanFull()
                    ->schema([
                        ImageEntry::make('image')
                            ->hidden(fn ($record) => blank($record?->image))
                            ->getStateUsing(function ($record) {
                                $path = $record?->image;

                                if (! $path) {
                                    return null;
                                }

                                if (str_starts_with($path, 'http')) {
                                    return $path;
                                }

                                return asset('storage/' . ltrim($path, '/'));
                            })
                            ->label('Image')
                            ->height(280)
                            ->width('100%')
                            ->extraAttributes(['class' => 'rounded-lg shadow-md']),
                    ]),
            ]);
    }
}
