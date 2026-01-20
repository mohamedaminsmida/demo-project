<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Test email route (remove in production)
Route::get('/test-email', function () {
    try {
        Mail::raw('Hello from ' . config('app.name') . '! This is a test email.', function ($message) {
            $message->to('test@example.com')
                    ->subject('Test Email - ' . config('app.name'));
        });

        return 'Email sent! Check your Mailtrap inbox (or storage/logs if using log driver).';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// Preview appointment confirmation email template
Route::get('/preview-email', function () {
    $sampleData = [
        'customerName' => 'Alex Johnson',
        'companyName' => config('app.name'),
        'services' => 'Lift Kit Installation, Transmission Service',
        'appointmentDate' => now()->addDays(2)->format('l, F j, Y'),
        'appointmentTime' => '2:30 PM',
        'vehicleInfo' => '2021 Ford F-150',
        'estimatedPrice' => '875.00',
        'supportPhone' => config('app.support_phone', '(555) 123-4567'),
        'shopAddress' => config('app.shop_address', '123 Main Street, Your City, ST 00000'),
        'manageUrl' => url('/appointment'),
        'heroImage' => Vite::asset('resources/images/oil_change.png'),
        'customerEmail' => 'alex@example.com',
    ];

    return view('emails.appointment-confirmation', $sampleData);
});

Route::get('/services', function () {
    return Inertia::render('services');
})->name('services');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::get('/service-appointment', function () {
    return Inertia::render('service-appointment');
})->name('service.appointment');

Route::get('/appointment', function () {
    return Inertia::render('BookService');
})->name('appointment');
