<?php

use App\Http\Controllers\Api\ServiceCategoryController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BrevoController;
use Illuminate\Support\Facades\Route;

Route::get('/service-categories', [ServiceCategoryController::class, 'index'])->name('api.service-categories.index');

Route::get('/services', [ServiceController::class, 'index'])->name('api.services.index');
Route::get('/services/{slug}', [ServiceController::class, 'show'])->name('api.services.show');
Route::get('/settings', [SettingsController::class, 'show'])->name('api.settings.show');

Route::get('/appointments/availability', [AppointmentController::class, 'availability'])->name('appointments.availability');
Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');

// Brevo API endpoints
Route::prefix('brevo')->group(function () {
    Route::get('/account', [BrevoController::class, 'getAccount']);
    Route::get('/domains', [BrevoController::class, 'getDomains']);
    Route::get('/contacts', [BrevoController::class, 'getContacts']);
    Route::get('/campaigns', [BrevoController::class, 'getCampaigns']);
    Route::post('/send-transactional-email', [BrevoController::class, 'sendTransactionalEmail']);
    Route::post('/create-campaign', [BrevoController::class, 'createCampaign']);
});
