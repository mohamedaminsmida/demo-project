<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceDetailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $details = [
            'new-tires' => [
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
            'used-tires' => [
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
            'alignment' => [
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
            'wheels' => [
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
            'flat-repair' => [
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
            'oil-change' => [
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
            'brakes' => [
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
            'engine-repair' => [
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
            'engine-replacement' => [
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
            'transmission' => [
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
            'lift-kit' => [
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
        ];

        foreach ($details as $slug => $detailData) {
            Service::where('slug', $slug)->update(['details' => $detailData]);
        }
    }
}
