<?php

namespace App\Filament\Resources\ServiceResource\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Utilities\Set;

class ServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Service Information')
                    ->schema([
                        \Filament\Schemas\Components\Grid::make(2)
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
                                     TextInput::make('base_price')
                                    ->numeric()
                                    ->minValue(0)
                                    ->prefix('$')
                                    ->nullable(),
                                Textarea::make('description')
                                    ->required()
                                    ->rows(3)
                                    ->helperText('Short description for the service')
                                    ->columnSpanFull(),
                                FileUpload::make('image')
                                    ->label('Service Image')
                                    ->image()
                                    ->disk('public')
                                    ->directory('services')
                                    ->visibility('public')
                                    ->maxSize(2048)
                                    ->nullable()
                                    ->helperText('Upload an image for this service (max 2MB)')
                                    ->columnSpanFull(),
                                TextInput::make('estimated_duration')
                                    ->required()
                                    ->reactive()
                                    ->afterStateUpdated(function (Set $set, ?string $state): void {
                                        if ($state === null) {
                                            return;
                                        }

                                        $digits = preg_replace('/\D/', '', $state);

                                        if (strlen($digits) !== 4) {
                                            return;
                                        }

                                        $formatted = substr($digits, 0, 2) . ' - ' . substr($digits, 2, 2);

                                        if ($formatted !== $state) {
                                            $set('estimated_duration', $formatted);
                                        }
                                    })
                                    ->rule('regex:/^\d{2}\s?-\s?\d{2}$/')
                                    ->placeholder('e.g., 12 - 32')
                                    ->helperText('Enter two two-digit numbers like "12 - 32".'),
                                TextInput::make('max_concurrent_bookings')
                                    ->label('Max Concurrent Bookings')
                                    ->numeric()
                                    ->minValue(1)
                                    ->placeholder('Leave empty for no limit'),
                                Toggle::make('is_active')
                                    ->default(true),
                            ]),
                    ])
                    ->columnSpan('full'),
            ]);
    }
}
