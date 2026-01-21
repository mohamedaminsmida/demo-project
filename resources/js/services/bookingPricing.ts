import type { ServiceConfig, ServiceRequirement } from '../config/services';
import type { BookingState } from '../types/booking';
import { getRequirementValue, getServiceRequirements } from '../utils/bookingRequirements';

type PricingAddon = {
    label: string;
    amount: number;
};

type ServicePricingLine = {
    serviceId: string;
    name: string;
    basePrice: number;
    addons: PricingAddon[];
    total: number;
};

type BookingPricing = {
    services: ServicePricingLine[];
    total: number;
};

function toNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

function findSelectedOption(requirement: ServiceRequirement, value: unknown) {
    const options = (requirement.options ?? []) as any[];
    if (!options.length) return null;
    return options.find((opt) => String(opt?.value) === String(value)) ?? null;
}

function priceFromRequirement(requirement: ServiceRequirement, rawValue: unknown): PricingAddon[] {
    const addons: PricingAddon[] = [];

    if (requirement.type === 'multiselect') {
        const selected = Array.isArray(rawValue) ? rawValue : [];
        for (const selectedValue of selected) {
            const opt = findSelectedOption(requirement, selectedValue);
            const optPrice = toNumber((opt as any)?.price);
            if (opt && optPrice != null && optPrice > 0) {
                addons.push({ label: opt.label, amount: optPrice });
            }
        }
        return addons;
    }

    if (requirement.type === 'select' || requirement.type === 'radio') {
        const opt = findSelectedOption(requirement, rawValue);
        const optPrice = toNumber((opt as any)?.price);
        if (opt && optPrice != null && optPrice > 0) {
            addons.push({ label: opt.label, amount: optPrice });
        }
        return addons;
    }

    if (requirement.type === 'checkbox' || requirement.type === 'toggle') {
        if (Boolean(rawValue)) {
            const reqPrice = toNumber((requirement as any)?.price ?? requirement.validations?.price);
            if (reqPrice != null && reqPrice > 0) {
                addons.push({ label: requirement.label, amount: reqPrice });
            }
        }
        return addons;
    }

    if (requirement.type === 'number') {
        const quantity = toNumber(rawValue);
        const unitPrice = toNumber((requirement as any)?.unitPrice ?? requirement.validations?.unit_price);
        if (quantity != null && unitPrice != null && quantity > 0 && unitPrice > 0) {
            addons.push({ label: requirement.label, amount: quantity * unitPrice });
        }
        return addons;
    }

    return addons;
}

export function computeBookingPricing(services: ServiceConfig[], state: BookingState): BookingPricing {
    const lines: ServicePricingLine[] = services.map((service) => {
        const serviceId = service.id.toString();
        const basePrice = typeof service.basePrice === 'number' && Number.isFinite(service.basePrice) ? service.basePrice : 0;

        const requirements = getServiceRequirements(service);
        const addons: PricingAddon[] = [];

        for (const requirement of requirements) {
            const value = getRequirementValue(state, serviceId, requirement.key);
            addons.push(...priceFromRequirement(requirement, value));
        }

        const addonsTotal = addons.reduce((sum, addon) => sum + addon.amount, 0);

        return {
            serviceId,
            name: service.name,
            basePrice,
            addons,
            total: basePrice + addonsTotal,
        };
    });

    const total = lines.reduce((sum, line) => sum + line.total, 0);

    return { services: lines, total };
}
