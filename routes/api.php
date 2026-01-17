<?php

use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\AppointmentController;
use Illuminate\Support\Facades\Route;

Route::get('/services', [ServiceController::class, 'index'])->name('api.services.index');
Route::get('/services/{slug}', [ServiceController::class, 'show'])->name('api.services.show');

Route::get('/appointments/availability', [AppointmentController::class, 'availability'])->name('appointments.availability');
Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
