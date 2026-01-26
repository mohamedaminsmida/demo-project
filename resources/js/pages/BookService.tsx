import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import heroBackgroundImage from '../../images/first_section.png';
import CheckIcon from '../../images/svg/check.svg';

import AppointmentStep from '../components/booking/AppointmentStep';
import BookingWizard from '../components/booking/BookingWizard';
import CustomerInfoForm from '../components/booking/CustomerInfoForm';
import ReviewStep from '../components/booking/ReviewStep';
import ServiceDetailsStep from '../components/booking/ServiceDetailsStep';
import VehicleInfoForm from '../components/booking/VehicleInfoForm';
import Layout from '../components/layout/Layout';
import ServicePreview from '../components/services/ServicePreview';
import ServicesCards from '../components/services/ServicesCards';
import { getServiceBySlug, type ServiceConfig } from '../config/services';
import { useService } from '../hooks/useService';
import { useServices } from '../hooks/useServices';
import { useLocale } from '../locales/LocaleProvider';
import type { BookingState, CustomerInfo } from '../types/booking';
import type { VehicleInfo } from '../types/vehicle';
import { getRequirementValue, getServiceRequirements, isRequirementValueEmpty } from '../utils/bookingRequirements';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

const initialState: BookingState = {
    vehicle: {
        vehicleType: '',
        otherType: '',
        make: '',
        model: '',
        year: '',
        tireSize: '',
        vin: '',
        notes: '',
    },
    serviceRequirements: {},
    appointment: {
        date: '',
        time: '',
    },
    customer: {
        fullName: '',
        phone: '',
        email: '',
        address: '',
        smsUpdates: false,
    },
};

function serviceNeedsTireSize(service?: ServiceConfig | null): boolean {
    if (!service) {
        return false;
    }

    return (service.requirements ?? []).some((requirement) => requirement.key === 'tire_size');
}

const VEHICLE_TYPE_VALUES: VehicleInfo['vehicleType'][] = ['car', 'light-truck', 'truck', 'motorcycle', 'van', 'other'];
const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/i;

function validateVehicleInfo(vehicle: VehicleInfo, requiresTireSize: boolean): Partial<Record<keyof VehicleInfo, string>> {
    const errors: Partial<Record<keyof VehicleInfo, string>> = {};
    const currentYear = new Date().getFullYear();

    if (!vehicle.vehicleType || !VEHICLE_TYPE_VALUES.includes(vehicle.vehicleType)) {
        errors.vehicleType = 'Select a valid vehicle type.';
    }

    if (vehicle.vehicleType === 'other') {
        const normalizedOtherType = typeof vehicle.otherType === 'string' ? vehicle.otherType.trim() : '';
        if (!normalizedOtherType) {
            errors.otherType = 'Please specify the vehicle type.';
        } else if (normalizedOtherType.length < 2 || normalizedOtherType.length > 50) {
            errors.otherType = 'Vehicle type must be between 2 and 50 characters.';
        }
    }

    const trimmedMake = vehicle.make.trim();
    if (!trimmedMake) {
        errors.make = 'Vehicle make is required.';
    } else if (trimmedMake.length < 2 || trimmedMake.length > 100) {
        errors.make = 'Vehicle make must be between 2 and 100 characters.';
    }

    const trimmedModel = vehicle.model.trim();
    if (!trimmedModel) {
        errors.model = 'Vehicle model is required.';
    } else if (trimmedModel.length < 1 || trimmedModel.length > 100) {
        errors.model = 'Vehicle model must be between 1 and 100 characters.';
    }

    if (!vehicle.year) {
        errors.year = 'Select a model year.';
    } else if (vehicle.year !== 'pre-1980') {
        if (!/^\d{4}$/.test(vehicle.year)) {
            errors.year = 'Enter a valid 4-digit year.';
        } else {
            const numericYear = Number(vehicle.year);
            if (numericYear < 1980 || numericYear > currentYear + 1) {
                errors.year = `Year must be between 1980 and ${currentYear + 1}.`;
            }
        }
    }

    if (requiresTireSize) {
        if (!vehicle.tireSize) {
            errors.tireSize = 'Tire size is required.';
        } else if (!/^(Other|\d{3}\/\d{2}R\d{2})$/.test(vehicle.tireSize)) {
            errors.tireSize = 'Enter a valid tire size.';
        }
    }

    if (vehicle.vin) {
        const sanitizedVin = vehicle.vin.trim().toUpperCase();
        if (!VIN_PATTERN.test(sanitizedVin)) {
            errors.vin = 'VIN must be 17 characters (letters and numbers only).';
        }
    }

    if (vehicle.notes && vehicle.notes.length > 500) {
        errors.notes = 'Notes must not exceed 500 characters.';
    }

    return errors;
}

function flattenBackendErrors(errors: Record<string, string[]>, prefix: string): Record<string, string> {
    return Object.keys(errors).reduce<Record<string, string>>((acc, key) => {
        if (!key.startsWith(prefix)) {
            return acc;
        }

        const field = key.replace(prefix, '');
        const message = errors[key]?.[0];
        if (field && message) {
            acc[field] = message;
        }
        return acc;
    }, {});
}

function validateCustomerInfo(customer: CustomerInfo): Partial<Record<keyof CustomerInfo, string>> {
    const errors: Partial<Record<keyof CustomerInfo, string>> = {};
    const trimmedName = customer.fullName.trim();
    const trimmedPhone = customer.phone.trim();
    const trimmedEmail = customer.email.trim();
    const trimmedAddress = customer.address.trim();

    if (!trimmedName) {
        errors.fullName = 'Full name is required.';
    } else if (trimmedName.length < 2 || trimmedName.length > 255) {
        errors.fullName = 'Full name must be between 2 and 255 characters.';
    }

    if (!trimmedPhone) {
        errors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\-()\s]{7,20}$/.test(trimmedPhone)) {
        errors.phone = 'Enter a valid phone number.';
    }

    if (!trimmedEmail) {
        errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        errors.email = 'Enter a valid email address.';
    }

    if (!trimmedAddress) {
        errors.address = 'Address is required.';
    } else if (trimmedAddress.length < 5 || trimmedAddress.length > 255) {
        errors.address = 'Address must be between 5 and 255 characters.';
    }

    return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

interface BookServiceProps {
    serviceSlug?: string;
}

export default function BookService({ serviceSlug }: BookServiceProps) {
    const { content: t } = useLocale();
    const heroBackground = (
        <div
            className="h-screen w-full bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${heroBackgroundImage})`,
            }}
        />
    );

    // Fetch services from database
    const { services: dbServices, loading: servicesLoading } = useServices();

    const initialSlug = (() => {
        if (serviceSlug) {
            return serviceSlug;
        }

        if (typeof window === 'undefined') {
            return '';
        }

        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('service') || '';
    })();

    const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>(initialSlug);

    // Fetch the selected service from database
    const { service: dbService, loading: serviceLoading } = useService(selectedServiceSlug);

    // Fallback to static config if database service not loaded yet
    const service = dbService || getServiceBySlug(selectedServiceSlug);

    const [currentStep, setCurrentStep] = useState(1);
    const [state, setState] = useState<BookingState>(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
    const [vehicleErrors, setVehicleErrors] = useState<Partial<Record<keyof VehicleInfo, string>>>({});
    const [customerErrors, setCustomerErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

    const formatSuccessDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const allServiceIds = useMemo(() => {
        if (!service) return [] as number[];

        const mainServiceId = typeof service.id === 'string' ? parseInt(service.id, 10) : service.id;
        return [
            mainServiceId,
            ...selectedServiceIds
                .filter((id) => id !== service.id.toString() && id !== service.id)
                .map((id) => (typeof id === 'string' ? parseInt(id, 10) : id)),
        ].filter((id) => !isNaN(id));
    }, [service, selectedServiceIds]);

    useEffect(() => {
        if (!servicesLoading && dbServices.length > 0 && !selectedServiceSlug) {
            setSelectedServiceSlug(dbServices[0]?.slug ?? '');
        }
    }, [servicesLoading, dbServices, selectedServiceSlug]);

    // Pre-select service from URL query parameter when services are loaded
    useEffect(() => {
        if (!servicesLoading && dbServices.length > 0 && selectedServiceSlug) {
            // Find the service that matches the slug from URL
            const matchingService = dbServices.find(
                (s) => s.slug === selectedServiceSlug || s.name.toLowerCase().replace(/\s+/g, '-') === selectedServiceSlug.toLowerCase(),
            );
            if (matchingService) {
                const serviceId = matchingService.id.toString();
                // Only add if not already selected
                setSelectedServiceIds((prev) => {
                    if (!prev.includes(serviceId)) {
                        return [...prev, serviceId];
                    }
                    return prev;
                });
            }
        }
    }, [servicesLoading, dbServices, selectedServiceSlug]);

    const isBootstrapping = (!selectedServiceSlug && (servicesLoading || serviceLoading)) || (!service && (servicesLoading || serviceLoading));

    useEffect(() => {
        if (currentStep === 3) {
            setVehicleErrors(validateVehicleInfo(state.vehicle, serviceNeedsTireSize(service)));
        }
    }, [currentStep, state.vehicle, service]);

    useEffect(() => {
        if (currentStep === 5) {
            setCustomerErrors(validateCustomerInfo(state.customer));
        }
    }, [currentStep, state.customer]);

    const canProceed = useCallback((): boolean => {
        switch (currentStep) {
            case 1:
                // Service Summary - require at least one service selected
                return selectedServiceIds.length > 0;
            case 2:
                // Appointment
                return !!(state.appointment.date && state.appointment.time);
            case 3:
                // Vehicle Info
                return Object.keys(validateVehicleInfo(state.vehicle, serviceNeedsTireSize(service))).length === 0;
            case 4: {
                // Service Details - validate all selected services
                const selectedServices = dbServices.filter((s) => selectedServiceIds.includes(s.id.toString()));

                // Check each selected service has required fields filled
                for (const selectedService of selectedServices) {
                    const serviceId = selectedService.id.toString();
                    const requirements = getServiceRequirements(selectedService);

                    for (const requirement of requirements) {
                        if (!requirement.isRequired) {
                            continue;
                        }

                        const value = getRequirementValue(state, serviceId, requirement.key);

                        if (isRequirementValueEmpty(requirement, value)) {
                            return false;
                        }
                    }
                }

                return true;
            }
            case 5:
                // Customer Info
                return Object.keys(validateCustomerInfo(state.customer)).length === 0;
            case 6:
                // Review & Submit
                return true;
            default:
                return false;
        }
    }, [currentStep, state, service, selectedServiceIds, dbServices]);

    if (isBootstrapping) {
        return (
            <Layout boxed={true} backgroundColorClass="bg-gray-200" contentBackgroundClass="bg-white" background={heroBackground} showFooter={true}>
                <Head title={t.booking.page.loadingServices} />
                <div className="py-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-700 border-r-transparent" />
                    <p className="mt-4 text-gray-600">{t.booking.page.loadingServices}</p>
                </div>
            </Layout>
        );
    }

    const handleSubmit = async () => {
        if (!service) return;

        const nextVehicleErrors = validateVehicleInfo(state.vehicle, serviceNeedsTireSize(service));
        if (Object.keys(nextVehicleErrors).length > 0) {
            setVehicleErrors(nextVehicleErrors);
            setCurrentStep(3);
            setSubmitError(t.booking.page.correctVehicleDetails);
            return;
        }

        const normalizedOtherType = state.vehicle.vehicleType === 'other' ? String(state.vehicle.otherType ?? '').trim() : null;
        if (state.vehicle.vehicleType === 'other' && (!normalizedOtherType || normalizedOtherType.length < 2)) {
            setVehicleErrors({ otherType: 'Vehicle type must be between 2 and 50 characters.' });
            setCurrentStep(3);
            setSubmitError(t.booking.page.correctVehicleDetails);
            return;
        }

        const nextCustomerErrors = validateCustomerInfo(state.customer);
        if (Object.keys(nextCustomerErrors).length > 0) {
            setCustomerErrors(nextCustomerErrors);
            setCurrentStep(5);
            setSubmitError(t.booking.page.correctContactDetails);
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        const serviceRequirementsPayload = state.serviceRequirements;

        const payload = {
            service_ids: allServiceIds,
            vehicle: {
                type: state.vehicle.vehicleType,
                ...(state.vehicle.vehicleType === 'other' && normalizedOtherType ? { other_type: normalizedOtherType } : {}),
                make: state.vehicle.make,
                model: state.vehicle.model,
                year: state.vehicle.year,
                tire_size: state.vehicle.tireSize || null,
                vin: state.vehicle.vin || null,
                notes: state.vehicle.notes || null,
            },
            service_requirements: serviceRequirementsPayload,
            date: state.appointment.date,
            time: state.appointment.time,
            customer: {
                full_name: state.customer.fullName,
                phone: state.customer.phone,
                email: state.customer.email,
                address: state.customer.address,
                sms_updates: state.customer.smsUpdates,
            },
        };

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (!response.ok) {
                // Log detailed validation errors
                if (data.errors) {
                    console.error('Validation errors:', data.errors);
                    const vehicleServerErrors = flattenBackendErrors(data.errors, 'vehicle.');
                    const customerServerErrors = flattenBackendErrors(data.errors, 'customer.');

                    if (Object.keys(vehicleServerErrors).length > 0) {
                        setVehicleErrors(vehicleServerErrors as Partial<Record<keyof VehicleInfo, string>>);
                        setCurrentStep(3);
                    }

                    if (Object.keys(customerServerErrors).length > 0) {
                        setCustomerErrors(customerServerErrors as Partial<Record<keyof CustomerInfo, string>>);
                        setCurrentStep(5);
                    }
                }
                throw new Error(data.message || 'Failed to submit appointment');
            }

            setSubmitSuccess(true);
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitError(error instanceof Error ? error.message : t.booking.page.genericError);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Service not found
    if (selectedServiceSlug && !service && !servicesLoading && !serviceLoading) {
        return (
            <Layout boxed={true} backgroundColorClass="bg-gray-300" contentBackgroundClass="bg-white" background={heroBackground} showFooter={true}>
                <Head title={t.booking.page.serviceNotFoundTitle} />
                <div className="py-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900">{t.booking.page.serviceNotFoundTitle}</h1>
                    <p className="mb-6 text-gray-600">{t.booking.page.serviceNotFoundMessage}</p>
                    <a
                        href="/"
                        className="inline-flex items-center rounded-full bg-green-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                        {t.booking.page.backToBooking}
                    </a>
                </div>
            </Layout>
        );
    }

    // Loading state - show full-screen loader while submitting
    if (isSubmitting) {
        return (
            <Layout boxed={true} backgroundColorClass="bg-gray-300" contentBackgroundClass="bg-white" background={heroBackground} showFooter={true}>
                <Head title={t.booking.page.submittingHeadTitle} />
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="rounded-2xl bg-white p-8 shadow-2xl">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"></div>
                            <p className="text-lg font-semibold text-gray-900">{t.booking.page.submittingTitle}</p>
                            <p className="text-sm text-gray-500">{t.booking.page.submittingSubtitle}</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // Success state
    if (submitSuccess) {
        const successDate = formatSuccessDate(state.appointment.date);
        const successTime = state.appointment.time || '';
        const appointmentLabel = successDate && successTime ? `${successDate} at ${successTime}` : successDate || successTime;

        return (
            <Layout
                boxed={true}
                backgroundColorClass="bg-gray-400"
                contentBackgroundClass="bg-[#f5f5f5f5]"
                background={heroBackground}
                showFooter={true}
            >
                <Head title={t.booking.page.bookingConfirmedHeadTitle} />
                <div className="py-12 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                        <img src={CheckIcon} alt={t.booking.page.bookingConfirmedHeadTitle} className="h-8 w-8" />
                    </div>
                    <h1 className="mb-4 text-2xl font-bold text-gray-900">{t.booking.page.bookingConfirmedTitle}</h1>
                    <p className="mb-2 text-gray-600">
                        {t.booking.page.bookingConfirmedMessage.replace('{service}', service?.name ?? t.booking.page.yourServiceFallback)}
                    </p>
                    {appointmentLabel && (
                        <p className="mb-2 text-gray-600">{t.booking.page.appointmentLine.replace('{appointment}', appointmentLabel)}</p>
                    )}
                    <p className="mb-6 text-gray-600">
                        {t.booking.page.confirmationSentTo} <strong>{state.customer.email}</strong>
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="https://luquetires.com/services/"
                            className="inline-flex items-center rounded-full bg-green-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                        >
                            {t.booking.page.backToServices}
                        </a>
                        <a
                            href="https://luquetires.com"
                            className="inline-flex items-center rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            {t.booking.page.goHome}
                        </a>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout boxed={true} backgroundColorClass="bg-gray-200" contentBackgroundClass="bg-white" background={heroBackground} showFooter={true}>
            <Head title={`Book ${service?.name ?? 'Service'}`} />

            <BookingWizard currentStep={currentStep} onStepChange={setCurrentStep} onComplete={handleSubmit} canProceed={canProceed}>
                <div>
                    {serviceLoading ? (
                        <div className="mb-6 bg-white px-6 py-10 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:mb-10 sm:px-12">
                            <div className="py-12 text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-700 border-r-transparent"></div>
                                <p className="mt-4 text-gray-600">{t.booking.serviceSelection.loadingServiceDetails}</p>
                            </div>
                        </div>
                    ) : service ? (
                        <ServicePreview service={service} className="mb-6 sm:mb-10" />
                    ) : null}

                    <div className="mt-8 mb-0 px-0 sm:mt-25 sm:mb-6 sm:px-0">
                        <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">{t.booking.serviceSelection.title}</h2>
                        {servicesLoading ? (
                            <div className="py-12 text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-700 border-r-transparent"></div>
                                <p className="mt-4 text-gray-600">{t.booking.serviceSelection.loadingServices}</p>
                            </div>
                        ) : (
                            <ServicesCards
                                selectedServiceIds={selectedServiceIds}
                                onServiceSelect={(serviceId: string) => {
                                    setSelectedServiceIds((prev) => {
                                        if (prev.includes(serviceId)) {
                                            return prev.filter((id) => id !== serviceId);
                                        }
                                        return [...prev, serviceId];
                                    });
                                }}
                            />
                        )}
                    </div>
                </div>

                <AppointmentStep
                    appointment={state.appointment}
                    onChange={(appointment) => setState((prev) => ({ ...prev, appointment }))}
                    selectedServiceIds={allServiceIds}
                />
                <VehicleInfoForm
                    vehicle={state.vehicle}
                    onChange={(vehicle) => setState({ ...state, vehicle })}
                    showTireSize={service ? serviceNeedsTireSize(service) : false}
                    errors={vehicleErrors}
                />
                <ServiceDetailsStep
                    services={dbServices.filter((s) => selectedServiceIds.includes(s.id.toString()))}
                    state={state}
                    onChange={setState}
                />
                <CustomerInfoForm customer={state.customer} onChange={(customer) => setState({ ...state, customer })} errors={customerErrors} />
                <ReviewStep
                    service={service!}
                    state={state}
                    selectedServices={dbServices.filter((s) => selectedServiceIds.includes(s.id.toString()))}
                />
            </BookingWizard>

            {submitError && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700 md:mt-4">
                    <p>{submitError}</p>
                </div>
            )}
        </Layout>
    );
}
