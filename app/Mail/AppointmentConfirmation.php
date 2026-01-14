<?php

namespace App\Mail;

use App\Models\ServiceAppointment;
use Mailtrap\MailtrapClient;
use Mailtrap\Mime\MailtrapEmail;
use Symfony\Component\Mime\Address;

class AppointmentConfirmation
{
    protected ServiceAppointment $appointment;

    public function __construct(ServiceAppointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function send(): void
    {
        $appointment = $this->appointment;
        $services = $appointment->services->pluck('name')->join(', ');
        $vehicle = $appointment->vehicle;
        $vehicleInfo = "{$vehicle->year} {$vehicle->brand} {$vehicle->model}";
        
        $formattedDate = $appointment->appointment_date->format('l, F j, Y');
        $formattedTime = $appointment->appointment_time;
        
        $textContent = <<<TEXT
Hello {$appointment->customer_name},

Your appointment has been confirmed!

APPOINTMENT DETAILS
-------------------
Date: {$formattedDate}
Time: {$formattedTime}
Services: {$services}
Vehicle: {$vehicleInfo}

Estimated Price: \${$appointment->estimated_price}

WHAT TO EXPECT
--------------
Please arrive 10 minutes before your scheduled time. Bring your vehicle registration and any relevant documentation.

If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Thank you for choosing our service!

Best regards,
The Auto Service Team
TEXT;

        $htmlContent = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #166534; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .details h3 { margin-top: 0; color: #166534; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .detail-label { font-weight: bold; color: #6b7280; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .price { font-size: 24px; color: #166534; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Appointment Confirmed!</h1>
        </div>
        <div class="content">
            <p>Hello <strong>{$appointment->customer_name}</strong>,</p>
            <p>Your appointment has been successfully scheduled. Here are your booking details:</p>
            
            <div class="details">
                <h3>📅 Appointment Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span>{$formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span>{$formattedTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Services:</span>
                    <span>{$services}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Vehicle:</span>
                    <span>{$vehicleInfo}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estimated Price:</span>
                    <span class="price">\${$appointment->estimated_price}</span>
                </div>
            </div>
            
            <div class="details">
                <h3>📋 What to Expect</h3>
                <ul>
                    <li>Please arrive 10 minutes before your scheduled time</li>
                    <li>Bring your vehicle registration and any relevant documentation</li>
                    <li>If you need to reschedule or cancel, please contact us at least 24 hours in advance</li>
                </ul>
            </div>
            
            <p>Thank you for choosing our service!</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The Auto Service Team</p>
        </div>
    </div>
</body>
</html>
HTML;

        $email = (new MailtrapEmail())
            ->from(new Address('hello@demomailtrap.com', 'Auto Service'))
            ->to(new Address($appointment->customer_email, $appointment->customer_name))
            ->subject('Your Appointment is Confirmed - ' . $formattedDate)
            ->category('Appointment Confirmation')
            ->text($textContent)
            ->html($htmlContent);

        $response = MailtrapClient::initSendingEmails(
            apiKey: config('services.mailtrap.token')
        )->send($email);
    }
}
