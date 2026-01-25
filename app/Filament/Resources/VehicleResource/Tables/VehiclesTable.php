<?php

namespace App\Filament\Resources\VehicleResource\Tables;

use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables;
use Filament\Tables\Table;

class VehiclesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Customer')
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
            ])
            ->recordActions([
                ActionGroup::make([
                    ViewAction::make()
                        ->icon('heroicon-o-eye'),
                    EditAction::make()
                        ->icon('heroicon-o-pencil-square'),
                    DeleteAction::make()
                        ->icon('heroicon-o-trash')
                        ->requiresConfirmation()
                        ->modalHeading('Delete Vehicle')
                        ->modalDescription('Are you sure you want to delete this vehicle? This will also delete all associated appointments.')
                        ->modalSubmitActionLabel('Yes, delete'),
                ]),
            ])
            ->bulkActions([]);
    }
}
