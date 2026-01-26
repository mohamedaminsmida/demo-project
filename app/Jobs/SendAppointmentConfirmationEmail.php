<?php

namespace App\Jobs;

use App\Models\ServiceAppointment;
use App\Services\EmailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendAppointmentConfirmationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly int $appointmentId
    ) {
    }

    public function handle(EmailService $emailService): void
    {
        $appointment = ServiceAppointment::query()
            ->with(['services', 'vehicle'])
            ->find($this->appointmentId);

        if (! $appointment) {
            return;
        }

        $emailService->sendAppointmentConfirmation($appointment);
    }
}
