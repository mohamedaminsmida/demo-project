<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Models\Service;
use Filament\Forms;
use Filament\Infolists\Components as InfolistComponents;
use Filament\Resources\Resource;
use Filament\Schemas\Components;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
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
                        Forms\Components\TextInput::make('max_concurrent_bookings')
                            ->label('Max Concurrent Bookings')
                            ->numeric()
                            ->minValue(1)
                            ->placeholder('Leave empty for no limit'),
                        Forms\Components\TextInput::make('base_price')
                            ->numeric()
                            ->prefix('$')
                            ->nullable(),
                        Forms\Components\Toggle::make('is_active')
                            ->default(true),
                    ])
                    ->columns(2),

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
                Tables\Columns\TextColumn::make('max_concurrent_bookings')
                    ->label('Max Concurrent')
                    ->sortable(),
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

    public static function infolist(Schema $infolist): Schema
    {
        return $infolist
            ->schema([
                Components\Section::make('Service Overview')
                    ->schema([
                        Components\Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('name')
                                    ->label('Name'),
                                InfolistComponents\TextEntry::make('slug')
                                    ->label('Slug'),
                                InfolistComponents\TextEntry::make('category')
                                    ->label('Category')
                                    ->badge(),
                                InfolistComponents\TextEntry::make('estimated_duration')
                                    ->label('Estimated Duration'),
                                InfolistComponents\TextEntry::make('max_concurrent_bookings')
                                    ->label('Max Concurrent Bookings')
                                    ->placeholder('No limit'),
                                InfolistComponents\TextEntry::make('base_price')
                                    ->label('Base Price')
                                    ->money('USD')
                                    ->placeholder('Not set'),
                                InfolistComponents\IconEntry::make('is_active')
                                    ->label('Active')
                                    ->boolean(),
                            ]),
                        InfolistComponents\TextEntry::make('description')
                            ->label('Description')
                            ->placeholder('No description.')
                            ->columnSpanFull(),
                    ]),
                Components\Section::make('Service Details')
                    ->schema([
                        InfolistComponents\TextEntry::make('details')
                            ->label('Details')
                            ->formatStateUsing(function ($state): ?string {
                                if (! is_array($state) || $state === []) {
                                    return null;
                                }

                                return collect($state)
                                    ->map(function ($value, $key): string {
                                        $valueText = is_array($value)
                                            ? json_encode($value)
                                            : (string) $value;

                                        return sprintf('%s: %s', $key, $valueText);
                                    })
                                    ->implode(' • ');
                            })
                            ->placeholder('No details provided.')
                            ->columnSpanFull(),
                    ]),
                Components\Section::make('Timestamps')
                    ->schema([
                        Components\Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('created_at')
                                    ->label('Created')
                                    ->dateTime('M d, Y g:i A'),
                                InfolistComponents\TextEntry::make('updated_at')
                                    ->label('Updated')
                                    ->dateTime('M d, Y g:i A'),
                            ]),
                    ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            ServiceResource\RelationManagers\RequirementsRelationManager::class,
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
