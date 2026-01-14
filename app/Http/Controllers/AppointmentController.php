<?php

namespace App\Http\Controllers;

use App\Models\AppointmentService;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    /**
     * Store a new appointment booking.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'service_ids' => 'required|array|min:1',
            'service_ids.*' => 'required|integer|exists:services,id',
            'vehicle.type' => 'required|string|in:car,light-truck,truck,motorcycle,van,suv,other',
            'vehicle.make' => 'required|string|max:100',
            'vehicle.model' => 'required|string|max:100',
            'vehicle.year' => 'required|string|max:4',
            'vehicle.tire_size' => 'nullable|string|max:50',
            'vehicle.vin' => 'nullable|string|max:17',
            'vehicle.notes' => 'nullable|string|max:1000',
            'service_options' => 'nullable|array',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|string',
            'customer.full_name' => 'required|string|max:255',
            'customer.phone' => 'required|string|max:20',
            'customer.email' => 'required|email|max:255',
            'customer.sms_updates' => 'boolean',
        ]);

        Log::info('Appointment request data:', $request->all());

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create the vehicle (user_id is null for guest bookings)
            $vehicleData = $request->input('vehicle');
            $vehicle = Vehicle::create([
                'user_id' => auth()->id(), // Will be null for guest users
                'type' => $vehicleData['type'],
                'brand' => $vehicleData['make'],
                'model' => $vehicleData['model'],
                'year' => $vehicleData['year'],
                'vin' => $vehicleData['vin'] ?? null,
                'tire_size' => $vehicleData['tire_size'] ?? null,
                'notes' => $vehicleData['notes'] ?? null,
            ]);

            // Calculate estimated price from selected services
            $serviceIds = $request->input('service_ids');
            $services = Service::whereIn('id', $serviceIds)->get();
            $estimatedPrice = $services->sum('base_price');

            // Create the appointment (user_id is null for guest bookings)
            $customerData = $request->input('customer');
            $appointment = ServiceAppointment::create([
                'user_id' => auth()->id(), // Will be null for guest users
                'vehicle_id' => $vehicle->id,
                'appointment_date' => $request->input('date'),
                'appointment_time' => $request->input('time'),
                'customer_name' => $customerData['full_name'],
                'customer_phone' => $customerData['phone'],
                'customer_email' => $customerData['email'],
                'sms_updates' => $customerData['sms_updates'] ?? false,
                'estimated_price' => $estimatedPrice,
                'status' => 'pending',
            ]);

            // Attach services to the appointment with their details
            $serviceOptions = $request->input('service_options', []);
            
            foreach ($services as $service) {
                $appointmentService = AppointmentService::create([
                    'service_appointment_id' => $appointment->id,
                    'service_id' => $service->id,
                    'price' => $service->base_price,
                ]);

                // Save service-specific details based on service category/type
                $detailData = ['appointment_service_id' => $appointmentService->id];
                
                // Tire options
                if (!empty($serviceOptions['tire_options'])) {
                    $tireOpts = $serviceOptions['tire_options'];
                    $detailData['tire_condition'] = $tireOpts['newOrUsed'] ?? null;
                    $detailData['number_of_tires'] = $tireOpts['numberOfTires'] ?? null;
                    $detailData['tpms_service'] = $tireOpts['tpms'] ?? false;
                    $detailData['alignment_service'] = $tireOpts['alignment'] ?? false;
                }
                
                // Oil options
                if (!empty($serviceOptions['oil_options'])) {
                    $oilOpts = $serviceOptions['oil_options'];
                    $detailData['oil_type'] = $oilOpts['oilType'] ?? null;
                    $detailData['last_change_date'] = $oilOpts['lastChangeDate'] ?? null;
                }
                
                // Brake options
                if (!empty($serviceOptions['brake_options'])) {
                    $brakeOpts = $serviceOptions['brake_options'];
                    $detailData['brake_position'] = $brakeOpts['position'] ?? null;
                    $detailData['noise_or_vibration'] = $brakeOpts['noiseOrVibration'] ?? false;
                    $detailData['warning_light'] = $brakeOpts['warningLight'] ?? false;
                }
                
                // Repair options
                if (!empty($serviceOptions['repair_options'])) {
                    $repairOpts = $serviceOptions['repair_options'];
                    $detailData['problem_description'] = $repairOpts['problem_description'] ?? null;
                    $detailData['vehicle_drivable'] = $repairOpts['drivable'] ?? null;
                }
                
                // Only create detail record if there's actual data beyond the ID
                if (count($detailData) > 1) {
                    \App\Models\ServiceAppointmentDetail::create($detailData);
                }
            }

            DB::commit();

            // Send confirmation email
            try {
                $appointment->load(['services', 'vehicle']);
                (new \App\Mail\AppointmentConfirmation($appointment))->send();
            } catch (\Exception $e) {
                // Log email error but don't fail the appointment creation
                Log::warning('Failed to send appointment confirmation email: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Appointment booked successfully',
                'data' => [
                    'id' => $appointment->id,
                    'appointment_date' => $appointment->appointment_date,
                    'appointment_time' => $appointment->appointment_time,
                    'customer_name' => $appointment->customer_name,
                    'customer_email' => $appointment->customer_email,
                    'estimated_price' => $appointment->estimated_price,
                    'status' => $appointment->status,
                    'services' => $services->pluck('name'),
                    'vehicle' => $vehicle->full_name,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Appointment creation failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create appointment. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
