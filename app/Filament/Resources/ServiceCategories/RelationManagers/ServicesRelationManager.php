<?php

namespace App\Filament\Resources\ServiceCategories\RelationManagers;

use App\Filament\Resources\ServiceResource;
use App\Models\Service;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ServicesRelationManager extends RelationManager
{
    protected static string $relationship = 'services';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(\Filament\Schemas\Schema $form): \Filament\Schemas\Schema
    {
        return $form
            ->schema([
                \Filament\Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                \Filament\Forms\Components\TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),
                \Filament\Forms\Components\Textarea::make('description')
                    ->required()
                    ->rows(3),
                \Filament\Forms\Components\TextInput::make('estimated_duration')
                    ->required()
                    ->placeholder('e.g., 1-2 hours'),
                \Filament\Forms\Components\TextInput::make('base_price')
                    ->numeric()
                    ->prefix('$')
                    ->nullable(),
                \Filament\Forms\Components\Toggle::make('is_active')
                    ->default(true),
            ])
            ->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                Tables\Columns\TextColumn::make('base_price')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('estimated_duration'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ActionGroup::make([
                    Action::make('view')
                        ->icon('heroicon-o-eye')
                        ->url(fn (Service $record) => ServiceResource::getUrl('view', ['record' => $record])),
                    Action::make('edit')
                        ->icon('heroicon-o-pencil-square')
                        ->url(fn (Service $record) => ServiceResource::getUrl('edit', ['record' => $record])),
                ]),
            ])
            ->bulkActions([
                //
            ]);
    }
}
