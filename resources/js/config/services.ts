export type ServiceCategory = 'tires' | 'maintenance' | 'repairs';

export type ServiceRequirementType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'select'
    | 'multiselect'
    | 'radio'
    | 'checkbox'
    | 'toggle'
    | 'date';

export interface ServiceRequirementOption {
    label: string;
    value: string;
}

export interface ServiceRequirement {
    id: number;
    label: string;
    key: string;
    type: ServiceRequirementType;
    options?: ServiceRequirementOption[] | null;
    isRequired?: boolean;
    validations?: Record<string, string | number | boolean> | null;
    placeholder?: string | null;
    helpText?: string | null;
    sortOrder?: number;
}

export interface ServiceDetails {
    includes?: string[];
    pricing_tiers?: Array<{ name: string; price: number; description?: string }>;
    features?: string[];
    [key: string]: any; // Allow additional custom fields
}

export interface ServiceConfig {
    id: string;
    slug: string;
    name: string;
    category: ServiceCategory;
    description: string;
    details?: ServiceDetails | null;
    image?: string | null;
    estimatedDuration: string;
    basePrice?: number;
    requirements?: ServiceRequirement[];
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
        requirements: [],
    },
    {
        id: 'used-tires',
        slug: 'used-tires',
        name: 'Used Tires',
        category: 'tires',
        description: 'Budget-friendly, safety-checked used tires that deliver performance and value. Includes inspection before sale, mounting & balancing.',
        estimatedDuration: '1-2 hours',
        requirements: [],
    },
    {
        id: 'alignment',
        slug: 'alignment',
        name: 'Wheel Alignment',
        category: 'tires',
        description: 'Precision wheel alignment to improve safety, handling, and tire lifespan. Includes front or four-wheel alignment with steering & suspension check.',
        estimatedDuration: '45 min - 1 hour',
        basePrice: 120,
        requirements: [],
    },
    {
        id: 'wheels',
        slug: 'wheels',
        name: 'Wheels',
        category: 'tires',
        description: 'Wheel installation, replacement, and upgrades for aesthetics and performance. Includes wheel mounting, balancing, and fitment assistance.',
        estimatedDuration: '1-2 hours',
        requirements: [],
    },
    {
        id: 'flat-repair',
        slug: 'flat-repair',
        name: 'Flat Repair',
        category: 'tires',
        description: 'Quick and reliable flat tire repair service. We patch or plug your tire to get you back on the road safely.',
        estimatedDuration: '30-45 min',
        basePrice: 30,
        requirements: [],
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
        requirements: [],
    },
    {
        id: 'brakes',
        slug: 'brakes',
        name: 'Brake Service',
        category: 'maintenance',
        description: 'Reliable brake inspections and repairs to keep you safe on the road. Includes pad and rotor replacements, caliper diagnostics, and fluid service.',
        estimatedDuration: '1-3 hours',
        requirements: [],
    },

    // Repairs category
    {
        id: 'engine-repair',
        slug: 'engine-repair',
        name: 'Engine Repair',
        category: 'repairs',
        description: 'Complete engine diagnostics and repair services. From minor fixes to major overhauls, we handle all engine issues.',
        estimatedDuration: 'Varies',
        requirements: [],
    },
    {
        id: 'engine-replacement',
        slug: 'engine-replacement',
        name: 'Engine Replacement',
        category: 'repairs',
        description: 'Complete engine replacement performed with precision and high-quality parts. Includes engine sourcing, installation, and final testing.',
        estimatedDuration: '2-4 days',
        requirements: [],
    },
    {
        id: 'transmission',
        slug: 'transmission',
        name: 'Transmission Service',
        category: 'repairs',
        description: 'Professional transmission diagnostics, service, and replacement. Includes fluid service, transmission repair, and full rebuild options.',
        estimatedDuration: 'Varies',
        requirements: [],
    },
    {
        id: 'lift-kit',
        slug: 'lift-kit',
        name: 'Lift Kit Installation',
        category: 'repairs',
        description: 'Upgrade height and suspension with professional lift kit installation. Includes alignment after installation and safety inspection.',
        estimatedDuration: '4-8 hours',
        requirements: [],
    },
];

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
    return services.find((service) => service.slug === slug);
}

export function getServicesByCategory(category: ServiceCategory): ServiceConfig[] {
    return services.filter((service) => service.category === category);
}

