<?php

namespace App\Filament\Resources\CustomerResource\Tables;

use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Maatwebsite\Excel\Excel as ExcelWriter;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;
use Filament\Actions\ViewAction;
use Filament\Tables;
use Filament\Tables\Table;

class CustomersTable
{
    public static function configure(Table $table): Table
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
            ->headerActions([
                ExportAction::make('export_customers')
                    ->label('Export CSV')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->exports([
                        ExcelExport::make('customers-table')
                            ->fromTable()
                            ->withWriterType(ExcelWriter::CSV)
                            ->withFilename(fn () => 'customers-' . now()->format('Y-m-d_His'))
                            ->queue()
                            ->withChunkSize(200),
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
                        ->modalHeading('Delete Customer')
                        ->modalDescription('Are you sure you want to delete this customer? This will also delete all associated vehicles and appointments.')
                        ->modalSubmitActionLabel('Yes, delete'),
                ]),
            ]);
    }
}
