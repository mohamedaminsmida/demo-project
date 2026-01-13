export type ServiceCategory = 'tires' | 'maintenance' | 'repairs';

export type RequiredField =
    | 'vehicleInfo'
    | 'tireOptions'
    | 'oilOptions'
    | 'brakeOptions'
    | 'repairOptions';

export interface ServiceConfig {
    id: string;
    slug: string;
    name: string;
    category: ServiceCategory;
    description: string;
    estimatedDuration: string;
    basePrice?: number;
    requiredFields: RequiredField[];
}

export const services: ServiceConfig[] = [
    // Tires category
    {
        id: 'new-tires',
        slug: 'new-tires',
        name: 'New Tires',
        category: 'tires',
        description: 'High-quality new tires from trusted brands, installed and balanced on-site. Wide selection of brands & sizes with professional mounting & balancing.',
        estimatedDuration: '1-2 hours',
        requiredFields: ['vehicleInfo', 'tireOptions'],
    },
    {
        id: 'used-tires',
        slug: 'used-tires',
        name: 'Used Tires',
        category: 'tires',
        description: 'Budget-friendly, safety-checked used tires that deliver performance and value. Includes inspection before sale, mounting & balancing.',
        estimatedDuration: '1-2 hours',
        requiredFields: ['vehicleInfo', 'tireOptions'],
    },
    {
        id: 'alignment',
        slug: 'alignment',
        name: 'Wheel Alignment',
        category: 'tires',
        description: 'Precision wheel alignment to improve safety, handling, and tire lifespan. Includes front or four-wheel alignment with steering & suspension check.',
        estimatedDuration: '45 min - 1 hour',
        basePrice: 120,
        requiredFields: ['vehicleInfo'],
    },
    {
        id: 'wheels',
        slug: 'wheels',
        name: 'Wheels',
        category: 'tires',
        description: 'Wheel installation, replacement, and upgrades for aesthetics and performance. Includes wheel mounting, balancing, and fitment assistance.',
        estimatedDuration: '1-2 hours',
        requiredFields: ['vehicleInfo'],
    },
    {
        id: 'flat-repair',
        slug: 'flat-repair',
        name: 'Flat Repair',
        category: 'tires',
        description: 'Quick and reliable flat tire repair service. We patch or plug your tire to get you back on the road safely.',
        estimatedDuration: '30-45 min',
        basePrice: 30,
        requiredFields: ['vehicleInfo', 'tireOptions'],
    },

    // Maintenance category
    {
        id: 'oil-change',
        slug: 'oil-change',
        name: 'Oil Change',
        category: 'maintenance',
        description: 'Quick, clean oil changes to protect your engine and improve performance. Includes filter replacement and multi-point check.',
        estimatedDuration: '30-45 min',
        basePrice: 45,
        requiredFields: ['vehicleInfo', 'oilOptions'],
    },
    {
        id: 'brakes',
        slug: 'brakes',
        name: 'Brake Service',
        category: 'maintenance',
        description: 'Reliable brake inspections and repairs to keep you safe on the road. Includes pad and rotor replacements, caliper diagnostics, and fluid service.',
        estimatedDuration: '1-3 hours',
        requiredFields: ['vehicleInfo', 'brakeOptions'],
    },

    // Repairs category
    {
        id: 'engine-repair',
        slug: 'engine-repair',
        name: 'Engine Repair',
        category: 'repairs',
        description: 'Complete engine diagnostics and repair services. From minor fixes to major overhauls, we handle all engine issues.',
        estimatedDuration: 'Varies',
        requiredFields: ['vehicleInfo', 'repairOptions'],
    },
    {
        id: 'engine-replacement',
        slug: 'engine-replacement',
        name: 'Engine Replacement',
        category: 'repairs',
        description: 'Complete engine replacement performed with precision and high-quality parts. Includes engine sourcing, installation, and final testing.',
        estimatedDuration: '2-4 days',
        requiredFields: ['vehicleInfo', 'repairOptions'],
    },
    {
        id: 'transmission',
        slug: 'transmission',
        name: 'Transmission Service',
        category: 'repairs',
        description: 'Professional transmission diagnostics, service, and replacement. Includes fluid service, transmission repair, and full rebuild options.',
        estimatedDuration: 'Varies',
        requiredFields: ['vehicleInfo', 'repairOptions'],
    },
    {
        id: 'lift-kit',
        slug: 'lift-kit',
        name: 'Lift Kit Installation',
        category: 'repairs',
        description: 'Upgrade height and suspension with professional lift kit installation. Includes alignment after installation and safety inspection.',
        estimatedDuration: '4-8 hours',
        requiredFields: ['vehicleInfo', 'repairOptions'],
    },
];

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
    return services.find((service) => service.slug === slug);
}

export function getServicesByCategory(category: ServiceCategory): ServiceConfig[] {
    return services.filter((service) => service.category === category);
}

export function isTireService(service: ServiceConfig): boolean {
    return service.category === 'tires' || service.requiredFields.includes('tireOptions');
}

export function isOilService(service: ServiceConfig): boolean {
    return service.requiredFields.includes('oilOptions');
}

export function isBrakeService(service: ServiceConfig): boolean {
    return service.requiredFields.includes('brakeOptions');
}

export function isRepairService(service: ServiceConfig): boolean {
    return service.requiredFields.includes('repairOptions');
}
