<?php

namespace App\Filament\Resources\ServiceResource\RelationManagers;

use App\Filament\Resources\ServiceRequirementResource;
use App\Models\ServiceRequirement;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class RequirementsRelationManager extends RelationManager
{
    protected static string $relationship = 'requirements';

    protected static ?string $recordTitleAttribute = 'label';

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('label')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Hidden::make('key')
                    ->dehydrated(),
                Forms\Components\Select::make('type')
                    ->options([
                        'text' => 'Text',
                        'textarea' => 'Textarea',
                        'number' => 'Number',
                        'select' => 'Select',
                        'multiselect' => 'Multi Select',
                        'radio' => 'Radio',
                        'checkbox' => 'Checkbox',
                        'toggle' => 'Toggle',
                        'date' => 'Date',
                    ])
                    ->required()
                    ->live()
                    ->default('text'),
                Forms\Components\TextInput::make('validations.number_max_length')
                    ->label('Max Digits')
                    ->numeric()
                    ->minValue(1)
                    ->required(fn (callable $get) => $get('type') === 'number')
                    ->visible(fn (callable $get) => $get('type') === 'number')
                    ->helperText('Maximum number of digits allowed.'),
                Forms\Components\DatePicker::make('validations.min_date')
                    ->label('Min Date')
                    ->required(fn (callable $get) => $get('type') === 'date')
                    ->visible(fn (callable $get) => $get('type') === 'date'),
                Forms\Components\DatePicker::make('validations.max_date')
                    ->label('Max Date')
                    ->required(fn (callable $get) => $get('type') === 'date')
                    ->visible(fn (callable $get) => $get('type') === 'date'),
                Forms\Components\Repeater::make('options')
                    ->schema([
                        Forms\Components\TextInput::make('label')
                            ->required(),
                        Forms\Components\TextInput::make('value')
                            ->required(),
                    ])
                    ->columns(2)
                    ->addActionLabel('Add Option')
                    ->visible(fn (callable $get) => in_array($get('type'), ['select', 'multiselect', 'radio'], true)),
                Forms\Components\Toggle::make('is_required')
                    ->label('Required')
                    ->default(false),
                Forms\Components\TextInput::make('placeholder')
                    ->maxLength(255),
                Forms\Components\TextInput::make('help_text')
                    ->maxLength(255),
                Forms\Components\TextInput::make('sort_order')
                    ->label('Sort Order')
                    ->numeric()
                    ->default(0),
            ])
            ->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('label')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('type'),
                Tables\Columns\IconColumn::make('is_required')
                    ->label('Required')
                    ->boolean(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Sort')
                    ->sortable(),
            ])
            ->recordActions([
                ActionGroup::make([
                    Action::make('view')
                        ->icon('heroicon-o-eye')
                        ->url(fn (ServiceRequirement $record) => ServiceRequirementResource::getUrl('view', ['record' => $record])),
                    Action::make('edit')
                        ->icon('heroicon-o-pencil-square')
                        ->url(fn (ServiceRequirement $record) => ServiceRequirementResource::getUrl('edit', ['record' => $record])),
                    Action::make('delete')
                        ->icon('heroicon-o-trash')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(fn (ServiceRequirement $record) => $record->delete()),
                ]),
            ])
            ->bulkActions([
                //
            ]);
    }
}
