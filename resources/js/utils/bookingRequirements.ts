import type { ServiceConfig, ServiceRequirement } from '../config/services';
import type { BookingState } from '../types/booking';

export function getServiceRequirements(service: ServiceConfig): ServiceRequirement[] {
    return [...(service.requirements ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function getRequirementValue(state: BookingState, serviceId: string, key: string) {
    return state.serviceRequirements[serviceId]?.[key];
}

export function updateRequirementValue(state: BookingState, serviceId: string, key: string, value: unknown): BookingState {
    const serviceValues = state.serviceRequirements[serviceId] ?? {};
    return {
        ...state,
        serviceRequirements: {
            ...state.serviceRequirements,
            [serviceId]: {
                ...serviceValues,
                [key]: value,
            },
        },
    };
}

export function isRequirementValueEmpty(requirement: ServiceRequirement, value: unknown): boolean {
    if (requirement.type === 'toggle' || requirement.type === 'checkbox') {
        return !value;
    }

    if (requirement.type === 'multiselect') {
        return !Array.isArray(value) || value.length === 0;
    }

    return value === undefined || value === null || value === '';
}

export function validateRequirementValue(requirement: ServiceRequirement, value: unknown): string | null {
    if (isRequirementValueEmpty(requirement, value)) {
        return null;
    }

    const validations = requirement.validations ?? {};

    switch (requirement.type) {
        case 'text':
            if (typeof value !== 'string') {
                return 'Must be text.';
            }

            if (value.length > 50) {
                return 'Must not exceed 50 characters.';
            }
            return null;
        case 'textarea':
            if (typeof value !== 'string') {
                return 'Must be text.';
            }

            if (value.length > 250) {
                return 'Must not exceed 250 characters.';
            }
            return null;
        case 'number':
            if (value === '' || Number.isNaN(Number(value))) {
                return 'Must be a number.';
            }

            if (validations.number_max_length) {
                const digits = String(value).replace(/\D/g, '');
                const maxDigits = Number(validations.number_max_length);
                if (digits.length > maxDigits) {
                    return `Must not exceed ${maxDigits} digits.`;
                }
            }
            return null;
        case 'date': {
            if (!(typeof value === 'string' || typeof value === 'number' || value instanceof Date)) {
                return 'Must be a valid date.';
            }

            const dateValue = new Date(value);
            if (Number.isNaN(dateValue.getTime())) {
                return 'Must be a valid date.';
            }

            if (typeof validations.min_date === 'string') {
                const minDate = new Date(validations.min_date);
                if (!Number.isNaN(minDate.getTime()) && dateValue < minDate) {
                    return 'Date must be on or after the minimum date.';
                }
            }

            if (typeof validations.max_date === 'string') {
                const maxDate = new Date(validations.max_date);
                if (!Number.isNaN(maxDate.getTime()) && dateValue > maxDate) {
                    return 'Date must be on or before the maximum date.';
                }
            }
            return null;
        }
        default:
            return null;
    }
}
