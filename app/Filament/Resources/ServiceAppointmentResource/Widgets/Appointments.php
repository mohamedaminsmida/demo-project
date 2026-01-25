<?php

namespace App\Filament\Resources\ServiceAppointmentResource\Widgets;

use App\Enums\AppointmentStatus;
use App\Models\ServiceAppointment;
use App\Support\BusinessTimezone;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Support\Facades\FilamentColor;
use Guava\Calendar\Enums\CalendarViewType;
use Guava\Calendar\Filament\CalendarWidget;
use Guava\Calendar\ValueObjects\CalendarEvent;
use Guava\Calendar\ValueObjects\FetchInfo;
use Illuminate\Support\Collection;

class Appointments extends CalendarWidget
{
    protected CalendarViewType $calendarView = CalendarViewType::DayGridMonth;

    protected bool $eventClickEnabled = true;

    protected bool $useFilamentTimezone = true;

    public ?string $statusFilter = null;


    protected array $options = [
        'height' => 900,
        'expandRows' => true,
        'dayMaxEventRows' => 4,
        'headerToolbar' => [
            'start' => 'prev,next today',
            'center' => 'title',
            'end' => 'dayGridMonth,timeGridDay,timeGridWeek,listYear',
        ],
    ];

    protected function getEventClickContextMenuActions(): array
    {
        return [
            $this->viewAction(),
            $this->editAction(),
            $this->deleteAction(),
        ];
    }

    public function getHeaderActions(): array
    {
        return [
            Action::make('filterStatus')
                ->label('Filter')
                ->fillForm([
                    'status' => $this->statusFilter,
                ])
                ->schema([
                    Select::make('status')
                        ->label('Status')
                        ->options([
                            AppointmentStatus::Scheduled->value => 'Scheduled',
                            AppointmentStatus::InProgress->value => 'In Progress',
                            AppointmentStatus::Completed->value => 'Completed',
                            AppointmentStatus::Cancelled->value => 'Cancelled',
                            AppointmentStatus::NoShow->value => 'No-show',
                        ])
                        ->placeholder('All'),
                ])
                ->action(function (array $data): void {
                    $this->statusFilter = $data['status'] ?? null;
                    $this->refreshRecords();
                }),
        ];
    }

    /**
     * Provide events for the Guava calendar widget.
     */
    protected function getEvents(FetchInfo $info): Collection
    {
        $query = ServiceAppointment::query()
            ->with(['customer'])
            ->whereBetween('appointment_date', [
                $info->start->startOfDay()->toDateString(),
                $info->end->endOfDay()->toDateString(),
            ])
        ;

        if ($this->statusFilter) {
            $query->where('status', $this->statusFilter);
        }

        return $query
            ->get()
            ->map(fn (ServiceAppointment $appointment) => $this->makeCalendarEvent($appointment));
    }


    private function makeCalendarEvent(ServiceAppointment $appointment): CalendarEvent
    {
        $start = $this->resolveAppointmentDateTime($appointment);
        $end = (clone $start)->addHour();

        $title = $appointment->customer_name ?: 'Service Appointment';

        return CalendarEvent::make($appointment)
            ->title($title ?: 'Service Appointment')
            ->start($start)
            ->end($end)
            ->backgroundColor($this->statusColor($appointment->status))
            ->textColor('#ffffff')
            ->extendedProps([
                'status' => $appointment->status?->value,
                'customer_email' => $appointment->customer_email,
                'appointment_time' => $appointment->appointment_time,
            ]);
    }

    private function resolveAppointmentDateTime(ServiceAppointment $appointment): Carbon
    {
        $date = $appointment->appointment_date instanceof Carbon
            ? $appointment->appointment_date->toDateString()
            : Carbon::parse($appointment->appointment_date)->toDateString();

        return Carbon::parse(sprintf('%s %s', $date, $appointment->appointment_time), BusinessTimezone::get());
    }

    private function statusColor(?AppointmentStatus $status): string
    {
        $alias = $status === AppointmentStatus::NoShow
            ? 'purple'
            : ($status?->badgeColor() ?? 'primary');
        $palette = FilamentColor::getColor($alias);

        if (is_array($palette)) {
            return $palette[600]
                ?? $palette[500]
                ?? $palette[400]
                ?? array_values($palette)[0];
        }

        return is_string($palette) ? $palette : '#6366f1';
    }
}