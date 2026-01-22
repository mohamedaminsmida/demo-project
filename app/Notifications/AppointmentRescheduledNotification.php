<?php

namespace App\Notifications;

use App\Models\ServiceAppointment;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Vite;

class AppointmentRescheduledNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly ServiceAppointment $appointment,
        private readonly string $oldDate,
        private readonly string $oldTime,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $appointment = $this->appointment;

        $newDate = Carbon::parse($appointment->appointment_date)->format('l, F j, Y');
        $newTime = Carbon::parse($appointment->appointment_time)->format('g:i A');

        $serviceNames = $appointment->services->pluck('name')->join(', ');
        $vehicle = $appointment->vehicle;
        $vehicleInfo = $vehicle ? trim("{$vehicle->year} {$vehicle->brand} {$vehicle->model}") : 'Not specified';

        $heroImage = config('mail.hero_image')
            ?? Vite::asset('resources/images/FIRST.jpg');

        $introText = sprintf(
            'Your appointment date/time has been changed from %s at %s to %s at %s. Below are your updated appointment details.',
            $this->oldDate,
            $this->oldTime,
            $newDate,
            $newTime,
        );

        return (new MailMessage)
            ->subject('Appointment Updated - ' . config('app.name'))
            ->view('emails.appointment-confirmation', [
                'greetingName' => $appointment->customer_name,
                'introText' => $introText,
                'detailsHeading' => 'Updated Appointment Details',
                'customerName' => $appointment->customer_name,
                'customerEmail' => $appointment->customer_email,
                'customerPhone' => $appointment->customer_phone,
                'showCustomerDetails' => false,
                'companyName' => config('app.name'),
                'services' => $serviceNames ?: 'General Service',
                'appointmentDate' => $newDate,
                'appointmentTime' => $newTime,
                'vehicleInfo' => $vehicleInfo,
                'supportPhone' => config('app.support_phone', '(555) 123-4567'),
                'shopAddress' => config('app.shop_address', '123 Main Street, Your City, ST 00000'),
                'actionUrl' => null,
                'actionLabel' => null,
                'heroImage' => $heroImage,
                'estimatedPrice' => null,
            ]);
    }
}
