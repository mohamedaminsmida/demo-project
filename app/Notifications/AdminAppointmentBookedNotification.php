<?php

namespace App\Notifications;

use App\Models\ServiceAppointment;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;

class AdminAppointmentBookedNotification extends Notification
{
    use Queueable, ShouldQueue;

    public function __construct(
        private readonly ServiceAppointment $appointment
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

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

        $manageUrl = Route::has('filament.admin.resources.service-appointments.view')
            ? route('filament.admin.resources.service-appointments.view', ['record' => $appointment])
            : url('/admin/service-appointments/' . $appointment->id);

        return (new MailMessage)
            ->subject('New Appointment Booked - ' . config('app.name'))
            ->view('emails.appointment-confirmation', [
                'greetingName' => 'Luque Tires Team',
                'introText' => 'A new service appointment has been booked and is ready for your review.',
                'detailsHeading' => 'Appointment Details',
                'customerName' => $appointment->customer_name,
                'customerEmail' => $appointment->customer_email,
                'customerPhone' => $appointment->customer_phone,
                'showCustomerDetails' => true,
                'companyName' => config('app.name'),
                'services' => $serviceNames ?: 'General Service',
                'appointmentDate' => $date,
                'appointmentTime' => $time,
                'vehicleInfo' => $vehicleInfo,
                'supportPhone' => config('app.support_phone', '(555) 123-4567'),
                'shopAddress' => config('app.shop_address', '123 Main Street, Your City, ST 00000'),
                'actionUrl' => $manageUrl,
                'actionLabel' => 'See Details',
                'heroImage' => $heroImage,
                'estimatedPrice' => null,
            ]);
    }
}
