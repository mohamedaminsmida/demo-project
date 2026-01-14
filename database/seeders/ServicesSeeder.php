<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            // TIRES CATEGORY
            [
                'slug' => 'new-tires',
                'name' => 'New Tires',
                'category' => 'tires',
                'description' => 'High-quality new tires from trusted brands, installed and balanced on-site.',
                'estimated_duration' => '1-2 hours',
                'base_price' => null,
                'is_active' => true,
                'required_fields' => json_encode([
                    'tire_condition', // Will be 'new'
                    'number_of_tires',
                    'tpms_service',
                    'alignment_service',
                ]),
                'details' => json_encode([
                    'full_description' => 'Premium new tires sourced from trusted brands, professionally installed and balanced.',
                    'includes' => [
                        'Mount & balance included',
                        'TPMS inspection',
                        'Alignment check recommendation',
                    ],
                    'pricing_tiers' => [
                        ['name' => 'Economy set', 'price' => 480, 'description' => 'Quality tires for daily driving'],
                        ['name' => 'Performance set', 'price' => 760, 'description' => 'High-performance tires for precision handling'],
                    ],
                ]),
            ],
            [
                'slug' => 'used-tires',
                'name' => 'Used Tires',
                'category' => 'tires',
                'description' => 'Budget-friendly, safety-checked used tires that deliver performance and value.',
                'estimated_duration' => '1-2 hours',
                'base_price' => null,
                'is_active' => true,
                'required_fields' => json_encode([
                    'tire_condition', // Will be 'used'
                    'number_of_tires',
                    'tpms_service',
                    'alignment_service',
                ]),
                'details' => json_encode([
                    'full_description' => 'Budget-friendly, safety-inspected tires with plenty of tread life remaining.',
                    'includes' => [
                        'Tread depth inspection',
                        'Mount & balance service',
                        'Road-force testing when required',
                    ],
                    'pricing_tiers' => [
                        ['name' => 'Mid tread set', 'price' => 320, 'description' => '3-4 mm tread remaining'],
                        ['name' => 'High tread set', 'price' => 420, 'description' => '5-6 mm tread remaining'],
                    ],
                ]),
            ],
            [
                'slug' => 'alignment',
                'name' => 'Wheel Alignment',
                'category' => 'tires',
                'description' => 'Precision wheel alignment to improve safety, handling, and tire lifespan.',
                'estimated_duration' => '45 min - 1 hour',
                'base_price' => 120.00,
                'is_active' => true,
                'required_fields' => json_encode([
                    // Uses tire_size from vehicle table
                ]),
                'details' => json_encode([
                    'full_description' => 'Precision wheel alignment improving safety, handling, and tire longevity.',
                    'includes' => [
                        'Front or four-wheel alignment',
                        'Steering & suspension check',
                        'Tire wear analysis',
                    ],
                    'pricing_tiers' => [
                        ['name' => 'Two-wheel alignment', 'price' => 95, 'description' => 'Front axle alignment'],
                        ['name' => 'Four-wheel alignment', 'price' => 120, 'description' => 'Complete four-way alignment'],
                    ],
                ]),
            ],
            [
                'slug' => 'wheels',
                'name' => 'Wheels',
                'category' => 'tires',
                'description' => 'Wheel installation, replacement, and upgrades for aesthetics and performance.',
                'estimated_duration' => '1-2 hours',
                'base_price' => null,
                'is_active' => true,
                'required_fields' => json_encode([
                    'wheel_type',
                ]),
                'details' => json_encode([
                    'full_description' => 'Wheel installation, replacements, and upgrades for performance and style.',
                    'includes' => [
                        'Wheel fitment consultation',
                        'Torque-to-spec installation',
                        'Hub ring + spacer check',
                    ],
                    'pricing_tiers' => [
                        ['name' => 'Standard install', 'price' => 140, 'description' => 'Set of four wheels'],
                        ['name' => 'Premium finish care', 'price' => 220, 'description' => 'Ceramic protection + install'],
                    ],
                ]),
            ],
            [
                'slug' => 'flat-repair',
                'name' => 'Flat Repair',
                'category' => 'tires',
                'description' => 'Quick and reliable flat tire repair service.',
                'estimated_duration' => '30-45 min',
                'base_price' => 30.00,
                'is_active' => true,
                'required_fields' => json_encode([
                    'number_of_tires',
                ]),
                'details' => json_encode([
                    'full_description' => 'Fast puncture repairs to get you back on the road safely.',
                    'includes' => [
                        'Damage inspection',
                        'Internal patch/plug repair',
                        'Pressure + TPMS reset',
                    ],
                    'pricing_tiers' => [
                        ['name' => 'Standard puncture', 'price' => 30, 'description' => 'Single tire repair'],
                        ['name' => 'Sidewall-safe plug', 'price' => 45, 'description' => 'Specialty patch for larger wounds'],
                    ],
                ]),
            ],

            // MAINTENANCE CATEGORY
            [
                'slug' => 'oil-change',
                'name' => 'Oil Change',
                'category' => 'maintenance',
                'description' => 'Quick, clean oil changes to protect your engine and improve performance.',
                'estimated_duration' => '30-45 min',
                'base_price' => 45.00,
                'is_active' => true,
                'required_fields' => json_encode([
                    'oil_type',
                    'last_change_date',
                ]),
                'details' => json_encode([
                    'full_description' => 'Quick, clean oil changes using OEM-grade fluids and filters.',
                    'includes' => [
                        'Oil + filter replacement',
                        'Multi-point inspection',
                        'Fluid top-off & service reminders',
                    ],
                    'pricing_tiers' => [
                        ['name' => 'Conventional oil', 'price' => 45, 'description' => 'Up to 5 quarts'],
                        ['name' => 'Full synthetic', 'price' => 75, 'description' => 'Premium protection'],
                    ],
                ]),
            ],
            [
                'slug' => 'brakes',
                'name' => 'Brake Service',
                'category' => 'maintenance',
                'description' => 'Reliable brake inspections and repairs to keep you safe on the road.',
                'estimated_duration' => '1-3 hours',
                'base_price' => null,
                'is_active' => true,
                'required_fields' => json_encode([
                    'brake_position',
                    'noise_or_vibration',
                    'warning_light',
                ]),
                'details' => json_encode([
                    'full_description' => 'Complete brake diagnostics, pad/rotor replacement, and fluid service.',
                    'includes' => [
                        'Pad + rotor measurement',
                        'Brake fluid moisture test',
                        'Caliper + hardware inspection',
                    ],
                    'pricing_tiers' => [
                        ['name' => 'Front brakes', 'price' => 200, 'description' => 'Pad replacement + resurfacing'],
                        ['name' => 'Rear brakes', 'price' => 180, 'description' => 'Rear pad set with cleaning'],
                        ['name' => 'Full axle set', 'price' => 350, 'description' => 'Front + rear service bundle'],
                    ],
                ]),
            ],

            // REPAIRS CATEGORY
            [
                'slug' => 'engine-repair',
                'name' => 'Engine Repair',
                'category' => 'repairs',
                'description' => 'Complete engine diagnostics and repair services.',
                'estimated_duration' => 'Varies',
                'base_price' => null,
                'is_active' => true,
                'required_fields' => json_encode([
                    'problem_description',
                    'vehicle_drivable',
                    'photo_paths',
                ]),
                'details' => json_encode([
                    'full_description' => 'In-depth engine diagnostics and repairs performed by master technicians.',
                    'includes' => [
                        'OBD-II scan & road test',
                        'Compression/leak-down testing',
                        'OEM part sourcing',
                    ],
                    'pricing_tiers' => [
                        ['name' => 'Diagnostic package', 'price' => 150, 'description' => 'Full inspection + report'],
                        ['name' => 'Minor repair', 'price' => 480, 'description' => 'Component replacement / reseal'],
                    ],
                ]),
            ],
            [
                'slug' => 'engine-replacement',
                'name' => 'Engine Replacement',
                'category' => 'repairs',
                'description' => 'Complete engine replacement performed with precision and high-quality parts.',
                'estimated_duration' => '2-4 days',
                'base_price' => null,
                'is_active' => true,
                'required_fields' => json_encode([
                    'problem_description',
                    'vehicle_drivable',
                    'photo_paths',
                ]),
                'details' => json_encode([
                    'full_description' => 'Factory-spec engine replacement performed with precision and warranty coverage.',
                    'includes' => [
                        'Engine removal & install',
                        'Cooling + fuel system refresh',
                        'Initial break-in service',
                    ],
                    'pricing_tiers' => [
                        ['name' => 'Remanufactured engine', 'price' => 5200, 'description' => '3yr/36k warranty'],
                        ['name' => 'Performance crate', 'price' => 6800, 'description' => 'Upgraded output'],
                    ],
                ]),
            ],
            [
                'slug' => 'transmission',
                'name' => 'Transmission Service',
                'category' => 'repairs',
                'description' => 'Professional transmission diagnostics, service, and replacement.',
                'estimated_duration' => 'Varies',
                'base_price' => null,
                'is_active' => true,
                'required_fields' => json_encode([
                    'problem_description',
                    'vehicle_drivable',
                    'photo_paths',
                ]),
                'details' => json_encode([
                    'full_description' => 'Professional transmission diagnostics, rebuilds, and replacements.',
                    'includes' => [
                        'Fluid analysis & pan inspection',
                        'Valve body + solenoid testing',
                        'Clutch pack rebuilds',
                    ],
                    'pricing_tiers' => [
                        ['name' => 'Transmission service', 'price' => 260, 'description' => 'Fluid + filter change'],
                        ['name' => 'Complete rebuild', 'price' => 3200, 'description' => 'Factory warranty coverage'],
                    ],
                ]),
            ],
            [
                'slug' => 'lift-kit',
                'name' => 'Lift Kit Installation',
                'category' => 'repairs',
                'description' => 'Upgrade height and suspension with professional lift kit installation.',
                'estimated_duration' => '4-8 hours',
                'base_price' => null,
                'is_active' => true,
                'required_fields' => json_encode([
                    'problem_description',
                    'vehicle_drivable',
                    'photo_paths',
                ]),
                'details' => json_encode([
                    'full_description' => 'Suspension lift kit installs tuned for stance, clearance, and ride quality.',
                    'includes' => [
                        'Ride height consultation',
                        'Professional install & torque',
                        'Alignment + steering recalibration',
                    ],
                    'pricing_tiers' => [
                        ['name' => '2-inch level kit', 'price' => 680, 'description' => 'Entry-level lift'],
                        ['name' => '4-inch performance lift', 'price' => 1550, 'description' => 'Includes shocks + tuning'],
                    ],
                ]),
            ],
        ];

        foreach ($services as $service) {
            DB::table('services')->insert(array_merge($service, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
