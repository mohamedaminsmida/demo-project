<?php

namespace App\Http\Controllers;

use App\Models\AppointmentService;
use App\Models\Customer;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Models\ServiceRequirementValue;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
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
            'service_requirements' => 'nullable|array',
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

        $serviceRequirementsPayload = $request->input('service_requirements', []);
        $services = Service::with('requirements')
            ->whereIn('id', $request->input('service_ids', []))
            ->get();

        $dynamicErrors = $this->validateServiceRequirements($services, $serviceRequirementsPayload);

        if (! empty($dynamicErrors)) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $dynamicErrors,
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
            foreach ($services as $service) {
                $appointmentService = AppointmentService::create([
                    'service_appointment_id' => $appointment->id,
                    'service_id' => $service->id,
                    'price' => $service->base_price,
                ]);

                $serviceId = (string) $service->id;
                $serviceValues = is_array($serviceRequirementsPayload)
                    ? ($serviceRequirementsPayload[$serviceId] ?? [])
                    : [];

                $service->loadMissing('requirements');

                foreach ($service->requirements as $requirement) {
                    if (! array_key_exists($requirement->key, $serviceValues)) {
                        continue;
                    }

                    ServiceRequirementValue::create([
                        'appointment_service_id' => $appointmentService->id,
                        'service_requirement_id' => $requirement->id,
                        'value' => $serviceValues[$requirement->key],
                    ]);
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

    private function isRequirementValueEmpty(string $type, mixed $value): bool
    {
        if (in_array($type, ['checkbox', 'toggle'], true)) {
            return ! filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }

        if ($type === 'multiselect') {
            if (! is_array($value)) {
                return true;
            }

            return count(array_filter($value, fn ($item) => $item !== null && $item !== '')) === 0;
        }

        if (is_array($value)) {
            return count($value) === 0;
        }

        return $value === null || $value === '';
    }

    private function validateServiceRequirements(Collection $services, array $payload): array
    {
        $errors = [];

        foreach ($services as $service) {
            $serviceValues = is_array($payload)
                ? ($payload[(string) $service->id] ?? [])
                : [];

            foreach ($service->requirements as $requirement) {
                $fieldKey = "service_requirements.{$service->id}.{$requirement->key}";
                $hasValue = is_array($serviceValues) && array_key_exists($requirement->key, $serviceValues);
                $value = $hasValue ? $serviceValues[$requirement->key] : null;

                if ($requirement->is_required && $this->isRequirementValueEmpty($requirement->type, $value)) {
                    $errors[$fieldKey][] = 'This field is required.';
                    continue;
                }

                if (! $hasValue || $this->isRequirementValueEmpty($requirement->type, $value)) {
                    continue;
                }

                $validations = is_array($requirement->validations) ? $requirement->validations : [];

                switch ($requirement->type) {
                    case 'text':
                        if (! is_string($value)) {
                            $errors[$fieldKey][] = 'Must be text.';
                            break;
                        }

                        if (mb_strlen($value) > 50) {
                            $errors[$fieldKey][] = 'Must not exceed 50 characters.';
                        }
                        break;
                    case 'textarea':
                        if (! is_string($value)) {
                            $errors[$fieldKey][] = 'Must be text.';
                            break;
                        }

                        if (mb_strlen($value) > 250) {
                            $errors[$fieldKey][] = 'Must not exceed 250 characters.';
                        }
                        break;
                    case 'number':
                        if (! is_numeric($value)) {
                            $errors[$fieldKey][] = 'Must be a number.';
                            break;
                        }

                        $maxDigits = isset($validations['number_max_length'])
                            ? (int) $validations['number_max_length']
                            : null;

                        if ($maxDigits) {
                            $digits = preg_replace('/\D/', '', (string) $value);

                            if (mb_strlen($digits) > $maxDigits) {
                                $errors[$fieldKey][] = "Must not exceed {$maxDigits} digits.";
                            }
                        }
                        break;
                    case 'date':
                        try {
                            $date = Carbon::parse($value);
                        } catch (\Exception $exception) {
                            $errors[$fieldKey][] = 'Must be a valid date.';
                            break;
                        }

                        if (! empty($validations['min_date'])) {
                            $minDate = Carbon::parse($validations['min_date']);
                            if ($date->lt($minDate)) {
                                $errors[$fieldKey][] = 'Date must be on or after the minimum date.';
                            }
                        }

                        if (! empty($validations['max_date'])) {
                            $maxDate = Carbon::parse($validations['max_date']);
                            if ($date->gt($maxDate)) {
                                $errors[$fieldKey][] = 'Date must be on or before the maximum date.';
                            }
                        }
                        break;
                    case 'checkbox':
                    case 'toggle':
                        if (! in_array($value, [true, false, 0, 1, '0', '1', 'true', 'false'], true)) {
                            $errors[$fieldKey][] = 'Must be true or false.';
                        }
                        break;
                }
            }
        }

        return $errors;
    }
}
