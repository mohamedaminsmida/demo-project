<?php

namespace App\Filament\Resources\ServiceResource\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Service Information')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Select::make('service_category_id')
                            ->label('Service Category')
                            ->relationship('serviceCategory', 'name')
                            ->searchable()
                            ->required()
                            ->preload(),
                        Textarea::make('description')
                            ->required()
                            ->rows(3)
                            ->helperText('Short description for the service'),
                        KeyValue::make('details')
                            ->label('Service Details')
                            ->keyLabel('Field Name')
                            ->valueLabel('Value')
                            ->addButtonLabel('Add Detail')
                            ->helperText('Add detailed information like "includes", "pricing_tiers", etc.')
                            ->nullable(),
                        FileUpload::make('image')
                            ->label('Service Image')
                            ->image()
                            ->disk('public')
                            ->directory('services')
                            ->visibility('public')
                            ->maxSize(2048)
                            ->nullable()
                            ->helperText('Upload an image for this service (max 2MB)'),
                        TextInput::make('estimated_duration')
                            ->required()
                            ->placeholder('e.g., 1-2 hours'),
                        TextInput::make('max_concurrent_bookings')
                            ->label('Max Concurrent Bookings')
                            ->numeric()
                            ->minValue(1)
                            ->placeholder('Leave empty for no limit'),
                        TextInput::make('base_price')
                            ->numeric()
                            ->prefix('$')
                            ->nullable(),
                        Toggle::make('is_active')
                            ->default(true),
                    ])
                    ->columns(2),
            ]);
    }
}
