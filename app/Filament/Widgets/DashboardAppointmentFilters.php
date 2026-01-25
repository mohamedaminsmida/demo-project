<?php

namespace App\Filament\Widgets;

use App\Models\ServiceAppointment;
use Carbon\Carbon;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;
use Filament\Widgets\Widget;

class DashboardAppointmentFilters extends Widget implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.widgets.dashboard-appointment-filters';

    protected int|string|array $columnSpan = 'full';

    public ?array $data = [];

    public function mount(): void
    {
        $currentYear = Carbon::now()->year;
        $minDate = ServiceAppointment::query()->min('appointment_date');
        $minYear = $minDate ? Carbon::parse($minDate)->year : $currentYear;

        $defaultYear = (int) session('dashboard_filters.year', $currentYear);
        $defaultYear = max(min($defaultYear, $currentYear), $minYear);

        $month = session('dashboard_filters.month');

        $this->form->fill([
            'year' => $defaultYear,
            'month' => is_numeric($month) ? (int) $month : null,
        ]);
    }

    public function form(Schema $form): Schema
    {
        $currentYear = Carbon::now()->year;
        $minDate = ServiceAppointment::query()->min('appointment_date');
        $minYear = $minDate ? Carbon::parse($minDate)->year : $currentYear;

        $yearOptions = collect(range($currentYear, $minYear))
            ->mapWithKeys(fn (int $year) => [$year => (string) $year])
            ->all();

        $monthOptions = [
            null => 'All months',
            1 => 'January',
            2 => 'February',
            3 => 'March',
            4 => 'April',
            5 => 'May',
            6 => 'June',
            7 => 'July',
            8 => 'August',
            9 => 'September',
            10 => 'October',
            11 => 'November',
            12 => 'December',
        ];

        return $form
            ->schema([
                Select::make('year')
                    ->label('Year')
                    ->options($yearOptions)
                    ->native(false)
                    ->live()
                    ->afterStateUpdated(fn () => $this->persistFilters())
                    ->required(),
                Select::make('month')
                    ->label('Month')
                    ->options($monthOptions)
                    ->native(false)
                    ->live()
                    ->afterStateUpdated(fn () => $this->persistFilters()),
            ])
            ->columns(2)
            ->statePath('data');
    }

    public function persistFilters(): void
    {
        $state = $this->form->getState();

        $year = (int) ($state['year'] ?? Carbon::now()->year);
        $month = $state['month'] ?? null;
        $month = is_numeric($month) ? (int) $month : null;

        session([
            'dashboard_filters.year' => $year,
            'dashboard_filters.month' => $month,
        ]);

        $this->dispatch('dashboardFiltersUpdated');
    }
}
