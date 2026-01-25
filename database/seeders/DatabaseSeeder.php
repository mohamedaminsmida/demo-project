<?php

namespace Database\Seeders;

use App\Models\AppointmentService;
use App\Models\Customer;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Models\ServiceRequirementValue;
use App\Models\Setting;
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
            AdminsSeeder::class,
            ServicesSeeder::class,
        ]);

        // Seed default settings with working hours
        Setting::updateOrCreate(
            ['id' => 1],
            [
                'working_hours' => [
                    ['day' => 'monday', 'open' => '09:00', 'close' => '18:00', 'is_day_off' => false],
                    ['day' => 'tuesday', 'open' => '09:00', 'close' => '18:00', 'is_day_off' => false],
                    ['day' => 'wednesday', 'open' => '09:00', 'close' => '18:00', 'is_day_off' => false],
                    ['day' => 'thursday', 'open' => '09:00', 'close' => '18:00', 'is_day_off' => false],
                    ['day' => 'friday', 'open' => '09:00', 'close' => '18:00', 'is_day_off' => false],
                    ['day' => 'saturday', 'open' => '09:00', 'close' => '17:00', 'is_day_off' => false],
                    ['day' => 'sunday', 'open' => '', 'close' => '', 'is_day_off' => true],
                ],
            ]
        );

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

        $services = Service::with(['serviceCategory', 'requirements'])->get();
        $vehicleTypes = ['car', 'suv', 'truck', 'van', 'light-truck', 'motorcycle', 'other'];
        $timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        $statuses = ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'];

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

                        $service->loadMissing('requirements');

                        foreach ($service->requirements as $requirement) {
                            $value = null;

                            if (in_array($requirement->type, ['toggle', 'checkbox'], true)) {
                                $value = $faker->boolean();
                            } elseif ($requirement->type === 'number') {
                                $value = $faker->numberBetween(1, 4);
                            } elseif ($requirement->type === 'date') {
                                $value = Carbon::instance($faker->dateTimeBetween('-6 months', 'now'))->format('Y-m-d');
                            } elseif (in_array($requirement->type, ['textarea', 'text'], true)) {
                                $value = $faker->sentences(2, true);
                            } elseif (in_array($requirement->type, ['select', 'radio'], true)) {
                                $options = is_array($requirement->options) ? $requirement->options : [];
                                $values = collect($options)
                                    ->map(fn ($opt) => $opt['value'] ?? null)
                                    ->filter()
                                    ->values();

                                if ($values->isNotEmpty()) {
                                    $value = $faker->randomElement($values->all());
                                }
                            }

                            if ($value === null) {
                                continue;
                            }

                            ServiceRequirementValue::create([
                                'appointment_service_id' => $appointmentService->id,
                                'service_requirement_id' => $requirement->id,
                                'value' => $value,
                            ]);
                        }
                    }

                    $appointment->update([
                        'final_price' => round($estimatedPrice * $faker->randomFloat(2, 0.9, 1.15), 2),
                    ]);
                }
            }
        }
    }
}
