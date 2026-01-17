<?php

namespace App\Filament\Resources\ServiceAppointmentResource\Pages;

use App\Filament\Resources\ServiceAppointmentResource;
use App\Filament\Resources\ServiceAppointmentResource\Widgets\Appointments;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListServiceAppointments extends ListRecords
{
    protected static string $resource = ServiceAppointmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            Appointments::class,
        ];
    }
}
