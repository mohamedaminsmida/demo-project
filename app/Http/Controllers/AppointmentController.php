<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    /**
     * Store a new appointment booking.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'service_id' => 'required|string',
            'vehicle.type' => 'required|string|in:car,suv,truck,van',
            'vehicle.make' => 'required|string|max:100',
            'vehicle.model' => 'required|string|max:100',
            'vehicle.year' => 'required|string|max:4',
            'vehicle.tire_size' => 'nullable|string|max:50',
            'vehicle.vin' => 'nullable|string|max:17',
            'service_options' => 'nullable|array',
            'date' => 'required|date|after:today',
            'time' => 'required|string',
            'customer.full_name' => 'required|string|max:255',
            'customer.phone' => 'required|string|max:20',
            'customer.email' => 'required|email|max:255',
            'customer.sms_updates' => 'boolean',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // In a real application, you would save the appointment to the database here
        // For now, we'll just return a success response

        $appointmentData = [
            'id' => uniqid('apt_'),
            'service_id' => $request->input('service_id'),
            'vehicle' => $request->input('vehicle'),
            'service_options' => $request->input('service_options'),
            'date' => $request->input('date'),
            'time' => $request->input('time'),
            'customer' => $request->input('customer'),
            'notes' => $request->input('notes'),
            'status' => 'pending',
            'created_at' => now()->toISOString(),
        ];

        // TODO: Save to database
        // Appointment::create($appointmentData);

        // TODO: Send confirmation email
        // Mail::to($request->input('customer.email'))->send(new AppointmentConfirmation($appointmentData));

        return response()->json([
            'success' => true,
            'message' => 'Appointment booked successfully',
            'data' => $appointmentData,
        ], 201);
    }
}
