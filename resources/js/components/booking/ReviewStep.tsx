import type { ReactNode } from 'react';

import type { ServiceConfig } from '../../config/services';
import { useLocale } from '../../locales/LocaleProvider';
import { computeBookingPricing } from '../../services/bookingPricing';
import type { BookingState } from '../../types/booking';
import { getServiceRequirements, isRequirementValueEmpty } from '../../utils/bookingRequirements';

interface ReviewStepProps {
    service: ServiceConfig;
    state: BookingState;
    selectedServices: ServiceConfig[];
}

export default function ReviewStep({ service, state, selectedServices }: ReviewStepProps) {
    const { content: t } = useLocale();
    const services = selectedServices.length > 0 ? selectedServices : [service];
    const pricing = computeBookingPricing(services, state);

    const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

    const baseTotal = pricing.services.reduce((sum, line) => sum + line.basePrice, 0);
    const selectedOptions = pricing.services.flatMap((line) => line.addons.map((addon) => ({ ...addon, serviceName: line.name })));

    const filledServiceRequirements = services.flatMap((selectedService) => {
        const requirements = getServiceRequirements(selectedService);
        const serviceId = selectedService.id.toString();
        const values = state.serviceRequirements[serviceId] ?? {};
        return requirements
            .filter((requirement) => !isRequirementValueEmpty(requirement, values[requirement.key]))
            .map((requirement) => ({
                serviceName: selectedService.name,
                label: requirement.label,
                value: values[requirement.key],
            }));
    });

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Not selected';
        const locale = typeof document !== 'undefined' && document.documentElement.lang ? document.documentElement.lang : undefined;
        return new Date(dateStr).toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatRequirementValue = (value: unknown) => {
        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : 'Not provided';
        }

        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }

        if (value === null || value === undefined || value === '') {
            return 'Not provided';
        }

        return String(value);
    };

    const DetailRow = ({ label, value }: { label: string; value: string | ReactNode }) => (
        <div className="flex justify-between border-b border-gray-100 py-2 last:border-0">
            <span className="text-gray-500">{label}</span>
            <span className="text-right font-medium text-gray-900">{value}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 sm:text-2xl">{t.booking.review.title}</h3>

            <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-start justify-between gap-4 border-b border-gray-200 pb-2">
                        <div>
                            <h4 className="font-semibold text-gray-900">Services Booked</h4>
                            <p className="text-xs text-gray-500">Base + selected options</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{formatMoney(pricing.total)}</p>
                            <p className="text-xs font-medium text-gray-500">Total</p>
                        </div>
                    </div>

                    {filledServiceRequirements.length > 0 && (
                        <details className="group rounded-lg border border-gray-100 bg-white p-3">
                            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-gray-900">
                                <span>View details</span>
                                <span className="text-gray-400 transition-transform group-open:rotate-180">▾</span>
                            </summary>

                            <div className="mt-3 space-y-3">
                                <div>
                                    <h5 className="mb-2 text-sm font-semibold text-gray-900">Service details</h5>
                                    <div className="rounded-lg border border-gray-100 bg-white">
                                        {filledServiceRequirements.map((row, idx) => (
                                            <DetailRow
                                                key={`${row.serviceName}-${row.label}-${idx}`}
                                                label={`${row.serviceName} - ${row.label}`}
                                                value={formatRequirementValue(row.value)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </details>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">Appointment</h4>
                    <DetailRow label="Date" value={formatDate(state.appointment.date)} />
                    <DetailRow label="Time" value={state.appointment.time || 'Not selected'} />
                    {state.customer.address && <DetailRow label="Address" value={state.customer.address} />}
                    <DetailRow label="Payment" value={t.booking.serviceDetails.paymentNote} />
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">Contact Information</h4>
                    <DetailRow label="Full Name" value={state.customer.fullName} />
                    <DetailRow label="Phone" value={state.customer.phone} />
                    <DetailRow label="Email" value={state.customer.email} />
                    {state.customer.address && <DetailRow label="Address" value={state.customer.address} />}
                </div>
            </div>
        </div>
    );
}
