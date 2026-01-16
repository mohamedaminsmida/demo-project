<?php

namespace Database\Seeders;

use App\Models\AppointmentService;
use App\Models\Customer;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Models\ServiceAppointmentDetail;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ServicesSeeder::class,
            ServiceDetailsSeeder::class,
        ]);

        $faker = fake();

        $customers = collect(range(1, 12))->map(function () use ($faker) {
            return Customer::create([
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'phone' => $faker->unique()->phoneNumber(),
                'address' => $faker->streetAddress(),
                'city' => $faker->city(),
                'state' => $faker->stateAbbr(),
                'zip_code' => $faker->postcode(),
                'notes' => $faker->optional()->sentence(),
            ]);
        });

        $services = Service::all();
        $vehicleTypes = ['car', 'suv', 'truck', 'van', 'light-truck', 'motorcycle', 'other'];
        $timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        $statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

        foreach ($customers as $customer) {
            $vehicleCount = rand(1, 3);

            for ($i = 0; $i < $vehicleCount; $i++) {
                $vehicle = Vehicle::create([
                    'customer_id' => $customer->id,
                    'type' => $faker->randomElement($vehicleTypes),
                    'brand' => $faker->randomElement(['Toyota', 'Ford', 'Honda', 'Chevrolet', 'BMW', 'Audi', 'Tesla', 'Jeep']),
                    'model' => ucfirst($faker->word()),
                    'year' => (string) $faker->numberBetween(2005, 2024),
                    'vin' => strtoupper($faker->unique()->bothify('?????????????????')),
                    'tire_size' => $faker->optional()->numerify('###/##R##'),
                    'notes' => $faker->optional()->sentence(),
                    'is_primary' => $i === 0,
                ]);

                $appointmentCount = rand(1, 2);

                for ($j = 0; $j < $appointmentCount; $j++) {
                    $appointmentDate = Carbon::instance($faker->dateTimeBetween('-10 days', '+30 days'));
                    $appointment = ServiceAppointment::create([
                        'customer_id' => $customer->id,
                        'vehicle_id' => $vehicle->id,
                        'appointment_date' => $appointmentDate,
                        'appointment_time' => $faker->randomElement($timeSlots),
                        'customer_name' => $customer->name,
                        'customer_phone' => $customer->phone,
                        'customer_email' => $customer->email,
                        'sms_updates' => $faker->boolean(60),
                        'status' => $faker->randomElement($statuses),
                    ]);

                    $selectedServices = $services->random(rand(1, 3));
                    $estimatedPrice = 0;

                    foreach ($selectedServices as $service) {
                        $price = $service->base_price ?? $faker->randomFloat(2, 75, 1500);
                        $estimatedPrice += $price;

                        $appointmentService = AppointmentService::create([
                            'service_appointment_id' => $appointment->id,
                            'service_id' => $service->id,
                            'price' => $price,
                        ]);

                        $requiredFields = (array) $service->required_fields;
                        ServiceAppointmentDetail::create([
                            'appointment_service_id' => $appointmentService->id,
                            'tire_condition' => in_array('tire_condition', $requiredFields, true)
                                ? ($service->slug === 'new-tires' ? 'new' : 'used')
                                : null,
                            'number_of_tires' => in_array('number_of_tires', $requiredFields, true)
                                ? $faker->numberBetween(1, 4)
                                : null,
                            'tpms_service' => in_array('tpms_service', $requiredFields, true)
                                ? $faker->boolean()
                                : null,
                            'alignment_service' => in_array('alignment_service', $requiredFields, true)
                                ? $faker->boolean()
                                : null,
                            'wheel_type' => in_array('wheel_type', $requiredFields, true)
                                ? $faker->randomElement(['alloy', 'steel', 'chrome'])
                                : null,
                            'oil_type' => in_array('oil_type', $requiredFields, true)
                                ? $faker->randomElement(['conventional', 'synthetic', 'synthetic-blend', 'full-synthetic', 'high-mileage'])
                                : null,
                            'last_change_date' => in_array('last_change_date', $requiredFields, true)
                                ? $faker->dateTimeBetween('-6 months', 'now')
                                : null,
                            'brake_position' => in_array('brake_position', $requiredFields, true)
                                ? $faker->randomElement(['front', 'rear', 'both'])
                                : null,
                            'noise_or_vibration' => in_array('noise_or_vibration', $requiredFields, true)
                                ? $faker->boolean()
                                : null,
                            'warning_light' => in_array('warning_light', $requiredFields, true)
                                ? $faker->boolean()
                                : null,
                            'symptom_type' => $service->category === 'repairs'
                                ? $faker->randomElement(['noise', 'vibration', 'warning_light', 'performance', 'leak', 'electrical', 'other'])
                                : null,
                            'other_symptom_description' => $service->category === 'repairs'
                                ? $faker->optional()->sentence()
                                : null,
                            'problem_description' => in_array('problem_description', $requiredFields, true)
                                ? $faker->sentences(2, true)
                                : null,
                            'vehicle_drivable' => in_array('vehicle_drivable', $requiredFields, true)
                                ? $faker->randomElement(['yes', 'no'])
                                : null,
                            'photo_paths' => in_array('photo_paths', $requiredFields, true)
                                ? $faker->randomElements([
                                    '/uploads/photos/example-1.jpg',
                                    '/uploads/photos/example-2.jpg',
                                    '/uploads/photos/example-3.jpg',
                                ], rand(1, 2))
                                : null,
                        ]);
                    }

                    $appointment->update([
                        'estimated_price' => round($estimatedPrice, 2),
                        'final_price' => round($estimatedPrice * $faker->randomFloat(2, 0.9, 1.15), 2),
                    ]);
                }
            }
        }
    }
}
