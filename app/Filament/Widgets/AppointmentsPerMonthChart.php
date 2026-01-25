<?php

namespace App\Filament\Widgets;

use App\Models\ServiceAppointment;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Livewire\Attributes\On;

class AppointmentsPerMonthChart extends ChartWidget
{
    protected int|string|array $columnSpan = 'full';

    protected ?string $heading = null;

    public int $year;

    public ?int $month = null;

    public function mount(): void
    {
        $this->year = (int) session('dashboard_filters.year', Carbon::now()->year);
        $month = session('dashboard_filters.month');
        $this->month = is_numeric($month) ? (int) $month : null;
        $this->updateHeading();
    }

    #[On('dashboardFiltersUpdated')]
    public function refreshFromDashboardFilters(): void
    {
        $this->year = (int) session('dashboard_filters.year', Carbon::now()->year);
        $month = session('dashboard_filters.month');
        $this->month = is_numeric($month) ? (int) $month : null;
        $this->updateHeading();
    }

    private function updateHeading(): void
    {
        if ($this->month) {
            $label = Carbon::create($this->year, $this->month, 1)->format('F Y');
            $this->heading = "Appointments per Day ({$label})";
            return;
        }

        $this->heading = "Appointments per Month ({$this->year})";
    }

    protected function getData(): array
    {
        $year = $this->year;

        if ($this->month) {
            $daysInMonth = Carbon::create($year, $this->month, 1)->daysInMonth;

            $countsByDay = ServiceAppointment::query()
                ->selectRaw("EXTRACT(DAY FROM appointment_date)::int as day, COUNT(*)::int as total")
                ->whereYear('appointment_date', $year)
                ->whereMonth('appointment_date', $this->month)
                ->groupBy('day')
                ->orderBy('day')
                ->pluck('total', 'day')
                ->all();

            $labels = collect(range(1, $daysInMonth))
                ->map(fn (int $day) => (string) $day)
                ->all();

            $data = collect(range(1, $daysInMonth))
                ->map(fn (int $day) => (int) ($countsByDay[$day] ?? 0))
                ->all();
        } else {
            $countsByMonth = ServiceAppointment::query()
                ->selectRaw("EXTRACT(MONTH FROM appointment_date)::int as month, COUNT(*)::int as total")
                ->whereYear('appointment_date', $year)
                ->groupBy('month')
                ->orderBy('month')
                ->pluck('total', 'month')
                ->all();

            $labels = collect(range(1, 12))
                ->map(fn (int $month) => Carbon::create($year, $month, 1)->format('M'))
                ->all();

            $data = collect(range(1, 12))
                ->map(fn (int $month) => (int) ($countsByMonth[$month] ?? 0))
                ->all();
        }

        return [
            'datasets' => [
                [
                    'label' => 'Appointments',
                    'data' => $data,
                    'borderColor' => '#15803D',
                    'backgroundColor' => 'rgba(21, 128, 61, 0.25)',
                    'fill' => true,
                    'tension' => 0.35,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
