<?php

namespace App\Filament\Widgets;

use App\Enums\AppointmentStatus;
use App\Models\ServiceAppointment;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Livewire\Attributes\On;

class AppointmentMetricsStats extends StatsOverviewWidget
{
    public int $year;

    public ?int $month = null;

    public function mount(): void
    {
        $this->year = (int) session('dashboard_filters.year', Carbon::now()->year);
        $month = session('dashboard_filters.month');
        $this->month = is_numeric($month) ? (int) $month : null;
    }

    #[On('dashboardFiltersUpdated')]
    public function refreshFromDashboardFilters(): void
    {
        $this->year = (int) session('dashboard_filters.year', Carbon::now()->year);
        $month = session('dashboard_filters.month');
        $this->month = is_numeric($month) ? (int) $month : null;
    }

    protected function getStats(): array
    {
        $year = $this->year ?? Carbon::now()->year;

        $start = Carbon::create($year, $this->month ?: 1, 1)->startOfDay();
        $end = $this->month
            ? Carbon::create($year, $this->month, 1)->endOfMonth()->endOfDay()
            : Carbon::create($year, 12, 31)->endOfDay();

        $baseQuery = ServiceAppointment::query()
            ->whereBetween('appointment_date', [$start->toDateString(), $end->toDateString()]);

        $scheduledCount = (clone $baseQuery)
            ->where('status', AppointmentStatus::Scheduled->value)
            ->count();

        $cancelledCount = (clone $baseQuery)
            ->where('status', AppointmentStatus::Cancelled->value)
            ->count();

        $completedCount = (clone $baseQuery)
            ->where('status', AppointmentStatus::Completed->value)
            ->count();

        $averageRevenue = (clone $baseQuery)
            ->where('status', AppointmentStatus::Completed->value)
            ->whereNotNull('final_price')
            ->avg('final_price');

        $totalRevenue = (clone $baseQuery)
            ->where('status', AppointmentStatus::Completed->value)
            ->whereNotNull('final_price')
            ->sum('final_price');

        $periodLabel = $this->month
            ? Carbon::create($year, $this->month, 1)->format('F Y')
            : (string) $year;

        $trendStart = (clone $end)->subDays(6)->startOfDay();
        if ($trendStart->lt($start)) {
            $trendStart = $start->copy();
        }

        return [
            Stat::make("Scheduled ({$periodLabel})", $scheduledCount)
                ->description('Appointments scheduled')
                ->descriptionIcon('heroicon-m-calendar')
                ->color('warning')
                ->chart($this->getStatusTrend(AppointmentStatus::Scheduled, $trendStart, $end)),
            Stat::make("Cancelled ({$periodLabel})", $cancelledCount)
                ->description('Appointments cancelled')
                ->descriptionIcon('heroicon-m-x-mark')
                ->color('danger')
                ->chart($this->getStatusTrend(AppointmentStatus::Cancelled, $trendStart, $end)),
            Stat::make("Completed ({$periodLabel})", $completedCount)
                ->description('Appointments completed')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success')
                ->chart($this->getStatusTrend(AppointmentStatus::Completed, $trendStart, $end)),
            Stat::make("Avg Revenue ({$periodLabel})", $averageRevenue !== null ? '$' . number_format((float) $averageRevenue, 2) : '—')
                ->description('Average per completed appointment')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('primary')
                ->chart($this->getRevenueTrend($trendStart, $end)),
            Stat::make("Total Revenue ({$periodLabel})", $totalRevenue > 0 ? '$' . number_format((float) $totalRevenue, 2) : '—')
                ->description('Completed appointment revenue')
                ->descriptionIcon('heroicon-m-chart-bar')
                ->color('success')
                ->chart($this->getRevenueTrend($trendStart, $end)),
        ];
    }

    protected function getStatusTrend(AppointmentStatus $status, Carbon $from, Carbon $to): array
    {
        $dailyCounts = ServiceAppointment::query()
            ->selectRaw('DATE(appointment_date) as day, COUNT(*) as total')
            ->whereBetween('appointment_date', [$from->toDateString(), $to->toDateString()])
            ->where('status', $status->value)
            ->groupBy('day')
            ->orderBy('day')
            ->pluck('total', 'day')
            ->all();

        $values = [];
        foreach (CarbonPeriod::create($from, $to) as $date) {
            $values[] = (int) ($dailyCounts[$date->toDateString()] ?? 0);
        }

        return $values;
    }

    protected function getRevenueTrend(Carbon $from, Carbon $to): array
    {
        $dailyTotals = ServiceAppointment::query()
            ->selectRaw('DATE(appointment_date) as day, SUM(final_price) as total')
            ->whereBetween('appointment_date', [$from->toDateString(), $to->toDateString()])
            ->where('status', AppointmentStatus::Completed->value)
            ->whereNotNull('final_price')
            ->groupBy('day')
            ->orderBy('day')
            ->pluck('total', 'day')
            ->all();

        $values = [];
        foreach (CarbonPeriod::create($from, $to) as $date) {
            $values[] = (float) ($dailyTotals[$date->toDateString()] ?? 0);
        }

        return $values;
    }
}
