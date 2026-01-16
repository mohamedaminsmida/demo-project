<?php

namespace App\Http\Controllers;

use App\Models\AppointmentService;
use App\Models\Customer;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    /**
     * Store a new appointment booking.
     */
    public function store(Request $request): JsonResponse
    {
        $existingCustomerId = Customer::where('phone', $request->input('customer.phone'))->value('id');
        $existingVehicleId = Vehicle::where('vin', $request->input('vehicle.vin'))->value('id');

        $validator = Validator::make($request->all(), [
            'service_ids' => 'required|array|min:1',
            'service_ids.*' => 'required|integer|exists:services,id',
            'vehicle.type' => 'required|string|in:car,light-truck,truck,motorcycle,van,suv,other',
            'vehicle.make' => 'required|string|max:100',
            'vehicle.model' => 'required|string|max:100',
            'vehicle.year' => 'required|string|max:4',
            'vehicle.tire_size' => 'nullable|string|max:50',
            'vehicle.vin' => [
                'required',
                'string',
                'max:17',
                Rule::unique('vehicles', 'vin')->ignore($existingVehicleId),
            ],
            'vehicle.notes' => 'nullable|string|max:1000',
            'service_options' => 'nullable|array',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|string',
            'customer.full_name' => 'required|string|max:255',
            'customer.phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('customers', 'phone')->ignore($existingCustomerId),
            ],
            'customer.email' => 'required|email|max:255',
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

            $customerData = $request->input('customer');
            $customer = Customer::updateOrCreate([
                'phone' => $customerData['phone'],
            ], [
                'name' => $customerData['full_name'],
                'email' => $customerData['email'],
            ]);

            // Create the vehicle for the customer
            $vehicleData = $request->input('vehicle');
            $vehicleVin = $vehicleData['vin'] ?? null;
            $vehicleAttributes = [
                'customer_id' => $customer->id,
                'type' => $vehicleData['type'],
                'brand' => $vehicleData['make'],
                'model' => $vehicleData['model'],
                'year' => $vehicleData['year'],
                'vin' => $vehicleVin,
                'tire_size' => $vehicleData['tire_size'] ?? null,
                'notes' => $vehicleData['notes'] ?? null,
            ];

            if ($vehicleVin) {
                $vehicle = Vehicle::firstOrCreate(['vin' => $vehicleVin], $vehicleAttributes);

                if ($vehicle->customer_id !== $customer->id) {
                    $vehicle->customer_id = $customer->id;
                    $vehicle->save();
                }
            } else {
                $vehicle = Vehicle::create($vehicleAttributes);
            }

            // Calculate estimated price from selected services
            $serviceIds = $request->input('service_ids');
            $services = Service::whereIn('id', $serviceIds)->get();
            // Create the appointment for the customer
            $appointment = ServiceAppointment::create([
                'customer_id' => $customer->id,
                'vehicle_id' => $vehicle->id,
                'appointment_date' => $request->input('date'),
                'appointment_time' => $request->input('time'),
                'customer_name' => $customerData['full_name'],
                'customer_phone' => $customerData['phone'],
                'customer_email' => $customerData['email'],
                'status' => 'scheduled',
            ]);

            // Attach services to the appointment with their per-service details
            $serviceDetails = $request->input('service_details', []);
            
            foreach ($services as $service) {
                $appointmentService = AppointmentService::create([
                    'service_appointment_id' => $appointment->id,
                    'service_id' => $service->id,
                    'price' => $service->base_price,
                ]);

                // Get details specific to this service
                $serviceId = (string) $service->id;
                $details = $serviceDetails[$serviceId] ?? null;
                
                if (!$details) {
                    continue;
                }

                // Save service-specific details
                $detailData = ['appointment_service_id' => $appointmentService->id];
                
                // Tire options
                if (!empty($details['tire_options'])) {
                    $tireOpts = $details['tire_options'];
                    $detailData['tire_condition'] = $tireOpts['newOrUsed'] ?? null;
                    $detailData['number_of_tires'] = $tireOpts['numberOfTires'] ?? null;
                    $detailData['tpms_service'] = $tireOpts['tpms'] ?? false;
                    $detailData['alignment_service'] = $tireOpts['alignment'] ?? false;
                }
                
                // Oil options
                if (!empty($details['oil_options'])) {
                    $oilOpts = $details['oil_options'];
                    $detailData['oil_type'] = $oilOpts['oilType'] ?? null;
                    $detailData['last_change_date'] = $oilOpts['lastChangeDate'] ?? null;
                }
                
                // Brake options
                if (!empty($details['brake_options'])) {
                    $brakeOpts = $details['brake_options'];
                    $detailData['brake_position'] = $brakeOpts['position'] ?? null;
                    $detailData['noise_or_vibration'] = $brakeOpts['noiseOrVibration'] ?? false;
                    $detailData['warning_light'] = $brakeOpts['warningLight'] ?? false;
                }
                
                // Repair options
                if (!empty($details['repair_options'])) {
                    $repairOpts = $details['repair_options'];
                    $detailData['symptom_type'] = $repairOpts['symptom_type'] ?? null;
                    $detailData['other_symptom_description'] = $repairOpts['other_symptom_description'] ?? null;
                    $detailData['problem_description'] = $repairOpts['problem_description'] ?? null;
                    $detailData['vehicle_drivable'] = $repairOpts['drivable'] ?? null;
                }
                
                // Only create detail record if there's actual data beyond the ID
                if (count($detailData) > 1) {
                    \App\Models\ServiceAppointmentDetail::create($detailData);
                }
            }

            DB::commit();

            // Send confirmation email using Laravel Notification
            try {
                $appointment->load(['services', 'vehicle']);
                \Illuminate\Support\Facades\Notification::route('mail', $appointment->customer_email)
                    ->notify(new \App\Notifications\AppointmentConfirmationNotification($appointment));
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
