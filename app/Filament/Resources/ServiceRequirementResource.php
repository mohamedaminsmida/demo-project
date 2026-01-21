<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceRequirementResource\Pages;
use App\Models\ServiceRequirement;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use UnitEnum;
use BackedEnum;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;

class ServiceRequirementResource extends Resource
{
    protected static ?string $model = ServiceRequirement::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static string|UnitEnum|null $navigationGroup = 'Services';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Requirement Details')
                    ->schema([
                        Forms\Components\Select::make('service_id')
                            ->relationship('service', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\TextInput::make('label')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Hidden::make('key')
                            ->dehydrated(),
                        Forms\Components\Select::make('type')
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
                        Forms\Components\TextInput::make('price')
                            ->label('Price')
                            ->numeric()
                            ->minValue(0)
                            ->prefix('$')
                            ->visible(fn (callable $get) => in_array($get('type'), ['checkbox', 'toggle'], true))
                            ->helperText('Optional additional charge when enabled.'),
                        Forms\Components\TextInput::make('validations.number_max_length')
                            ->label('Max Digits')
                            ->numeric()
                            ->minValue(1)
                            ->required(fn (callable $get) => $get('type') === 'number')
                            ->visible(fn (callable $get) => $get('type') === 'number')
                            ->helperText('Maximum number of digits allowed.'),
                        Forms\Components\DatePicker::make('validations.min_date')
                            ->label('Min Date')
                            ->required(fn (callable $get) => $get('type') === 'date')
                            ->visible(fn (callable $get) => $get('type') === 'date'),
                        Forms\Components\DatePicker::make('validations.max_date')
                            ->label('Max Date')
                            ->required(fn (callable $get) => $get('type') === 'date')
                            ->visible(fn (callable $get) => $get('type') === 'date'),
                        Forms\Components\Repeater::make('options')
                            ->schema([
                                Forms\Components\TextInput::make('label')
                                    ->required(),
                                Forms\Components\TextInput::make('value')
                                    ->required()
                                    ->distinct(),
                                Forms\Components\TextInput::make('price')
                                    ->numeric()
                                    ->minValue(0)
                                    ->prefix('$'),
                            ])
                            ->columns(3)
                            ->addActionLabel('Add Option')
                            ->visible(fn (callable $get) => in_array($get('type'), ['select', 'multiselect', 'radio'], true)),
                        Forms\Components\Toggle::make('is_required')
                            ->label('Required')
                            ->default(false),
                        Forms\Components\TextInput::make('placeholder')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('help_text')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('sort_order')
                            ->label('Sort Order')
                            ->numeric()
                            ->default(0),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('service.name')
                    ->label('Service')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('label')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('key')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\BadgeColumn::make('type'),
                Tables\Columns\IconColumn::make('is_required')
                    ->label('Required')
                    ->boolean(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Sort')
                    ->sortable(),
            ])
            ->actions([
                ActionGroup::make([
                    ViewAction::make()
                        ->icon('heroicon-o-eye'),
                    EditAction::make()
                        ->icon('heroicon-o-pencil-square'),
                    DeleteAction::make()
                        ->icon('heroicon-o-trash')
                        ->requiresConfirmation(),
                ]),
            ])
            ->bulkActions([
                //
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServiceRequirements::route('/'),
            'create' => Pages\CreateServiceRequirement::route('/create'),
            'view' => Pages\ViewServiceRequirement::route('/{record}'),
            'edit' => Pages\EditServiceRequirement::route('/{record}/edit'),
        ];
    }
}
