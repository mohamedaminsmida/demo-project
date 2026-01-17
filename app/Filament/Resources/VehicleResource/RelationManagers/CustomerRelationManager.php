<?php

namespace App\Filament\Resources\VehicleResource\RelationManagers;

use App\Filament\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Builder;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
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
            ->recordActions([
                ActionGroup::make([
                    Action::make('view')
                        ->icon('heroicon-o-eye')
                        ->url(fn (Customer $record) => CustomerResource::getUrl('view', ['record' => $record])),
                    Action::make('edit')
                        ->icon('heroicon-o-pencil-square')
                        ->url(fn (Customer $record) => CustomerResource::getUrl('edit', ['record' => $record])),
                    Action::make('delete')
                        ->icon('heroicon-o-trash')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(fn (Customer $record) => $record->delete())
                        ->modalHeading('Delete Customer')
                        ->modalDescription('Are you sure you want to delete this customer? This will also delete all associated vehicles and appointments.')
                        ->modalSubmitActionLabel('Yes, delete'),
                ]),
            ]);
    }
}
