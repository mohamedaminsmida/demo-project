<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use App\Support\BusinessTimezone;
use BackedEnum;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use UnitEnum;

class Settings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static string|UnitEnum|null $navigationGroup = 'Settings';

    protected static ?int $navigationSort = 4;

    protected string $view = 'filament.pages.settings';

    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::query()->first();
        $this->form->fill($settings?->toArray() ?? [
            'working_hours' => [
                ['day' => 'monday', 'open' => '08:00', 'close' => '18:00'],
                ['day' => 'tuesday', 'open' => '08:00', 'close' => '18:00'],
                ['day' => 'wednesday', 'open' => '08:00', 'close' => '18:00'],
                ['day' => 'thursday', 'open' => '08:00', 'close' => '18:00'],
                ['day' => 'friday', 'open' => '08:00', 'close' => '18:00'],
                ['day' => 'saturday', 'open' => '08:00', 'close' => '14:00'],
                ['day' => 'sunday', 'open' => '', 'close' => ''],
            ],
            'footer_phone' => '+1 360-736-8313',
            'footer_email' => 'info@luquetires.com',
            'footer_address' => '332 Fair St, Centralia, WA 98531',
        ]);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Components\Section::make('Services')
                    ->schema([
                        Forms\Components\TextInput::make('total_capacity')
                            ->label('Total Garage Capacity')
                            ->numeric()
                            ->minValue(1)
                            ->placeholder('e.g., 4')
                            ->helperText('Maximum number of appointments that can be handled at the same time.'),
                    ])
                    ->collapsible()
                    ->icon('heroicon-o-wrench-screwdriver'),
                Components\Section::make('Location & Timezone')
                    ->schema([
                        Forms\Components\Select::make('timezone')
                            ->label('Business Timezone')
                            ->options($this->getUsTimezones())
                            ->default('America/Los_Angeles')
                            ->searchable()
                            ->required()
                            ->helperText('Select the timezone where your garage is located. All appointment times will be displayed in this timezone.'),
                    ])
                    ->collapsible()
                    ->icon('heroicon-o-globe-americas'),
                Components\Section::make('Timing')
                    ->schema([
                        Forms\Components\Repeater::make('working_hours')
                            ->label('Working Hours')
                            ->schema([
                                Forms\Components\Select::make('day')
                                    ->options([
                                        'monday' => 'Monday',
                                        'tuesday' => 'Tuesday',
                                        'wednesday' => 'Wednesday',
                                        'thursday' => 'Thursday',
                                        'friday' => 'Friday',
                                        'saturday' => 'Saturday',
                                        'sunday' => 'Sunday',
                                    ])
                                    ->reactive()
                                    ->disableOptionWhen(function (string $value, ?string $state, callable $get): bool {
                                        $selectedDays = collect($get('../../working_hours') ?? [])
                                            ->pluck('day')
                                            ->filter()
                                            ->all();

                                        return in_array($value, $selectedDays, true) && $value !== $state;
                                    })
                                    ->required(),
                                Forms\Components\Toggle::make('is_day_off')
                                    ->label('Day Off')
                                    ->inline(false)
                                    ->default(false),
                                Forms\Components\TimePicker::make('open')
                                    ->label('Open')
                                    ->displayFormat('g:i A')
                                    ->format('H:i')
                                    ->required(fn (callable $get) => ! (bool) $get('is_day_off'))
                                    ->disabled(fn (callable $get) => (bool) $get('is_day_off')),
                                Forms\Components\TimePicker::make('close')
                                    ->label('Close')
                                    ->displayFormat('g:i A')
                                    ->format('H:i')
                                    ->required(fn (callable $get) => ! (bool) $get('is_day_off'))
                                    ->disabled(fn (callable $get) => (bool) $get('is_day_off')),
                            ])
                            ->columns(3)
                            ->helperText('Set opening and closing times for each day.'),
                    ])->collapsible()
                    ->icon('heroicon-o-clock'),
                Components\Section::make('Footer Section')
                    ->schema([
                        Forms\Components\TextInput::make('footer_phone')
                            ->label('Footer Phone')
                            ->tel()
                            ->placeholder('+1 360-736-8313'),
                        Forms\Components\TextInput::make('footer_email')
                            ->label('Footer Email')
                            ->email()
                            ->placeholder('info@luquetires.com'),
                        Forms\Components\TextInput::make('footer_address')
                            ->label('Footer Address')
                            ->placeholder('332 Fair St, Centralia, WA 98531'),
                        Forms\Components\TextInput::make('footer_facebook')
                            ->label('Facebook URL')
                            ->url()
                            ->placeholder('https://facebook.com/your-page'),
                        Forms\Components\TextInput::make('footer_instagram')
                            ->label('Instagram URL')
                            ->url()
                            ->placeholder('https://instagram.com/your-page'),
                        Forms\Components\Textarea::make('footer_description')
                            ->label('Footer Description')
                            ->rows(3)
                            ->maxLength(500),
                    ])
                    ->columns(2)
                    ->collapsible()
                    ->icon('heroicon-o-user-group'),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $settings = Setting::query()->first();

        if ($settings) {
            $settings->update($data);
        } else {
            Setting::create($data);
        }

        BusinessTimezone::clearCache();

        Notification::make()
            ->title('Settings saved')
            ->success()
            ->send();
    }

    private function getUsTimezones(): array
    {
        return [
            'America/New_York' => 'Eastern Time (ET) - New York, Miami, Atlanta',
            'America/Chicago' => 'Central Time (CT) - Chicago, Houston, Dallas',
            'America/Denver' => 'Mountain Time (MT) - Denver, Phoenix, Salt Lake City',
            'America/Los_Angeles' => 'Pacific Time (PT) - Los Angeles, Seattle, San Francisco',
            'America/Anchorage' => 'Alaska Time (AKT) - Anchorage',
            'Pacific/Honolulu' => 'Hawaii Time (HT) - Honolulu',
        ];
    }
}
