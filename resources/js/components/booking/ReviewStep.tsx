import type { ReactNode } from 'react';

import type { ServiceConfig } from '../../config/services';
import type { BookingState } from '../../types/booking';
import { getServiceRequirements, isRequirementValueEmpty } from '../../utils/bookingRequirements';

interface ReviewStepProps {
    service: ServiceConfig;
    state: BookingState;
    selectedServices: ServiceConfig[];
}

export default function ReviewStep({ service, state, selectedServices }: ReviewStepProps) {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Not selected';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatRequirementValue = (value: any) => {
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
            <h3 className="text-lg font-semibold text-gray-900">Review Your Booking</h3>

            <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">
                        Services Booked ({selectedServices.length > 0 ? selectedServices.length : 1})
                    </h4>
                    {selectedServices.length > 0 ? (
                        <ul className="space-y-2">
                            {selectedServices.map((selected) => (
                                <li key={selected.id} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
                                    <span className="font-medium text-gray-900">{selected.name}</span>
                                    {selected.basePrice && <span className="text-sm text-green-600">${selected.basePrice.toFixed(2)}</span>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <>
                            <DetailRow label="Service Type" value={service.name} />
                            {service.estimatedDuration && <DetailRow label="Estimated Duration" value={service.estimatedDuration} />}
                        </>
                    )}
                </div>

                {selectedServices.map((selectedService) => {
                    const requirements = getServiceRequirements(selectedService);
                    if (requirements.length === 0) {
                        return null;
                    }

                    const serviceId = selectedService.id.toString();
                    const values = state.serviceRequirements[serviceId] ?? {};
                    const filledRequirements = requirements.filter((requirement) => !isRequirementValueEmpty(requirement, values[requirement.key]));

                    if (filledRequirements.length === 0) {
                        return null;
                    }

                    return (
                        <div key={`requirements-${selectedService.id}`} className="rounded-lg border border-gray-200 p-4">
                            <h4 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">{selectedService.name} Details</h4>
                            {filledRequirements.map((requirement) => (
                                <DetailRow key={requirement.key} label={requirement.label} value={formatRequirementValue(values[requirement.key])} />
                            ))}
                        </div>
                    );
                })}

                <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">Vehicle Information</h4>
                    <DetailRow label="Vehicle" value={`${state.vehicle.year} ${state.vehicle.make} ${state.vehicle.model}`} />
                    <DetailRow label="Type" value={<span className="capitalize">{state.vehicle.vehicleType}</span>} />
                    {state.vehicle.vehicleType === 'other' && state.vehicle.otherType && (
                        <DetailRow label="Other Type" value={state.vehicle.otherType} />
                    )}
                    {state.vehicle.tireSize && <DetailRow label="Tire Size" value={state.vehicle.tireSize} />}
                    {state.vehicle.vin && <DetailRow label="VIN" value={state.vehicle.vin} />}
                    {state.vehicle.notes && <DetailRow label="Notes" value={state.vehicle.notes} />}
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">Appointment</h4>
                    <DetailRow label="Date" value={formatDate(state.appointment.date)} />
                    <DetailRow label="Time" value={state.appointment.time || 'Not selected'} />
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">Contact Information</h4>
                    <DetailRow label="Full Name" value={state.customer.fullName} />
                    <DetailRow label="Phone" value={state.customer.phone} />
                    <DetailRow label="Email" value={state.customer.email} />
                    <DetailRow label="Email Updates" value={state.customer.smsUpdates ? 'Enabled' : 'Disabled'} />
                </div>
            </div>
        </div>
    );
}
