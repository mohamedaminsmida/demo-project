import type { ServiceConfig } from '../../config/services';
import type { BookingState } from '../../types/booking';
import {
    getRequirementValue,
    getServiceRequirements,
    isRequirementValueEmpty,
    updateRequirementValue,
    validateRequirementValue,
} from '../../utils/bookingRequirements';
import { Checkbox, FormField, Input, Select, TextArea } from '../ui';

interface ServiceDetailsStepProps {
    services: ServiceConfig[];
    state: BookingState;
    onChange: (state: BookingState) => void;
}

export default function ServiceDetailsStep({ services, state, onChange }: ServiceDetailsStepProps) {
    if (!services || services.length === 0) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No Services Selected</h3>
                    <p className="mt-2 text-gray-500">Please go back to Step 1 and select at least one service to continue.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-bold text-gray-900">Service Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Complete the details for your {services.length} selected service{services.length > 1 ? 's' : ''}
                </p>
            </div>

            <div className="space-y-4">
                {services.map((service) => {
                    const serviceId = service.id.toString();
                    const requirements = getServiceRequirements(service);
                    const hasOptions = requirements.length > 0;

                    return (
                        <div
                            key={service.id}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-center gap-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white px-5 py-4">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                                    {service.category && (
                                        <p className="text-xs font-medium tracking-wide text-green-600 uppercase">{service.category}</p>
                                    )}
                                </div>
                                {hasOptions ? (
                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">Details Required</span>
                                ) : (
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Ready</span>
                                )}
                            </div>

                            <div className="p-5">
                                {requirements.map((requirement) => {
                                    const value = getRequirementValue(state, serviceId, requirement.key);
                                    const isRequired = requirement.isRequired ?? false;
                                    const requiredError =
                                        isRequired && isRequirementValueEmpty(requirement, value) ? 'This field is required.' : null;
                                    const validationError = validateRequirementValue(requirement, value);
                                    const errorMessage = requiredError ?? validationError;

                                    if (requirement.type === 'textarea') {
                                        return (
                                            <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                <TextArea
                                                    value={value ?? ''}
                                                    onChange={(v) => onChange(updateRequirementValue(state, serviceId, requirement.key, v))}
                                                    placeholder={requirement.placeholder ?? undefined}
                                                    rows={3}
                                                    maxLength={250}
                                                    error={errorMessage ?? undefined}
                                                />
                                            </FormField>
                                        );
                                    }

                                    if (requirement.type === 'number') {
                                        return (
                                            <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                <Input
                                                    type="number"
                                                    value={value ?? ''}
                                                    onChange={(v) =>
                                                        onChange(updateRequirementValue(state, serviceId, requirement.key, v === '' ? '' : Number(v)))
                                                    }
                                                    placeholder={requirement.placeholder ?? undefined}
                                                    error={errorMessage ?? undefined}
                                                />
                                            </FormField>
                                        );
                                    }

                                    if (requirement.type === 'select') {
                                        return (
                                            <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                <div className="space-y-2">
                                                    <Select
                                                        value={value ?? ''}
                                                        onChange={(v) => onChange(updateRequirementValue(state, serviceId, requirement.key, v))}
                                                        options={(requirement.options ?? []).map((option) => ({
                                                            value: option.value,
                                                            label: option.label,
                                                        }))}
                                                        placeholder={requirement.placeholder ?? 'Select option'}
                                                    />
                                                    {errorMessage && <p className="text-xs text-error-600">{errorMessage}</p>}
                                                </div>
                                            </FormField>
                                        );
                                    }

                                    if (requirement.type === 'multiselect') {
                                        const selectedValues = Array.isArray(value) ? value : [];
                                        return (
                                            <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                <div className="space-y-2">
                                                    {(requirement.options ?? []).map((option) => (
                                                        <Checkbox
                                                            key={option.value}
                                                            label={option.label}
                                                            isSelected={selectedValues.includes(option.value)}
                                                            onChange={(checked) => {
                                                                const next = checked
                                                                    ? [...selectedValues, option.value]
                                                                    : selectedValues.filter((item) => item !== option.value);
                                                                onChange(updateRequirementValue(state, serviceId, requirement.key, next));
                                                            }}
                                                        />
                                                    ))}
                                                    {errorMessage && <p className="text-xs text-error-600">{errorMessage}</p>}
                                                </div>
                                            </FormField>
                                        );
                                    }

                                    if (requirement.type === 'radio') {
                                        return (
                                            <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                <div className="space-y-2">
                                                    {(requirement.options ?? []).map((option) => (
                                                        <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700">
                                                            <input
                                                                type="radio"
                                                                name={`${serviceId}-${requirement.key}`}
                                                                value={option.value}
                                                                checked={value === option.value}
                                                                onChange={() =>
                                                                    onChange(updateRequirementValue(state, serviceId, requirement.key, option.value))
                                                                }
                                                                className="h-4 w-4 accent-green-600"
                                                            />
                                                            {option.label}
                                                        </label>
                                                    ))}
                                                    {errorMessage && <p className="text-xs text-error-600">{errorMessage}</p>}
                                                </div>
                                            </FormField>
                                        );
                                    }

                                    if (requirement.type === 'checkbox' || requirement.type === 'toggle') {
                                        return (
                                            <div key={requirement.key} className="space-y-2 pt-1">
                                                <Checkbox
                                                    label={requirement.label}
                                                    isSelected={Boolean(value)}
                                                    onChange={(checked) =>
                                                        onChange(updateRequirementValue(state, serviceId, requirement.key, checked))
                                                    }
                                                />
                                                {errorMessage && <p className="text-xs text-error-600">{errorMessage}</p>}
                                            </div>
                                        );
                                    }

                                    if (requirement.type === 'date') {
                                        return (
                                            <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                <Input
                                                    type="date"
                                                    value={value ?? ''}
                                                    onChange={(v) => onChange(updateRequirementValue(state, serviceId, requirement.key, v))}
                                                    error={errorMessage ?? undefined}
                                                />
                                            </FormField>
                                        );
                                    }

                                    return (
                                        <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                            <Input
                                                value={value ?? ''}
                                                onChange={(v) => onChange(updateRequirementValue(state, serviceId, requirement.key, v))}
                                                placeholder={requirement.placeholder ?? undefined}
                                                maxLength={50}
                                                error={errorMessage ?? undefined}
                                            />
                                        </FormField>
                                    );
                                })}

                                {!hasOptions && (
                                    <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3">
                                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <p className="text-sm font-medium text-green-700">
                                            No additional details required for this service. You're all set!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
