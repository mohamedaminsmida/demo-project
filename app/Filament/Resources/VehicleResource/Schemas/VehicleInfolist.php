<?php

namespace App\Filament\Resources\VehicleResource\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VehicleInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Vehicle')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('customer.name')
                                    ->label('Customer'),
                                TextEntry::make('type')
                                    ->label('Type')
                                    ->badge(),
                                TextEntry::make('brand')
                                    ->label('Brand'),
                                TextEntry::make('model')
                                    ->label('Model'),
                                TextEntry::make('year')
                                    ->label('Year'),
                                TextEntry::make('vin')
                                    ->label('VIN')
                                    ->placeholder('Not provided'),
                                TextEntry::make('tire_size')
                                    ->label('Tire Size')
                                    ->placeholder('Not specified'),
                            ]),
                    ]),

                Section::make('Notes & Timestamps')
                    ->schema([
                        TextEntry::make('notes')
                            ->label('Notes')
                            ->placeholder('No notes provided.')
                            ->columnSpanFull(),
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
