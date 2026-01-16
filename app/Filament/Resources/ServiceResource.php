<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Models\Service;
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

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-wrench-screwdriver';

    protected static string|UnitEnum|null $navigationGroup = 'Services';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Service Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\Select::make('category')
                            ->options([
                                'tires' => 'Tires & Wheels',
                                'maintenance' => 'Maintenance',
                                'repairs' => 'Repairs',
                            ])
                            ->required(),
                        Forms\Components\Textarea::make('description')
                            ->required()
                            ->rows(3)
                            ->helperText('Short description for the service'),
                        Forms\Components\KeyValue::make('details')
                            ->label('Service Details')
                            ->keyLabel('Field Name')
                            ->valueLabel('Value')
                            ->addButtonLabel('Add Detail')
                            ->helperText('Add detailed information like "includes", "pricing_tiers", etc.')
                            ->nullable(),
                        Forms\Components\FileUpload::make('image')
                            ->label('Service Image')
                            ->image()
                            ->disk('public')
                            ->directory('services')
                            ->visibility('public')
                            ->maxSize(2048)
                            ->nullable()
                            ->helperText('Upload an image for this service (max 2MB)'),
                        Forms\Components\TextInput::make('estimated_duration')
                            ->required()
                            ->placeholder('e.g., 1-2 hours'),
                        Forms\Components\TextInput::make('base_price')
                            ->numeric()
                            ->prefix('$')
                            ->nullable(),
                        Forms\Components\Toggle::make('is_active')
                            ->default(true),
                    ])
                    ->columns(2),

                Components\Section::make('Required Form Fields')
                    ->description('Select which fields users must fill out when booking this service')
                    ->schema([
                        Forms\Components\CheckboxList::make('required_fields')
                            ->options([
                                // Tire fields
                                'tire_condition' => 'Tire Condition (New/Used)',
                                'number_of_tires' => 'Number of Tires',
                                'tpms_service' => 'TPMS Service',
                                'alignment_service' => 'Alignment Service',
                                'wheel_type' => 'Wheel Type',
                                // Oil change fields
                                'oil_type' => 'Oil Type',
                                'last_change_date' => 'Last Change Date',
                                // Brake fields
                                'brake_position' => 'Brake Position',
                                'noise_or_vibration' => 'Noise or Vibration',
                                'warning_light' => 'Warning Light',
                                // Repair fields
                                'problem_description' => 'Problem Description',
                                'vehicle_drivable' => 'Vehicle Drivable',
                                'photo_paths' => 'Photo Upload',
                            ])
                            ->columns(3),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Image')
                    ->circular()
                    ->defaultImageUrl(url('/images/default-service.png')),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                Tables\Columns\BadgeColumn::make('category')
                    ->colors([
                        'primary' => 'tires',
                        'success' => 'maintenance',
                        'warning' => 'repairs',
                    ]),
                Tables\Columns\TextColumn::make('base_price')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('estimated_duration'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'tires' => 'Tires & Wheels',
                        'maintenance' => 'Maintenance',
                        'repairs' => 'Repairs',
                    ]),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active'),
            ])
            ->actions([
                ActionGroup::make([
                    ViewAction::make()
                        ->icon('heroicon-o-eye'),
                    EditAction::make()
                        ->icon('heroicon-o-pencil-square'),
                    DeleteAction::make()
                        ->icon('heroicon-o-trash')
                        ->requiresConfirmation()
                        ->modalHeading('Delete Service')
                        ->modalDescription('Are you sure you want to delete this service? This action cannot be undone.')
                        ->modalSubmitActionLabel('Yes, delete'),
                ])
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
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'view' => Pages\ViewService::route('/{record}'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
