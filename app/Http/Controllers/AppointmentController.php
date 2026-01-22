<?php

namespace App\Http\Controllers;

use App\Enums\AppointmentStatus;
use App\Models\AppointmentService;
use App\Models\Customer;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Models\ServiceRequirementValue;
use App\Models\Setting;
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
    private const AVAILABLE_HOURS = [
        '8:00 AM',
        '9:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '1:00 PM',
        '2:00 PM',
        '3:00 PM',
        '4:00 PM',
        '5:00 PM',
    ];

    /**
     * Return availability (booked times + available hours) for a given date.
     */
    public function availability(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'service_ids' => 'sometimes|array',
            'service_ids.*' => 'integer|exists:services,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $date = $request->input('date');

        $serviceIds = collect($request->input('service_ids', []))
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->values();

        $services = $serviceIds->isEmpty()
            ? collect()
            : Service::query()->whereIn('id', $serviceIds)->get();

        $activeStatuses = [
            AppointmentStatus::Scheduled->value,
            AppointmentStatus::InProgress->value,
        ];

        $settings = Setting::query()->first();

        $availableHours = self::AVAILABLE_HOURS;
        if (is_array($settings?->working_hours)) {
            $dayKey = strtolower(Carbon::parse($date)->format('l'));
            $entry = collect($settings->working_hours)
                ->first(fn ($item) => strtolower($item['day'] ?? '') === $dayKey);

            if (! $entry || ($entry['is_day_off'] ?? false)) {
                $availableHours = [];
            } else {
                $open = $entry['open'] ?? null;
                $close = $entry['close'] ?? null;

                if (! $open || ! $close) {
                    $availableHours = [];
                } else {
                    $start = Carbon::parse(sprintf('%s %s', $date, $open));
                    $end = Carbon::parse(sprintf('%s %s', $date, $close));

                    if ($end->lessThan($start)) {
                        $availableHours = [];
                    } else {
                        $availableHours = [];
                        $slot = $start->copy();
                        while ($slot->lessThanOrEqualTo($end)) {
                            $availableHours[] = $slot->format('g:i A');
                            $slot->addHour();
                        }
                    }
                }
            }
        }

        $bookedTimes = ServiceAppointment::query()
            ->whereDate('appointment_date', $date)
            ->whereIn('status', $activeStatuses)
            ->orderBy('appointment_time')
            ->pluck('appointment_time')
            ->unique()
            ->map(fn ($time) => Carbon::parse($time)->format('g:i A'))
            ->values();

        $unavailableHours = collect($availableHours)
            ->filter(function (string $hour) use ($date, $activeStatuses, $settings, $services) {
                $totalCount = ServiceAppointment::query()
                    ->whereDate('appointment_date', $date)
                    ->where('appointment_time', $hour)
                    ->whereIn('status', $activeStatuses)
                    ->count();

                if ($settings?->total_capacity && $totalCount >= $settings->total_capacity) {
                    return true;
                }

                foreach ($services as $service) {
                    if (! $service->max_concurrent_bookings) {
                        continue;
                    }

                    $serviceCount = ServiceAppointment::query()
                        ->whereDate('appointment_date', $date)
                        ->where('appointment_time', $hour)
                        ->whereIn('status', $activeStatuses)
                        ->whereHas('services', function ($query) use ($service) {
                            $query->where('services.id', $service->id);
                        })
                        ->count();

                    if ($serviceCount >= $service->max_concurrent_bookings) {
                        return true;
                    }
                }

                return false;
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $date,
                'available_hours' => $availableHours,
                'booked_times' => $bookedTimes,
                'unavailable_hours' => $unavailableHours,
                'server_time' => Carbon::now()->toIso8601String(),
            ],
        ]);
    }

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
            'vehicle.type' => 'required|string|in:car,light-truck,truck,motorcycle,van,other',
            'vehicle.other_type' => 'required_if:vehicle.type,other|string|min:2|max:50',
            'vehicle.make' => 'required|string|min:2|max:100',
            'vehicle.model' => 'required|string|min:1|max:100',
            'vehicle.year' => ['required', 'string', Rule::in(['pre-1980', ...array_map('strval', range((int) date('Y') + 1, 1980))])],
            'vehicle.tire_size' => ['nullable', 'string', 'max:50', 'regex:/^(Other|\d{3}\/\d{2}R\d{2})$/'],
            'vehicle.vin' => [
                'nullable',
                'string',
                'regex:/^[A-HJ-NPR-Z0-9]{17}$/i',
                Rule::unique('vehicles', 'vin')->ignore($existingVehicleId),
            ],
            'vehicle.notes' => 'nullable|string|max:500',
            'service_requirements' => 'nullable|array',
            'date' => 'required|date|after_or_equal:today',
            'time' => ['required', 'string', Rule::in(self::AVAILABLE_HOURS)],
            'customer.full_name' => 'required|string|min:2|max:255',
            'customer.phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^\+?[0-9\-()\s]{7,20}$/',
                Rule::unique('customers', 'phone')->ignore($existingCustomerId),
            ],
            'customer.email' => 'required|email:rfc,dns|max:255',
            'customer.address' => 'required|string|min:5|max:255',
            'customer.sms_updates' => 'nullable|boolean',
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

        $appointmentDate = $request->input('date');
        $appointmentTime = $request->input('time');

        $activeStatuses = [
            AppointmentStatus::Scheduled->value,
            AppointmentStatus::InProgress->value,
        ];

        $settings = Setting::query()->first();
        if ($settings?->total_capacity) {
            $activeCount = ServiceAppointment::query()
                ->whereDate('appointment_date', $appointmentDate)
                ->where('appointment_time', $appointmentTime)
                ->whereIn('status', $activeStatuses)
                ->count();

            if ($activeCount >= $settings->total_capacity) {
                return response()->json([
                    'success' => false,
                    'message' => 'No capacity available for the selected time.',
                    'errors' => ['time' => ['Garage capacity reached for this time slot.']],
                ], 422);
            }
        }

        foreach ($services as $service) {
            if (! $service->max_concurrent_bookings) {
                continue;
            }

            $serviceCount = ServiceAppointment::query()
                ->whereDate('appointment_date', $appointmentDate)
                ->where('appointment_time', $appointmentTime)
                ->whereIn('status', $activeStatuses)
                ->whereHas('services', function ($query) use ($service) {
                    $query->where('services.id', $service->id);
                })
                ->count();

            if ($serviceCount >= $service->max_concurrent_bookings) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service capacity reached for the selected time.',
                    'errors' => ['time' => ['Service capacity reached for this time slot.']],
                ], 422);
            }
        }

        try {
            DB::beginTransaction();

            $customerData = $request->input('customer');
            $customer = Customer::updateOrCreate([
                'phone' => $customerData['phone'],
            ], [
                'name' => $customerData['full_name'],
                'email' => $customerData['email'],
                'address' => $customerData['address'] ?? null,
            ]);

            // Create the vehicle for the customer
            $vehicleData = $request->input('vehicle');
            $vehicleVin = $vehicleData['vin'] ?? null;
            $vehicleAttributes = [
                'customer_id' => $customer->id,
                'type' => $vehicleData['type'],
                'other_type' => $vehicleData['type'] === 'other' ? ($vehicleData['other_type'] ?? null) : null,
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

            // Send booking emails using Laravel Notifications
            $appointment->load(['services', 'vehicle']);

            $adminEmail = Setting::query()->first()?->footer_email
                ?: config('mail.from.address');

            if ($adminEmail) {
                try {
                    \Illuminate\Support\Facades\Notification::route('mail', $adminEmail)
                        ->notify(new \App\Notifications\AdminAppointmentBookedNotification($appointment));
                } catch (\Exception $e) {
                    Log::warning('Failed to send admin booking email to ' . $adminEmail . ': ' . $e->getMessage());
                }
            }

            try {
                \Illuminate\Support\Facades\Notification::route('mail', $appointment->customer_email)
                    ->notify(new \App\Notifications\AppointmentConfirmationNotification($appointment));
            } catch (\Exception $e) {
                Log::warning('Failed to send customer booking email to ' . $appointment->customer_email . ': ' . $e->getMessage());
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
