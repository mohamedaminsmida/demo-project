<?php

namespace App\Filament\Resources\VehicleResource\RelationManagers;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Builder;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class CustomerRelationManager extends RelationManager
{
    protected static string $relationship = 'customer';

    protected static ?string $recordTitleAttribute = 'name';

    protected function getTableQuery(): Builder
    {
        $customerId = $this->getOwnerRecord()?->customer_id;

        if (! $customerId) {
            return Customer::query()->whereRaw('1 = 0');
        }

        return Customer::query()->whereKey($customerId);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone')
                    ->label('Phone'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M d, Y g:i A')
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
                        ->requiresConfirmation()
                        ->modalHeading('Delete Customer')
                        ->modalDescription('Are you sure you want to delete this customer? This will also delete all associated vehicles and appointments.')
                        ->modalSubmitActionLabel('Yes, delete'),
                ]),
            ]);
    }
}
