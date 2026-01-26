import { parseDate } from '@internationalized/date';
import type { ServiceConfig } from '../../config/services';
import { useLocale } from '../../locales/LocaleProvider';
import { computeBookingPricing } from '../../services/bookingPricing';
import type { BookingState } from '../../types/booking';
import {
    getRequirementValue,
    getServiceRequirements,
    isRequirementValueEmpty,
    updateRequirementValue,
    validateRequirementValue,
} from '../../utils/bookingRequirements';
import { Checkbox, DatePicker, FormField, Input, RadioGroup, Select, TextArea } from '../ui';

interface ServiceDetailsStepProps {
    services: ServiceConfig[];
    state: BookingState;
    onChange: (state: BookingState) => void;
}

export default function ServiceDetailsStep({ services, state, onChange }: ServiceDetailsStepProps) {
    const { content: t } = useLocale();

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
                    <h3 className="text-xl font-semibold text-gray-900">{t.booking.serviceDetails.noServicesSelected}</h3>
                    <p className="mt-2 text-gray-600">{t.booking.serviceDetails.goBackAndSelect}</p>
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
                <h3 className="text-2xl font-bold text-gray-900 sm:text-2xl">{t.booking.serviceDetails.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                    {services.length > 1
                        ? t.booking.serviceDetails.provideDetailsPlural.replace('{count}', String(services.length))
                        : t.booking.serviceDetails.provideDetails.replace('{count}', String(services.length))}
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
                    const statusStyles =
                        !hasOptions || !hasMissingRequired
                            ? 'bg-white text-green-700 border border-white'
                            : 'bg-amber-100/90 text-amber-900 border border-amber-200';

                    const pricingLine = pricing.services.find((line) => line.serviceId === serviceId);

                    const normalizedImage =
                        typeof service.image === 'string' && service.image.length > 0
                            ? service.image.startsWith('http') || service.image.startsWith('/')
                                ? service.image
                                : `/storage/${service.image}`
                            : null;

                    const cardBackgroundStyle = normalizedImage
                        ? {
                              backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.85) 10%, rgba(0, 0, 0, 0.35) 75%), url(${normalizedImage})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                          }
                        : undefined;

                    const priceAmount = pricingLine ? pricingLine.total.toFixed(2) : null;

                    return (
                        <div key={service.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div
                                className={`relative flex min-h-[80px] items-center px-4 py-3 text-white ${
                                    normalizedImage ? '' : 'bg-gradient-to-r from-green-700 via-green-600 to-emerald-500'
                                }`}
                                style={cardBackgroundStyle}
                            >
                                {!normalizedImage && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25" style={{ zIndex: 1 }} />
                                )}
                                <div className="relative flex w-full flex-wrap items-center justify-between gap-4" style={{ zIndex: 2 }}>
                                    <div>
                                        {service.category && (
                                            <p className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">{service.category}</p>
                                        )}
                                        <h4 className="text-lg font-semibold tracking-tight sm:text-2xl">{service.name}</h4>
                                    </div>
                                    {priceAmount && (
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusStyles}`}>
                                            <span>$</span>
                                            <span className="ml-1">{priceAmount}</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                {requirements.length > 0 ? (
                                    <div className="space-y-5">
                                        {requirements.map((requirement) => {
                                            const value = getRequirementValue(state, serviceId, requirement.key);
                                            const isRequired = requirement.isRequired ?? false;
                                            const requiredError =
                                                isRequired && isRequirementValueEmpty(requirement, value)
                                                    ? t.booking.serviceDetails.fieldRequired
                                                    : null;
                                            const validationError = validateRequirementValue(requirement, value);
                                            const errorMessage = requiredError ?? validationError;

                                            if (requirement.type === 'textarea') {
                                                return (
                                                    <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                        <TextArea
                                                            value={typeof value === 'string' ? value : ''}
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
                                                            value={value === null || value === undefined ? '' : String(value)}
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
                                                                value={typeof value === 'string' ? value : ''}
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
                                                                placeholder={requirement.placeholder ?? t.booking.serviceDetails.selectOption}
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
                                                const radioOptions = (requirement.options ?? []).map((option) => ({
                                                    value: option.value,
                                                    label:
                                                        typeof option.price === 'number'
                                                            ? `${option.label} (+$${option.price.toFixed(2)})`
                                                            : option.label,
                                                }));

                                                return (
                                                    <RadioGroup
                                                        key={requirement.key}
                                                        name={`${serviceId}-${requirement.key}`}
                                                        label={requirement.label}
                                                        options={radioOptions}
                                                        value={typeof value === 'string' ? value : ''}
                                                        onChange={(next) => onChange(updateRequirementValue(state, serviceId, requirement.key, next))}
                                                        error={errorMessage ?? undefined}
                                                        columns={radioOptions.length > 2 ? 2 : 1}
                                                        isRequired={isRequired}
                                                    />
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
                                                const parsedDateValue = typeof value === 'string' && value ? parseDate(value) : null;

                                                return (
                                                    <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                        <div className="space-y-2">
                                                            <DatePicker
                                                                value={parsedDateValue ?? undefined}
                                                                onChange={(next) =>
                                                                    onChange(
                                                                        updateRequirementValue(
                                                                            state,
                                                                            serviceId,
                                                                            requirement.key,
                                                                            next ? next.toString() : '',
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                            {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
                                                        </div>
                                                    </FormField>
                                                );
                                            }

                                            return (
                                                <FormField key={requirement.key} label={requirement.label} required={isRequired}>
                                                    <Input
                                                        value={typeof value === 'string' ? value : ''}
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
                                            <p className="text-sm font-semibold">{t.booking.serviceDetails.noAdditionalInfo}</p>
                                            <p className="text-xs text-blue-700/80">{t.booking.serviceDetails.readyToBook}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="w-full space-y-5 px-0 py-6 sm:px-6">
                <div className="space-y-4">
                    {pricing.services.map((line) => (
                        <div key={line.serviceId} className="w-full rounded-xl border border-gray-100 bg-white p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-gray-900">{line.name}</p>
                                    <p className="text-xs text-gray-500">{t.booking.serviceDetails.baseAndOptions}</p>
                                </div>
                                <p className="font-semibold text-gray-900">${line.total.toFixed(2)}</p>
                            </div>

                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-700">
                                    <span>{t.booking.serviceDetails.basePrice}</span>
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
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 space-y-4">
                    <div className="-mx-2 flex items-center justify-between rounded-xl bg-gray-900 px-5 py-4 text-white sm:mx-0">
                        <span className="text-lg font-bold">{t.booking.serviceDetails.total}</span>
                        <span className="text-lg font-bold">${pricing.total.toFixed(2)}</span>
                    </div>

                    <div className="-mx-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:mx-0">
                        <p className="text-[15px] font-bold text-red-700">{t.booking.serviceDetails.paymentNote}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
