<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VehicleResource\Pages;
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use UnitEnum;
use BackedEnum;

class VehicleResource extends Resource
{
    protected static ?string $model = Vehicle::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-truck';

    protected static string|UnitEnum|null $navigationGroup = 'Customers';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Vehicle Information')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('type')
                            ->options([
                                'car' => 'Car',
                                'suv' => 'SUV',
                                'truck' => 'Truck',
                                'van' => 'Van',
                            ])
                            ->required(),
                        Forms\Components\TextInput::make('brand')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('e.g., Toyota, Ford, Honda'),
                        Forms\Components\TextInput::make('model')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('e.g., Camry, F-150, Civic'),
                        Forms\Components\TextInput::make('year')
                            ->required()
                            ->maxLength(4)
                            ->placeholder('e.g., 2023'),
                        Forms\Components\TextInput::make('vin')
                            ->label('VIN')
                            ->maxLength(17)
                            ->nullable(),
                        Forms\Components\TextInput::make('tire_size')
                            ->maxLength(255)
                            ->placeholder('e.g., 225/65R17')
                            ->nullable(),
                        Forms\Components\Toggle::make('is_primary')
                            ->label('Primary Vehicle')
                            ->default(false),
                    ])
                    ->columns(2),

                Components\Section::make('Notes')
                    ->schema([
                        Forms\Components\Textarea::make('notes')
                            ->rows(3)
                            ->nullable(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Owner')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('full_name')
                    ->label('Vehicle')
                    ->getStateUsing(fn ($record) => "{$record->year} {$record->brand} {$record->model}")
                    ->searchable(['brand', 'model']),
                Tables\Columns\BadgeColumn::make('type')
                    ->colors([
                        'primary' => 'car',
                        'success' => 'suv',
                        'warning' => 'truck',
                        'info' => 'van',
                    ]),
                Tables\Columns\TextColumn::make('tire_size'),
                Tables\Columns\IconColumn::make('is_primary')
                    ->boolean()
                    ->label('Primary'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'car' => 'Car',
                        'suv' => 'SUV',
                        'truck' => 'Truck',
                        'van' => 'Van',
                    ]),
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                // Actions configured in pages
            ])
            ->bulkActions([
                // Bulk actions configured here
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
            'index' => Pages\ListVehicles::route('/'),
            'create' => Pages\CreateVehicle::route('/create'),
            'edit' => Pages\EditVehicle::route('/{record}/edit'),
        ];
    }
}
