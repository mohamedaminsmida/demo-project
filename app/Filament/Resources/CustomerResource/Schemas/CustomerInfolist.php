<?php

namespace App\Filament\Resources\CustomerResource\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CustomerInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Customer')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('name')
                                    ->label('Full Name'),
                                TextEntry::make('email')
                                    ->label('Email')
                                    ->icon('heroicon-o-envelope'),
                                TextEntry::make('phone')
                                    ->label('Phone')
                                    ->icon('heroicon-o-phone'),
                                TextEntry::make('created_at')
                                    ->label('Created')
                                    ->dateTime('M d, Y g:i A'),

                                               TextEntry::make('vehicles_count')
                            ->label('Vehicles')
                            ->counts('vehicles')
                            ->badge(),
                        TextEntry::make('appointments_count')
                            ->label('Appointments')
                            ->counts('appointments')
                            ->badge(),
                            ]),
                    ]),

                Section::make('Address & Notes')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('address')
                                    ->label('Address')
                                    ->placeholder('N/A'),
                                TextEntry::make('city')
                                    ->label('City')
                                    ->placeholder('N/A'),
                                TextEntry::make('state')
                                    ->label('State')
                                    ->placeholder('N/A'),
                                TextEntry::make('zip_code')
                                    ->label('ZIP Code')
                                    ->placeholder('N/A'),
                            ]),
                        TextEntry::make('notes')
                            ->label('Notes')
                            ->placeholder('No notes provided.')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
