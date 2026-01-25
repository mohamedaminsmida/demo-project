<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceAppointmentResource\Pages;
use App\Filament\Resources\ServiceAppointmentResource\Schemas\ServiceAppointmentForm;
use App\Filament\Resources\ServiceAppointmentResource\Schemas\ServiceAppointmentInfolist;
use App\Filament\Resources\ServiceAppointmentResource\Tables\ServiceAppointmentsTable;
use App\Models\ServiceAppointment;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;
use BackedEnum;

class ServiceAppointmentResource extends Resource
{
    protected static ?string $model = ServiceAppointment::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-calendar-days';

    protected static string|UnitEnum|null $navigationGroup = 'Appointments';

    protected static ?string $navigationLabel = 'Appointments';

    protected static ?int $navigationSort = 0;

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::count();
    }

    public static function form(Schema $schema): Schema
    {
        return ServiceAppointmentForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ServiceAppointmentInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ServiceAppointmentsTable::configure($table);
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
            'index' => Pages\ListServiceAppointments::route('/'),
            'create' => Pages\CreateServiceAppointment::route('/create'),
            'view' => Pages\ViewServiceAppointment::route('/{record}'),
            'edit' => Pages\EditServiceAppointment::route('/{record}/edit'),
        ];
    }
}
