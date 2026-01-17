<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CustomerResource\Pages;
use App\Models\Customer;
use Filament\Forms;
use Filament\Infolists\Components as InfolistComponents;
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

class CustomerResource extends Resource
{
    protected static ?string $model = Customer::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-user-group';

    protected static string|UnitEnum|null $navigationGroup = 'Customers';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Customer Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\TextInput::make('phone')
                            ->tel()
                            ->required()
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Components\Section::make('Address')
                    ->schema([
                        Forms\Components\TextInput::make('address')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('city')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('state')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('zip_code')
                            ->maxLength(20),
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
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable(),
                Tables\Columns\TextColumn::make('vehicles_count')
                    ->counts('vehicles')
                    ->label('Vehicles'),
                Tables\Columns\TextColumn::make('appointments_count')
                    ->counts('appointments')
                    ->label('Appointments'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
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
                        ->modalHeading('Delete Customer')
                        ->modalDescription('Are you sure you want to delete this customer? This will also delete all associated vehicles and appointments.')
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
                Components\Section::make('Customer')
                    ->schema([
                        Components\Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('name')
                                    ->label('Full Name'),
                                InfolistComponents\TextEntry::make('email')
                                    ->label('Email')
                                    ->icon('heroicon-o-envelope'),
                                InfolistComponents\TextEntry::make('phone')
                                    ->label('Phone')
                                    ->icon('heroicon-o-phone'),
                                InfolistComponents\TextEntry::make('created_at')
                                    ->label('Created')
                                    ->dateTime('M d, Y g:i A'),
                            ]),
                    ]),

                Components\Section::make('Address & Notes')
                    ->schema([
                        Components\Grid::make(2)
                            ->schema([
                                InfolistComponents\TextEntry::make('address')
                                    ->label('Address')
                                    ->placeholder('N/A'),
                                InfolistComponents\TextEntry::make('city')
                                    ->label('City')
                                    ->placeholder('N/A'),
                                InfolistComponents\TextEntry::make('state')
                                    ->label('State')
                                    ->placeholder('N/A'),
                                InfolistComponents\TextEntry::make('zip_code')
                                    ->label('ZIP Code')
                                    ->placeholder('N/A'),
                            ]),
                        InfolistComponents\TextEntry::make('notes')
                            ->label('Notes')
                            ->placeholder('No notes provided.')
                            ->columnSpanFull(),
                    ]),

                Components\Section::make('Related Data')
                    ->schema([
                        InfolistComponents\TextEntry::make('vehicles_count')
                            ->label('Vehicles')
                            ->counts('vehicles')
                            ->badge(),
                        InfolistComponents\TextEntry::make('appointments_count')
                            ->label('Appointments')
                            ->counts('appointments')
                            ->badge(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            CustomerResource\RelationManagers\AppointmentsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCustomers::route('/'),
            'create' => Pages\CreateCustomer::route('/create'),
            'view' => Pages\ViewCustomer::route('/{record}'),
            'edit' => Pages\EditCustomer::route('/{record}/edit'),
        ];
    }
}
