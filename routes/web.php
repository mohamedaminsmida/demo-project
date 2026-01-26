<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('BookService');
})->name('home');

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

Route::get('/appointment', function () {
    return Inertia::render('BookService');
})->name('appointment');
