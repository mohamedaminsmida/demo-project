import type { ServiceConfig } from '../../config/services';
import { computeBookingPricing } from '../../services/bookingPricing';
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
            <div className="flex min-h-[400px] items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">No Services Selected</h3>
                    <p className="mt-2 text-gray-600">Please go back and select at least one service to continue.</p>
                </div>
            </div>
        );
    }

    console.log(
        'ServiceDetailsStep services:',
        services.map((s) => ({ id: s.id, name: s.name, image: s.image })),
    );

    const pricing = computeBookingPricing(services, state);

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">Service Information</h3>
                <p className="mt-1 text-sm text-gray-600">
                    Provide details for {services.length} selected service{services.length > 1 ? 's' : ''}
                </p>
            </div>

            <div className="space-y-5">
                {services.map((service) => {
                    const serviceId = service.id.toString();
                    const requirements = getServiceRequirements(service);
                    const hasOptions = requirements.length > 0;
                    const hasMissingRequired = requirements.some((requirement) => {
                        if (!(requirement.isRequired ?? false)) {
                            return false;
                        }
                        const value = getRequirementValue(state, serviceId, requirement.key);
                        return isRequirementValueEmpty(requirement, value);
                    });
                    const statusLabel = !hasOptions || !hasMissingRequired ? 'Ready' : 'Incomplete';
                    const statusStyles =
                        !hasOptions || !hasMissingRequired
                            ? 'bg-white text-green-700 border border-white'
                            : 'bg-amber-100/90 text-amber-900 border border-amber-200';

                    return (
                        <div key={service.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div
                                className={`relative min-h-[110px] px-6 py-5 text-white ${service.image ? '' : 'bg-gradient-to-r from-green-700 via-green-600 to-emerald-500'}`}
                            >
                                {service.image && (
                                    <img
                                        src={service.image}
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-cover"
                                        style={{ zIndex: 0 }}
                                        loading="lazy"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25" style={{ zIndex: 1 }} />
                                <div className="relative" style={{ zIndex: 2 }}>
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            {service.category && (
                                                <p className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">{service.category}</p>
                                            )}
                                            <h4 className="text-2xl font-semibold tracking-tight">{service.name}</h4>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusStyles}`}>
                                            {statusLabel}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/80">
                                        {service.estimatedDuration && (
                                            <div className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                                                <span>Duration: {service.estimatedDuration}</span>
                                            </div>
                                        )}
                                        {service.basePrice && (
                                            <div className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                                                <span>Starting at ${service.basePrice.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {requirements.length > 0 ? (
                                    <div className="space-y-5">
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
                                                                onChange(
                                                                    updateRequirementValue(
                                                                        state,
                                                                        serviceId,
                                                                        requirement.key,
                                                                        v === '' ? '' : Number(v),
                                                                    ),
                                                                )
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
                                                                onChange={(v) =>
                                                                    onChange(updateRequirementValue(state, serviceId, requirement.key, v))
                                                                }
                                                                options={(requirement.options ?? []).map((option) => ({
                                                                    value: option.value,
                                                                    label:
                                                                        typeof option.price === 'number'
                                                                            ? `${option.label} (+$${option.price.toFixed(2)})`
                                                                            : option.label,
                                                                }))}
                                                                placeholder={requirement.placeholder ?? 'Select an option'}
                                                            />
                                                            {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
                                                        </div>
                                                    </FormField>
                                                );
                                            }

                                            if (requirement.type === 'multiselect') {
                                                const selectedValues = Array.isArray(value) ? value : [];
                                                return (
                                                    <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                        <div className="space-y-2">
                                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                                {(requirement.options ?? []).map((option) => (
                                                                    <Checkbox
                                                                        key={option.value}
                                                                        label={
                                                                            typeof option.price === 'number'
                                                                                ? `${option.label} (+$${option.price.toFixed(2)})`
                                                                                : option.label
                                                                        }
                                                                        isSelected={selectedValues.includes(option.value)}
                                                                        onChange={(checked) => {
                                                                            const next = checked
                                                                                ? [...selectedValues, option.value]
                                                                                : selectedValues.filter((item) => item !== option.value);
                                                                            onChange(updateRequirementValue(state, serviceId, requirement.key, next));
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                            {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
                                                        </div>
                                                    </FormField>
                                                );
                                            }

                                            if (requirement.type === 'radio') {
                                                return (
                                                    <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                        <div className="space-y-2">
                                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                                {(requirement.options ?? []).map((option) => (
                                                                    <label
                                                                        key={option.value}
                                                                        className="flex cursor-pointer items-center gap-2.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                                                                    >
                                                                        <input
                                                                            type="radio"
                                                                            name={`${serviceId}-${requirement.key}`}
                                                                            value={option.value}
                                                                            checked={value === option.value}
                                                                            onChange={() =>
                                                                                onChange(
                                                                                    updateRequirementValue(
                                                                                        state,
                                                                                        serviceId,
                                                                                        requirement.key,
                                                                                        option.value,
                                                                                    ),
                                                                                )
                                                                            }
                                                                            className="h-4 w-4 accent-blue-600"
                                                                        />
                                                                        {typeof option.price === 'number' ? (
                                                                            <span>
                                                                                {option.label}{' '}
                                                                                <span className="text-xs text-gray-500">
                                                                                    (+${option.price.toFixed(2)})
                                                                                </span>
                                                                            </span>
                                                                        ) : (
                                                                            option.label
                                                                        )}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                            {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
                                                        </div>
                                                    </FormField>
                                                );
                                            }

                                            if (requirement.type === 'checkbox' || requirement.type === 'toggle') {
                                                return (
                                                    <div key={requirement.key} className="space-y-2 pt-1">
                                                        <Checkbox
                                                            label={
                                                                typeof requirement.price === 'number'
                                                                    ? `${requirement.label} (+$${requirement.price.toFixed(2)})`
                                                                    : requirement.label
                                                            }
                                                            isSelected={Boolean(value)}
                                                            onChange={(checked) =>
                                                                onChange(updateRequirementValue(state, serviceId, requirement.key, checked))
                                                            }
                                                        />
                                                        {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
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
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-blue-900">
                                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-semibold">No additional information needed.</p>
                                            <p className="text-xs text-blue-700/80">This service is ready to book without extra details.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-5 p-6">
                <div className="space-y-4">
                    {pricing.services.map((line) => (
                        <div key={line.serviceId} className="rounded-xl border border-gray-100 bg-white p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-gray-900">{line.name}</p>
                                    <p className="text-xs text-gray-500">Base + selected options</p>
                                </div>
                                <p className="font-semibold text-gray-900">${line.total.toFixed(2)}</p>
                            </div>

                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-700">
                                    <span>Base price</span>
                                    <span>${line.basePrice.toFixed(2)}</span>
                                </div>

                                {line.addons.length > 0 && (
                                    <div className="space-y-2">
                                        {line.addons.map((addon, idx) => (
                                            <div key={`${line.serviceId}-addon-${idx}`} className="flex justify-between text-gray-700">
                                                <span>{addon.label}</span>
                                                <span>+${addon.amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between rounded-xl bg-gray-900 px-5 py-4 text-white">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-lg font-bold">${pricing.total.toFixed(2)}</span>
                                    </div>

                                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                        <p className="text-[15px] font-bold text-red-700">All payments are on-site.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
