<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/services', function () {
    return Inertia::render('services');
})->name('services');

Route::get('/service-appointment', function () {
    return Inertia::render('service-appointment');
})->name('service.appointment');
