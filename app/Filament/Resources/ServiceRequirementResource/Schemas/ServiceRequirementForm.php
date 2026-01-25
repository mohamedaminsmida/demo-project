<?php

namespace App\Filament\Resources\ServiceRequirementResource\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ServiceRequirementForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Requirement Details')
                    ->schema([
                        Select::make('service_id')
                            ->relationship('service', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        TextInput::make('label')
                            ->required()
                            ->maxLength(255),
                        Hidden::make('key')
                            ->dehydrated(),
                        Select::make('type')
                            ->options([
                                'text' => 'Text',
                                'textarea' => 'Textarea',
                                'number' => 'Number',
                                'select' => 'Select',
                                'multiselect' => 'Multi Select',
                                'radio' => 'Radio',
                                'checkbox' => 'Checkbox',
                                'toggle' => 'Toggle',
                                'date' => 'Date',
                            ])
                            ->required()
                            ->live()
                            ->default('text'),
                        TextInput::make('price')
                            ->label('Price')
                            ->numeric()
                            ->minValue(0)
                            ->prefix('$')
                            ->visible(fn (callable $get) => in_array($get('type'), ['checkbox', 'toggle'], true))
                            ->helperText('Optional additional charge when enabled.'),
                        TextInput::make('validations.number_max_length')
                            ->label('Max Digits')
                            ->numeric()
                            ->minValue(1)
                            ->required(fn (callable $get) => $get('type') === 'number')
                            ->visible(fn (callable $get) => $get('type') === 'number')
                            ->helperText('Maximum number of digits allowed.'),
                        DatePicker::make('validations.min_date')
                            ->label('Min Date')
                            ->required(fn (callable $get) => $get('type') === 'date')
                            ->visible(fn (callable $get) => $get('type') === 'date'),
                        DatePicker::make('validations.max_date')
                            ->label('Max Date')
                            ->required(fn (callable $get) => $get('type') === 'date')
                            ->visible(fn (callable $get) => $get('type') === 'date'),
                        Repeater::make('options')
                            ->schema([
                                TextInput::make('label')
                                    ->required(),
                                TextInput::make('value')
                                    ->required()
                                    ->distinct(),
                                TextInput::make('price')
                                    ->numeric()
                                    ->minValue(0)
                                    ->prefix('$'),
                            ])
                            ->columns(3)
                            ->addActionLabel('Add Option')
                            ->visible(fn (callable $get) => in_array($get('type'), ['select', 'multiselect', 'radio'], true)),
                        Toggle::make('is_required')
                            ->label('Required')
                            ->default(false),
                        TextInput::make('placeholder')
                            ->maxLength(255),
                        TextInput::make('help_text')
                            ->maxLength(255),
                        TextInput::make('sort_order')
                            ->label('Sort Order')
                            ->numeric()
                            ->default(0),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
