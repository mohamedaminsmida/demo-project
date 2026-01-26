<?php

namespace App\Notifications;

use App\Models\ServiceAppointment;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Vite;

class AppointmentConfirmationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private readonly ServiceAppointment $appointment
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $appointment = $this->appointment;
        $date = Carbon::parse($appointment->appointment_date)->format('l, F j, Y');
        $time = Carbon::parse($appointment->appointment_time)->format('g:i A');

        $serviceNames = $appointment->services->pluck('name')->join(', ');
        $vehicle = $appointment->vehicle;
        $vehicleInfo = $vehicle ? trim("{$vehicle->year} {$vehicle->brand} {$vehicle->model}") : 'Not specified';

        $heroImage = config('mail.hero_image')
            ?? Vite::asset('resources/images/FIRST.jpg');

        return (new MailMessage)
            ->subject('Appointment Confirmed - ' . config('app.name'))
            ->view('emails.appointment-confirmation', [
                'greetingName' => $appointment->customer_name,
                'introText' => 'Your appointment has been confirmed. Below are your appointment details.',
                'detailsHeading' => 'Appointment Details',
                'customerName' => $appointment->customer_name,
                'companyName' => config('app.name'),
                'services' => $serviceNames ?: 'General Service',
                'appointmentDate' => $date,
                'appointmentTime' => $time,
                'vehicleInfo' => $vehicleInfo,
                'supportPhone' => config('app.support_phone', '(555) 123-4567'),
                'shopAddress' => config('app.shop_address', '123 Main Street, Your City, ST 00000'),
                'heroImage' => $heroImage,
                'customerEmail' => $appointment->customer_email,
                'customerPhone' => $appointment->customer_phone,
                'showCustomerDetails' => false,
                'actionUrl' => null,
                'actionLabel' => null,
                'estimatedPrice' => null,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'appointment_date' => $this->appointment->appointment_date,
            'appointment_time' => $this->appointment->appointment_time,
        ];
    }
}
