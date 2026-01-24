<?php

namespace App\Services;

use Hofmannsven\Brevo\Facades\Brevo;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send appointment confirmation email to customer
     */
    public function sendAppointmentConfirmation($appointment): bool
    {
        try {
            // Log attempt
            Log::info('Attempting to send appointment confirmation email', [
                'appointment_id' => $appointment->id,
                'customer_email' => $appointment->customer_email,
                'customer_name' => $appointment->customer_name,
                'brevo_api_key_configured' => !empty(config('services.brevo.api_key')),
                'sender_email' => config('services.brevo.default_sender_email'),
                'sender_name' => config('services.brevo.default_sender_name'),
            ]);

            $subject = 'Appointment Confirmation - ' . config('app.name');
            
            $htmlContent = $this->renderCustomerAppointmentEmail($appointment);
            
            // Log email content preview
            Log::info('Email content prepared', [
                'subject' => $subject,
                'content_length' => strlen($htmlContent),
                'recipient_count' => 1,
            ]);
            
            $result = Brevo::TransactionalEmailsApi()->sendTransacEmail([
                'sender' => [
                    'email' => config('services.brevo.default_sender_email', 'noreply@yourapp.com'),
                    'name' => config('services.brevo.default_sender_name', config('app.name')),
                ],
                'to' => [
                    [
                        'email' => $appointment->customer_email,
                        'name' => $appointment->customer_name,
                    ]
                ],
                'subject' => $subject,
                'htmlContent' => $htmlContent,
            ]);

            Log::info('Appointment confirmation email sent successfully', [
                'appointment_id' => $appointment->id,
                'customer_email' => $appointment->customer_email,
                'message_id' => $result->getMessageId() ?? null,
                'response_data' => $result,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send appointment confirmation email', [
                'appointment_id' => $appointment->id,
                'customer_email' => $appointment->customer_email,
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'error_trace' => $e->getTraceAsString(),
                'brevo_api_key_configured' => !empty(config('services.brevo.api_key')),
            ]);

            return false;
        }
    }

    /**
     * Send appointment notification to admin
     */
    public function sendAppointmentNotificationToAdmin($appointment, string $adminEmail): bool
    {
        try {
            // Log attempt
            Log::info('Attempting to send admin appointment notification', [
                'appointment_id' => $appointment->id,
                'admin_email' => $adminEmail,
                'customer_name' => $appointment->customer_name,
                'brevo_api_key_configured' => !empty(config('services.brevo.api_key')),
            ]);

            $subject = 'New Appointment Booking - ' . $appointment->customer_name;
            
            $htmlContent = $this->renderAdminAppointmentEmail($appointment);
            
            $result = Brevo::TransactionalEmailsApi()->sendTransacEmail([
                'sender' => [
                    'email' => config('services.brevo.default_sender_email', 'noreply@yourapp.com'),
                    'name' => config('services.brevo.default_sender_name', config('app.name')),
                ],
                'to' => [
                    [
                        'email' => $adminEmail,
                        'name' => 'Admin',
                    ]
                ],
                'subject' => $subject,
                'htmlContent' => $htmlContent,
            ]);

            Log::info('Admin appointment notification email sent successfully', [
                'appointment_id' => $appointment->id,
                'admin_email' => $adminEmail,
                'message_id' => $result->getMessageId() ?? null,
                'response_data' => $result,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send admin appointment notification email', [
                'appointment_id' => $appointment->id,
                'admin_email' => $adminEmail,
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'error_trace' => $e->getTraceAsString(),
                'brevo_api_key_configured' => !empty(config('services.brevo.api_key')),
            ]);

            return false;
        }
    }

    private function renderCustomerAppointmentEmail($appointment): string
    {
        $pricing = $this->buildServicePricing($appointment);

        return view('emails.appointment-confirmation', [
            'companyName' => config('app.name'),
            'greetingName' => $appointment->customer_name,
            'introText' => 'Your appointment has been successfully booked and is confirmed.',
            'detailsHeading' => 'Appointment Details',
            'services' => $pricing['services'],
            'serviceDetails' => $pricing['serviceDetails'],
            'totalPrice' => $pricing['totalPrice'],
            'estimatedPrice' => null,
            'appointmentDate' => $appointment->appointment_date?->format('F j, Y') ?? (string) $appointment->appointment_date,
            'appointmentTime' => $appointment->appointment_time,
            'vehicleInfo' => $this->formatVehicleInfo($appointment),
            'showCustomerDetails' => false,
            'customerNoticeTitle' => 'Important',
            'customerNotice' => 'Please arrive 10 minutes before your scheduled time. Payment will be collected in person at the time of service. If you need to reschedule or cancel, please contact us as soon as possible.',
            'actionUrl' => null,
            'actionLabel' => null,
        ])->render();
    }

    private function renderAdminAppointmentEmail($appointment): string
    {
        $pricing = $this->buildServicePricing($appointment);

        return view('emails.appointment-confirmation', [
            'companyName' => config('app.name'),
            'greetingName' => 'Luque Tires Team',
            'introText' => 'A new service appointment has been booked and is ready for your review.',
            'detailsHeading' => 'Appointment Details',
            'services' => $pricing['services'],
            'serviceDetails' => $pricing['serviceDetails'],
            'totalPrice' => $pricing['totalPrice'],
            'estimatedPrice' => null,
            'appointmentDate' => $appointment->appointment_date?->format('F j, Y') ?? (string) $appointment->appointment_date,
            'appointmentTime' => $appointment->appointment_time,
            'vehicleInfo' => $this->formatVehicleInfo($appointment),
            'showCustomerDetails' => true,
            'customerName' => $appointment->customer_name,
            'customerEmail' => $appointment->customer_email,
            'customerPhone' => $appointment->customer_phone,
            'customerNotice' => null,
            'customerNoticeTitle' => null,
            'actionUrl' => config('app.url') . '/admin/service-appointments/' . $appointment->id,
            'actionLabel' => 'More Details',
        ])->render();
    }

    private function buildServicePricing($appointment): array
    {
        $servicesCollection = $appointment->services ?? collect();

        $serviceDetails = [];
        $total = 0.0;

        foreach ($servicesCollection as $service) {
            $price = $service->pivot?->price ?? $service->base_price ?? 0;
            $numericPrice = (float) $price;
            $total += $numericPrice;

            $serviceDetails[] = [
                'name' => $service->name,
                'price' => number_format($numericPrice, 2),
            ];
        }

        return [
            'services' => $servicesCollection->pluck('name')->implode(', '),
            'serviceDetails' => $serviceDetails,
            'totalPrice' => number_format($total, 2),
        ];
    }

    private function formatVehicleInfo($appointment): string
    {
        $vehicle = $appointment->vehicle;
        if (! $vehicle) {
            return 'N/A';
        }

        return trim("{$vehicle->brand} {$vehicle->model} ({$vehicle->year})");
    }
}
