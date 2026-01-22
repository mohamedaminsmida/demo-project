<?php

namespace App\Filament\Resources\ServiceAppointmentResource\Pages;

use App\Filament\Resources\ServiceAppointmentResource;
use App\Notifications\AppointmentRescheduledNotification;
use Carbon\Carbon;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class EditServiceAppointment extends EditRecord
{
    protected static string $resource = ServiceAppointmentResource::class;

    protected ?string $originalAppointmentDate = null;

    protected ?string $originalAppointmentTime = null;

    protected function beforeSave(): void
    {
        $this->originalAppointmentDate = $this->record->getRawOriginal('appointment_date');
        $this->originalAppointmentTime = $this->record->getRawOriginal('appointment_time');
    }

    protected function afterSave(): void
    {
        $newAppointmentDate = $this->record->getRawOriginal('appointment_date');
        $newAppointmentTime = $this->record->getRawOriginal('appointment_time');

        if (! $this->originalAppointmentDate || ! $this->originalAppointmentTime) {
            return;
        }

        if ($this->originalAppointmentDate === $newAppointmentDate && $this->originalAppointmentTime === $newAppointmentTime) {
            return;
        }

        if (! $this->record->customer_email) {
            return;
        }

        try {
            $this->record->load(['services', 'vehicle']);

            $oldDate = Carbon::parse($this->originalAppointmentDate)->format('l, F j, Y');
            $oldTime = Carbon::parse($this->originalAppointmentTime)->format('g:i A');

            Notification::route('mail', $this->record->customer_email)
                ->notify(new AppointmentRescheduledNotification($this->record, $oldDate, $oldTime));
        } catch (\Exception $e) {
            Log::warning('Failed to send appointment rescheduled email: ' . $e->getMessage());
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
