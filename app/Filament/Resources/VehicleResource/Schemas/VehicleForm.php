<?php

namespace App\Filament\Resources\VehicleResource\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VehicleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Vehicle Information')
                    ->schema([
                        Select::make('customer_id')
                            ->relationship('customer', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Select::make('type')
                            ->options([
                                'car' => 'Car',
                                'suv' => 'SUV',
                                'truck' => 'Truck',
                                'van' => 'Van',
                            ])
                            ->required(),
                        TextInput::make('brand')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('e.g., Toyota, Ford, Honda'),
                        TextInput::make('model')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('e.g., Camry, F-150, Civic'),
                        TextInput::make('year')
                            ->required()
                            ->maxLength(4)
                            ->placeholder('e.g., 2023'),
                        TextInput::make('vin')
                            ->label('VIN')
                            ->maxLength(17)
                            ->nullable(),
                        TextInput::make('tire_size')
                            ->maxLength(255)
                            ->placeholder('e.g., 225/65R17')
                            ->nullable(),
                        Toggle::make('is_primary')
                            ->label('Primary Vehicle')
                            ->default(false),
                    ])
                    ->columns(2),

                Section::make('Notes')
                    ->schema([
                        Textarea::make('notes')
                            ->rows(3)
                            ->nullable(),
                    ]),
            ]);
    }
}
