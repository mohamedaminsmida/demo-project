import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import firstServiceImage from '../../images/FIRST.jpg';
import heroBackgroundImage from '../../images/first_section.png';
import secondServiceImage from '../../images/SECONDE.jpg';
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
import { getServiceBySlug, type ServiceCategory, type ServiceConfig } from '../config/services';
import { useService } from '../hooks/useService';
import { useServices } from '../hooks/useServices';
import type { BookingState, CustomerInfo } from '../types/booking';
import type { VehicleInfo } from '../types/vehicle';
import { getRequirementValue, getServiceRequirements, isRequirementValueEmpty } from '../utils/bookingRequirements';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ServicePreviewFeature {
    label: string;
    description?: string;
    highlighted?: boolean;
}

interface ServicePreviewData {
    title: string;
    subtitle?: string;
    features: ServicePreviewFeature[];
    price?: number;
}

function buildServicePreview(service: ServiceConfig): ServicePreviewData {
    const baseFeatures = [
        { label: 'Professional technicians', description: 'Factory-trained and certified', highlighted: true },
        { label: 'Same-day availability', description: 'Flexible appointment windows' },
        { label: 'Transparent pricing', description: 'No surprise fees' },
    ];

    if (service.category === 'tires') {
        return {
            title: `${service.name} Package`,
            subtitle: 'Tires & Wheels',
            features: [
                { label: 'Mount & balance included', highlighted: true },
                { label: 'TPMS inspection', description: 'Sensor diagnostics' },
                { label: 'Alignment check', description: 'Recommended for new tires' },
            ],
            price: service.basePrice,
        };
    }

    if (service.category === 'maintenance') {
        return {
            title: `${service.name} Essentials`,
            subtitle: 'Maintenance',
            features: [
                { label: 'OEM-grade fluids & parts', highlighted: true },
                { label: 'Multi-point inspection', description: 'Complimentary report' },
                { label: 'Service reminders', description: 'Text/email updates' },
            ],
            price: service.basePrice,
        };
    }

    return {
        title: `${service.name} Diagnostics`,
        subtitle: 'Repairs',
        features: baseFeatures,
        price: service.basePrice,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
    { id: 1, name: 'Service Summary' },
    { id: 2, name: 'Appointment' },
    { id: 3, name: 'Vehicle Info' },
    { id: 4, name: 'Service Details' },
    { id: 5, name: 'Customer Info' },
    { id: 6, name: 'Review & Submit' },
];

const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

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

// ─────────────────────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────────────────────

function StepIndicator({ currentStep, className = '' }: { currentStep: number; className?: string }) {
    return (
        <div className={`flex items-start justify-between ${className}`}>
            {STEPS.map((step, index) => (
                <div key={step.id} className="flex flex-1 flex-col items-center gap-3">
                    <div className="flex w-full items-center justify-center">
                        {index > 0 && <div className={`h-1 flex-1 rounded-full ${currentStep > step.id ? 'bg-green-800' : 'bg-gray-200'}`} />}
                        <div className="mx-2 flex-shrink-0">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold transition-colors ${
                                    currentStep >= step.id ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                {currentStep > step.id ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    step.id
                                )}
                            </div>
                        </div>
                        {index < STEPS.length - 1 && (
                            <div className={`h-1 flex-1 rounded-full ${currentStep > step.id ? 'bg-green-800' : 'bg-gray-200'}`} />
                        )}
                    </div>
                    <span className={`text-center text-sm font-medium ${currentStep >= step.id ? 'text-green-800' : 'text-gray-400'}`}>
                        {step.name}
                    </span>
                </div>
            ))}
        </div>
    );
}

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

    // Get service slug from URL if not passed as prop
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const slug = serviceSlug || urlParams.get('service') || '';

    // Fetch the selected service from database
    const { service: dbService, loading: serviceLoading } = useService(slug);

    // Fallback to static config if database service not loaded yet
    const service = dbService || getServiceBySlug(slug);

    const [currentStep, setCurrentStep] = useState(1);
    const [state, setState] = useState<BookingState>(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
    const [vehicleErrors, setVehicleErrors] = useState<Partial<Record<keyof VehicleInfo, string>>>({});
    const [customerErrors, setCustomerErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

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

    // Pre-select service from URL query parameter when services are loaded
    useEffect(() => {
        if (!servicesLoading && dbServices.length > 0 && slug) {
            // Find the service that matches the slug from URL
            const matchingService = dbServices.find((s) => s.slug === slug || s.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase());
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
    }, [servicesLoading, dbServices, slug]);

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
                // Service Summary
                return true;
            case 2:
                // Appointment
                return !!(state.appointment.date && state.appointment.time);
            case 3:
                // Vehicle Info
                return Object.keys(validateVehicleInfo(state.vehicle, serviceNeedsTireSize(service))).length === 0;
            case 4:
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
            case 5:
                // Customer Info
                return Object.keys(validateCustomerInfo(state.customer)).length === 0;
            case 6:
                // Review & Submit
                return true;
            default:
                return false;
        }
    }, [currentStep, state, service]);

    const handleNext = () => {
        if (currentStep < 6 && canProceed()) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!service) return;

        const nextVehicleErrors = validateVehicleInfo(state.vehicle, serviceNeedsTireSize(service));
        if (Object.keys(nextVehicleErrors).length > 0) {
            setVehicleErrors(nextVehicleErrors);
            setCurrentStep(3);
            setSubmitError('Please correct the highlighted vehicle details before submitting.');
            return;
        }

        const normalizedOtherType = state.vehicle.vehicleType === 'other' ? String(state.vehicle.otherType ?? '').trim() : null;
        if (state.vehicle.vehicleType === 'other' && (!normalizedOtherType || normalizedOtherType.length < 2)) {
            setVehicleErrors({ otherType: 'Vehicle type must be between 2 and 50 characters.' });
            setCurrentStep(3);
            setSubmitError('Please correct the highlighted vehicle details before submitting.');
            return;
        }

        const nextCustomerErrors = validateCustomerInfo(state.customer);
        if (Object.keys(nextCustomerErrors).length > 0) {
            setCustomerErrors(nextCustomerErrors);
            setCurrentStep(5);
            setSubmitError('Please correct the highlighted contact details before submitting.');
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

        console.log('Submitting appointment with payload:', payload);
        console.log('Appointment state:', state.appointment);

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
            setSubmitError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Service not found
    if (!service) {
        return (
            <Layout boxed={true} backgroundColorClass="bg-gray-300" contentBackgroundClass="bg-white" background={heroBackground} showFooter={false}>
                <Head title="Book Service" />
                <div className="py-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900">Service Not Found</h1>
                    <p className="mb-6 text-gray-600">The requested service could not be found. Please select a service from our services page.</p>
                    <a
                        href="/services"
                        className="inline-flex items-center rounded-full bg-green-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                        View Services
                    </a>
                </div>
            </Layout>
        );
    }

    // Loading state - show full-screen loader while submitting
    if (isSubmitting) {
        return (
            <Layout boxed={true} backgroundColorClass="bg-gray-300" contentBackgroundClass="bg-white" background={heroBackground} showFooter={false}>
                <Head title="Submitting..." />
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="rounded-2xl bg-white p-8 shadow-2xl">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"></div>
                            <p className="text-lg font-semibold text-gray-900">Submitting your Appointment...</p>
                            <p className="text-sm text-gray-500">Please wait while we process your request</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // Success state
    if (submitSuccess) {
        return (
            <Layout
                boxed={true}
                backgroundColorClass="bg-gray-400"
                contentBackgroundClass="bg-[#f5f5f5f5]"
                background={heroBackground}
                showFooter={false}
            >
                <Head title="Booking Confirmed" />
                <div className="py-12 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                        <img src={CheckIcon} alt="Booking confirmed" className="h-8 w-8" />
                    </div>
                    <h1 className="mb-4 text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
                    <p className="mb-2 text-gray-600">
                        Your appointment for <strong>{service.name}</strong> has been scheduled.
                    </p>
                    <p className="mb-6 text-gray-600">
                        We'll send a confirmation to <strong>{state.customer.email}</strong>
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="/services"
                            className="inline-flex items-center rounded-full bg-green-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                        >
                            Back to Services
                        </a>
                        <a
                            href="/"
                            className="inline-flex items-center rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            Go Home
                        </a>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout boxed={true} backgroundColorClass="bg-gray-200" contentBackgroundClass="bg-white" background={heroBackground} showFooter={false}>
            <Head title={`Book ${service.name}`} />

            <BookingWizard currentStep={currentStep} onStepChange={setCurrentStep} onComplete={handleSubmit} canProceed={canProceed}>
                <div>
                    {serviceLoading ? (
                        <div className="mb-10 bg-white px-6 py-10 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:px-12">
                            <div className="py-12 text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-700 border-r-transparent"></div>
                                <p className="mt-4 text-gray-600">Loading service details...</p>
                            </div>
                        </div>
                    ) : (
                        <ServicePreview service={service} className="mb-10" />
                    )}

                    <div className="mt-25 mb-6">
                        <h2 className="mb-6 text-center text-4xl font-bold text-gray-900">Select Services</h2>
                        {servicesLoading ? (
                            <div className="py-12 text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-700 border-r-transparent"></div>
                                <p className="mt-4 text-gray-600">Loading services...</p>
                            </div>
                        ) : (
                            <ServicesCards
                                services={dbServices.map((service, index) => ({
                                    id: service.id.toString(),
                                    title: service.name,
                                    description: service.description,
                                    backgroundImage: service.image || (index % 2 === 0 ? firstServiceImage : secondServiceImage),
                                    price: service.basePrice,
                                    category: service.category as ServiceCategory,
                                }))}
                                selectedServiceIds={selectedServiceIds}
                                onServiceSelect={(serviceId) => {
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
                    showTireSize={serviceNeedsTireSize(service)}
                    errors={vehicleErrors}
                />
                <ServiceDetailsStep
                    services={dbServices.filter((s) => selectedServiceIds.includes(s.id.toString()))}
                    state={state}
                    onChange={setState}
                />
                <CustomerInfoForm customer={state.customer} onChange={(customer) => setState({ ...state, customer })} errors={customerErrors} />
                <ReviewStep
                    service={service}
                    state={state}
                    selectedServices={dbServices.filter((s) => selectedServiceIds.includes(s.id.toString()))}
                />
            </BookingWizard>

            {submitError && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
                    <p>{submitError}</p>
                </div>
            )}
        </Layout>
    );
}
