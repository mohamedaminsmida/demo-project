<?php

namespace App\Filament\Resources\UserResource\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('User')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('name')
                                    ->label('Name'),
                                TextEntry::make('email')
                                    ->label('Email')
                                    ->icon('heroicon-o-envelope'),
                                TextEntry::make('phone')
                                    ->label('Phone')
                                    ->icon('heroicon-o-phone')
                                    ->placeholder('N/A'),
                                TextEntry::make('created_at')
                                    ->label('Created')
                                    ->dateTime('M d, Y g:i A'),
                            ]),
                    ]),

                Section::make('Address')
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
                    ]),
            ]);
    }
}
