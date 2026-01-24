<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceRequirement;
use Illuminate\Database\Seeder;

class ServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoryRecords = collect([
            ['slug' => 'tires', 'name' => 'Tires'],
            ['slug' => 'maintenance', 'name' => 'Maintenance'],
            ['slug' => 'repairs', 'name' => 'Repairs'],
            ['slug' => 'upgrades', 'name' => 'Upgrades'],
        ])
            ->mapWithKeys(function (array $category): array {
                $record = ServiceCategory::updateOrCreate(
                    ['slug' => $category['slug']],
                    ['name' => $category['name']],
                );

                return [$category['slug'] => $record];
            });

        $services = [
            // TIRES CATEGORY
            [
                'slug' => 'new-tires',
                'name' => 'New Tires',
                'service_category_slug' => 'tires',
                'description' => 'High-quality new tires from trusted brands, installed and balanced on-site.',
                'estimated_duration' => '1-2 hours',
                'base_price' => 0,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'number_of_tires',
                        'label' => 'Number of Tires',
                        'type' => 'number',
                        'is_required' => true,
                        'validations' => [
                            'unit_price' => 120,
                            'number_max_length' => 1,
                        ],
                        'placeholder' => '1-4',
                        'sort_order' => 1,
                    ],
                    [
                        'key' => 'tpms_service',
                        'label' => 'TPMS Service',
                        'type' => 'toggle',
                        'price' => 25,
                        'is_required' => false,
                        'help_text' => 'TPMS sensor inspection + reset',
                        'sort_order' => 2,
                    ],
                    [
                        'key' => 'alignment_service',
                        'label' => 'Wheel Alignment',
                        'type' => 'toggle',
                        'price' => 95,
                        'is_required' => false,
                        'help_text' => 'Recommended with new tires',
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'slug' => 'used-tires',
                'name' => 'Used Tires',
                'service_category_slug' => 'tires',
                'description' => 'Budget-friendly, safety-checked used tires that deliver performance and value.',
                'estimated_duration' => '1-2 hours',
                'base_price' => 0,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'number_of_tires',
                        'label' => 'Number of Tires',
                        'type' => 'number',
                        'is_required' => true,
                        'validations' => [
                            'unit_price' => 80,
                            'number_max_length' => 1,
                        ],
                        'placeholder' => '1-4',
                        'sort_order' => 1,
                    ],
                    [
                        'key' => 'tpms_service',
                        'label' => 'TPMS Service',
                        'type' => 'toggle',
                        'price' => 25,
                        'is_required' => false,
                        'sort_order' => 2,
                    ],
                    [
                        'key' => 'alignment_service',
                        'label' => 'Wheel Alignment',
                        'type' => 'toggle',
                        'price' => 95,
                        'is_required' => false,
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'slug' => 'alignment',
                'name' => 'Wheel Alignment',
                'service_category_slug' => 'tires',
                'description' => 'Precision wheel alignment to improve safety, handling, and tire lifespan.',
                'estimated_duration' => '45 min - 1 hour',
                'base_price' => 95.00,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'alignment_type',
                        'label' => 'Alignment Type',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Two-wheel alignment', 'value' => 'two_wheel', 'price' => 0],
                            ['label' => 'Four-wheel alignment', 'value' => 'four_wheel', 'price' => 25],
                        ],
                        'sort_order' => 1,
                    ],
                ],
            ],
            [
                'slug' => 'wheels',
                'name' => 'Wheels',
                'service_category_slug' => 'upgrades',
                'description' => 'Wheel installation, replacement, and upgrades for aesthetics and performance.',
                'estimated_duration' => '1-2 hours',
                'base_price' => 140,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'wheel_package',
                        'label' => 'Package',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Standard install', 'value' => 'standard', 'price' => 0],
                            ['label' => 'Premium finish care', 'value' => 'premium', 'price' => 80],
                        ],
                        'sort_order' => 1,
                    ],
                    [
                        'key' => 'wheel_type',
                        'label' => 'Wheel Type',
                        'type' => 'select',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Steel', 'value' => 'steel', 'price' => 0],
                            ['label' => 'Alloy', 'value' => 'alloy', 'price' => 50],
                            ['label' => 'Chrome', 'value' => 'chrome', 'price' => 100],
                        ],
                        'placeholder' => 'Select wheel type',
                        'sort_order' => 2,
                    ],
                ],
            ],
            [
                'slug' => 'flat-repair',
                'name' => 'Flat Repair',
                'service_category_slug' => 'tires',
                'description' => 'Quick and reliable flat tire repair service.',
                'estimated_duration' => '30-45 min',
                'base_price' => 30.00,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'number_of_tires',
                        'label' => 'Number of Tires',
                        'type' => 'number',
                        'is_required' => true,
                        'validations' => [
                            'unit_price' => 30,
                            'number_max_length' => 1,
                        ],
                        'placeholder' => '1-4',
                        'sort_order' => 1,
                    ],
                ],
            ],

            // MAINTENANCE CATEGORY
            [
                'slug' => 'oil-change',
                'name' => 'Oil Change',
                'service_category_slug' => 'maintenance',
                'description' => 'Quick, clean oil changes to protect your engine and improve performance.',
                'estimated_duration' => '30-45 min',
                'base_price' => 45.00,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'oil_type',
                        'label' => 'Oil Type',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Conventional', 'value' => 'conventional', 'price' => 0],
                            ['label' => 'Synthetic Blend', 'value' => 'synthetic-blend', 'price' => 15],
                            ['label' => 'Full Synthetic', 'value' => 'full-synthetic', 'price' => 30],
                            ['label' => 'High Mileage', 'value' => 'high-mileage', 'price' => 20],
                        ],
                        'sort_order' => 1,
                    ],
                    [
                        'key' => 'last_change_date',
                        'label' => 'Last Oil Change Date',
                        'type' => 'date',
                        'is_required' => false,
                        'sort_order' => 2,
                    ],
                ],
            ],
            [
                'slug' => 'brakes',
                'name' => 'Brake Service',
                'service_category_slug' => 'maintenance',
                'description' => 'Reliable brake inspections and repairs to keep you safe on the road.',
                'estimated_duration' => '1-3 hours',
                'base_price' => 180,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'brake_position',
                        'label' => 'Which Brakes Need Service?',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Rear brakes', 'value' => 'rear', 'price' => 0],
                            ['label' => 'Front brakes', 'value' => 'front', 'price' => 20],
                            ['label' => 'Both front & rear', 'value' => 'both', 'price' => 170],
                        ],
                        'sort_order' => 1,
                    ],
                    [
                        'key' => 'noise_or_vibration',
                        'label' => 'Noise or vibration when braking',
                        'type' => 'checkbox',
                        'is_required' => false,
                        'sort_order' => 2,
                    ],
                    [
                        'key' => 'warning_light',
                        'label' => 'Brake warning light is on',
                        'type' => 'checkbox',
                        'is_required' => false,
                        'sort_order' => 3,
                    ],
                ],
            ],

            // REPAIRS CATEGORY
            [
                'slug' => 'engine-repair',
                'name' => 'Engine Repair',
                'service_category_slug' => 'repairs',
                'description' => 'Complete engine diagnostics and repair services.',
                'estimated_duration' => 'Varies',
                'base_price' => 150,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'engine_repair_package',
                        'label' => 'Package',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Diagnostic package', 'value' => 'diagnostic', 'price' => 0],
                            ['label' => 'Minor repair', 'value' => 'minor_repair', 'price' => 330],
                        ],
                        'sort_order' => 1,
                    ],
                    [
                        'key' => 'problem_description',
                        'label' => 'Problem Description',
                        'type' => 'textarea',
                        'is_required' => true,
                        'placeholder' => 'Describe the issue you are experiencing',
                        'sort_order' => 2,
                    ],
                    [
                        'key' => 'vehicle_drivable',
                        'label' => 'Is the vehicle drivable?',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Yes', 'value' => 'yes'],
                            ['label' => 'No', 'value' => 'no'],
                        ],
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'slug' => 'engine-replacement',
                'name' => 'Engine Replacement',
                'service_category_slug' => 'repairs',
                'description' => 'Complete engine replacement performed with precision and high-quality parts.',
                'estimated_duration' => '2-4 days',
                'base_price' => 5200,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'engine_replacement_package',
                        'label' => 'Package',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Remanufactured engine', 'value' => 'reman', 'price' => 0],
                            ['label' => 'Performance crate', 'value' => 'performance', 'price' => 1600],
                        ],
                        'sort_order' => 1,
                    ],
                    [
                        'key' => 'problem_description',
                        'label' => 'Problem Description',
                        'type' => 'textarea',
                        'is_required' => true,
                        'sort_order' => 2,
                    ],
                    [
                        'key' => 'vehicle_drivable',
                        'label' => 'Is the vehicle drivable?',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Yes', 'value' => 'yes'],
                            ['label' => 'No', 'value' => 'no'],
                        ],
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'slug' => 'transmission',
                'name' => 'Transmission Service',
                'service_category_slug' => 'repairs',
                'description' => 'Professional transmission diagnostics, service, and replacement.',
                'estimated_duration' => 'Varies',
                'base_price' => 260,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'transmission_package',
                        'label' => 'Package',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Transmission service', 'value' => 'service', 'price' => 0],
                            ['label' => 'Complete rebuild', 'value' => 'rebuild', 'price' => 2940],
                        ],
                        'sort_order' => 1,
                    ],
                    [
                        'key' => 'problem_description',
                        'label' => 'Problem Description',
                        'type' => 'textarea',
                        'is_required' => true,
                        'sort_order' => 2,
                    ],
                    [
                        'key' => 'vehicle_drivable',
                        'label' => 'Is the vehicle drivable?',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Yes', 'value' => 'yes'],
                            ['label' => 'No', 'value' => 'no'],
                        ],
                        'sort_order' => 3,
                    ],
                ],
            ],
            [
                'slug' => 'lift-kit',
                'name' => 'Lift Kit Installation',
                'service_category_slug' => 'upgrades',
                'description' => 'Upgrade height and suspension with professional lift kit installation.',
                'estimated_duration' => '4-8 hours',
                'base_price' => 680,
                'is_active' => true,
                'details' => [
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
                ],
                'requirements' => [
                    [
                        'key' => 'lift_kit_package',
                        'label' => 'Package',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => '2-inch level kit', 'value' => '2_inch', 'price' => 0],
                            ['label' => '4-inch performance lift', 'value' => '4_inch', 'price' => 870],
                        ],
                        'sort_order' => 1,
                    ],
                    [
                        'key' => 'problem_description',
                        'label' => 'Notes / Vehicle Details',
                        'type' => 'textarea',
                        'is_required' => false,
                        'sort_order' => 2,
                    ],
                    [
                        'key' => 'vehicle_drivable',
                        'label' => 'Is the vehicle drivable?',
                        'type' => 'radio',
                        'is_required' => true,
                        'options' => [
                            ['label' => 'Yes', 'value' => 'yes'],
                            ['label' => 'No', 'value' => 'no'],
                        ],
                        'sort_order' => 3,
                    ],
                ],
            ],
        ];

        foreach ($services as $serviceData) {
            $category = $categoryRecords[$serviceData['service_category_slug']] ?? null;

            $service = Service::updateOrCreate(
                ['slug' => $serviceData['slug']],
                [
                    'name' => $serviceData['name'],
                    'service_category_id' => $category?->id,
                    'description' => $serviceData['description'],
                    'details' => $serviceData['details'] ?? null,
                    'image' => $serviceData['image'] ?? null,
                    'estimated_duration' => $serviceData['estimated_duration'],
                    'base_price' => $serviceData['base_price'],
                    'is_active' => $serviceData['is_active'],
                ],
            );

            $requirements = $serviceData['requirements'] ?? [];
            $requirementKeys = collect($requirements)->pluck('key')->filter()->values();

            if ($requirementKeys->isNotEmpty()) {
                ServiceRequirement::query()
                    ->where('service_id', $service->id)
                    ->whereNotIn('key', $requirementKeys)
                    ->delete();
            }

            foreach ($requirements as $requirementData) {
                ServiceRequirement::updateOrCreate(
                    [
                        'service_id' => $service->id,
                        'key' => $requirementData['key'],
                    ],
                    [
                        'label' => $requirementData['label'],
                        'type' => $requirementData['type'],
                        'price' => $requirementData['price'] ?? null,
                        'options' => $requirementData['options'] ?? null,
                        'is_required' => $requirementData['is_required'] ?? false,
                        'validations' => $requirementData['validations'] ?? null,
                        'placeholder' => $requirementData['placeholder'] ?? null,
                        'help_text' => $requirementData['help_text'] ?? null,
                        'sort_order' => $requirementData['sort_order'] ?? 0,
                    ],
                );
            }
        }
    }
}
