<?php

namespace App\Filament\Resources\CustomerResource\RelationManagers;

use App\Enums\AppointmentStatus;
use App\Models\ServiceAppointment;
use Carbon\Carbon;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class AppointmentsRelationManager extends RelationManager
{
    protected static string $relationship = 'appointments';

    protected static ?string $recordTitleAttribute = 'id';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('appointment_date_time')
                    ->label('Appointment Date')
                    ->getStateUsing(fn (ServiceAppointment $record) => Carbon::parse($record->appointment_date)->setTimeFromTimeString($record->appointment_time))
                    ->dateTime('M d, Y g:i A')
                    ->sortable(),
                Tables\Columns\TextColumn::make('vehicle_summary')
                    ->label('Vehicle')
                    ->getStateUsing(function (ServiceAppointment $record): string {
                        $vehicle = $record->vehicle;

                        if (! $vehicle) {
                            return 'N/A';
                        }

                        return trim("{$vehicle->year} {$vehicle->brand} {$vehicle->model}");
                    })
                    ->wrap(),
                Tables\Columns\TextColumn::make('services.name')
                    ->label('Services')
                    ->badge()
                    ->separator(', '),
                Tables\Columns\BadgeColumn::make('status')
                    ->color(function ($state): string {
                        $status = $state instanceof AppointmentStatus
                            ? $state
                            : AppointmentStatus::from($state);

                        return $status->badgeColor();
                    }),
                Tables\Columns\TextColumn::make('final_price')
                    ->label('Final Price')
                    ->money('USD')
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M d, Y g:i A')
                    ->toggleable(isToggledHiddenByDefault: true),
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
                        ->modalHeading('Delete Appointment')
                        ->modalDescription('Are you sure you want to delete this appointment? This action cannot be undone.')
                        ->modalSubmitActionLabel('Yes, delete'),
                ]),
            ])
            ->defaultSort('appointment_date', 'desc');
    }
}
