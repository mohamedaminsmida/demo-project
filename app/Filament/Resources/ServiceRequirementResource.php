<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceRequirementResource\Pages;
use App\Filament\Resources\ServiceRequirementResource\Schemas\ServiceRequirementForm;
use App\Filament\Resources\ServiceRequirementResource\Schemas\ServiceRequirementInfolist;
use App\Filament\Resources\ServiceRequirementResource\Tables\ServiceRequirementsTable;
use App\Models\ServiceRequirement;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;
use BackedEnum;

class ServiceRequirementResource extends Resource
{
    protected static ?string $model = ServiceRequirement::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static string|UnitEnum|null $navigationGroup = 'Services';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return ServiceRequirementForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ServiceRequirementsTable::configure($table);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ServiceRequirementInfolist::configure($schema);
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
            'index' => Pages\ListServiceRequirements::route('/'),
            'create' => Pages\CreateServiceRequirement::route('/create'),
            'view' => Pages\ViewServiceRequirement::route('/{record}'),
            'edit' => Pages\EditServiceRequirement::route('/{record}/edit'),
        ];
    }
}
