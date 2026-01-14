import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import firstServiceImage from '../../images/FIRST.jpg';
import heroBackgroundImage from '../../images/first_section.png';
import secondServiceImage from '../../images/SECONDE.jpg';
import CheckIcon from '../../images/svg/check.svg';

import AppointmentDatePicker from '../components/booking/AppointmentDatePicker';
import BookingWizard from '../components/booking/BookingWizard';
import Layout from '../components/layout/Layout';
import ServicePreview from '../components/services/ServicePreview';
import ServicesCards from '../components/services/ServicesCards';
import { Checkbox, Input, RadioGroup, Select, TextArea } from '../components/ui';
import { getServiceBySlug, isBrakeService, isOilService, isRepairService, isTireService, type ServiceConfig } from '../config/services';
import { useService } from '../hooks/useService';
import { useServices } from '../hooks/useServices';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type VehicleType = 'car' | 'light-truck' | 'truck' | 'motorcycle' | 'van' | 'other';

interface VehicleInfo {
    vehicleType: VehicleType | '';
    make: string;
    model: string;
    year: string;
    tireSize: string;
    vin: string;
    notes: string;
}

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

interface TireOptions {
    newOrUsed: 'new' | 'used' | '';
    numberOfTires: number;
    tpms: boolean;
    alignment: boolean;
    flatRepair: boolean;
}

interface OilOptions {
    oilType: 'conventional' | 'synthetic' | '';
    lastChangeDate: string;
}

interface BrakeOptions {
    position: 'front' | 'rear' | 'both' | '';
    noiseOrVibration: boolean;
    warningLight: boolean;
}

interface RepairOptions {
    problemDescription: string;
    drivable: 'yes' | 'no' | '';
    photos: File[];
}

interface AppointmentInfo {
    date: string;
    time: string;
}

interface CustomerInfo {
    fullName: string;
    phone: string;
    email: string;
    smsUpdates: boolean;
}

interface BookingState {
    vehicle: VehicleInfo;
    tireOptions: TireOptions;
    oilOptions: OilOptions;
    brakeOptions: BrakeOptions;
    repairOptions: RepairOptions;
    appointment: AppointmentInfo;
    customer: CustomerInfo;
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

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
    { value: 'car', label: 'Cars' },
    { value: 'light-truck', label: 'Light Trucks / SUVs' },
    { value: 'truck', label: 'Trucks' },
    { value: 'motorcycle', label: 'Motorcycles & Scooters' },
    { value: 'van', label: 'Vans & Minivans' },
    { value: 'other', label: 'Other' },
];

const VEHICLE_BRANDS: { value: string; label: string }[] = [
    'Acura',
    'Alfa Romeo',
    'Audi',
    'BMW',
    'Buick',
    'Cadillac',
    'Chevrolet',
    'Chrysler',
    'Dodge',
    'Ferrari',
    'Fiat',
    'Ford',
    'GMC',
    'Genesis',
    'Honda',
    'Hyundai',
    'Infiniti',
    'Jaguar',
    'Jeep',
    'Kia',
    'Lamborghini',
    'Land Rover',
    'Lexus',
    'Lincoln',
    'Maserati',
    'Mazda',
    'McLaren',
    'Mercedes-Benz',
    'Mini',
    'Mitsubishi',
    'Nissan',
    'Porsche',
    'Ram',
    'Subaru',
    'Tesla',
    'Toyota',
    'Volkswagen',
    'Volvo',
].map((brand) => ({ value: brand, label: brand }));

const TIRE_SIZES: string[] = [
    '175/65R15',
    '185/65R15',
    '195/65R15',
    '205/55R16',
    '215/55R17',
    '225/65R17',
    '235/60R18',
    '245/60R18',
    '255/55R19',
    '265/70R17',
    'Other',
];

const initialState: BookingState = {
    vehicle: {
        vehicleType: '',
        make: '',
        model: '',
        year: '',
        tireSize: '',
        vin: '',
        notes: '',
    },
    tireOptions: {
        newOrUsed: '',
        numberOfTires: 4,
        tpms: false,
        alignment: false,
        flatRepair: false,
    },
    oilOptions: {
        oilType: '',
        lastChangeDate: '',
    },
    brakeOptions: {
        position: '',
        noiseOrVibration: false,
        warningLight: false,
    },
    repairOptions: {
        problemDescription: '',
        drivable: '',
        photos: [],
    },
    appointment: {
        date: '',
        time: '',
    },
    customer: {
        fullName: '',
        phone: '',
        email: '',
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

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

// Step Components
// ─────────────────────────────────────────────────────────────────────────────

function Step2VehicleInfo({
    vehicle,
    onChange,
    showTireSize,
}: {
    vehicle: VehicleInfo;
    onChange: (vehicle: VehicleInfo) => void;
    showTireSize: boolean;
}) {
    const [useCustomBrand, setUseCustomBrand] = useState(() => {
        if (!vehicle.make) return false;
        return !VEHICLE_BRANDS.some((brand) => brand.value === vehicle.make);
    });

    const updateField = <K extends keyof VehicleInfo>(field: K, value: VehicleInfo[K]) => {
        onChange({ ...vehicle, [field]: value });
    };

    useEffect(() => {
        if (!vehicle.make) {
            setUseCustomBrand(false);
            return;
        }

        const matchesPredefined = VEHICLE_BRANDS.some((brand) => brand.value === vehicle.make);
        setUseCustomBrand(!matchesPredefined);
    }, [vehicle.make]);

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const range = Array.from({ length: 45 }, (_, i) => currentYear - i);

        return [
            { value: '', label: 'Select model year' },
            { value: String(currentYear), label: `${currentYear} (Current Year)` },
            ...range.slice(1).map((year) => ({ value: String(year), label: String(year) })),
            { value: 'pre-1980', label: '1979 or Older' },
        ];
    }, []);

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Vehicle Type" required>
                    <Select
                        value={vehicle.vehicleType}
                        onChange={(v) => updateField('vehicleType', v as VehicleType)}
                        options={VEHICLE_TYPES}
                        placeholder="Select vehicle type"
                        required
                    />
                </FormField>

                <FormField label="Vehicle Brand" required>
                    <Select
                        value={useCustomBrand ? '__custom' : vehicle.make}
                        onChange={(v) => {
                            if (v === '__custom') {
                                setUseCustomBrand(true);
                                updateField('make', '');
                                return;
                            }
                            setUseCustomBrand(false);
                            updateField('make', v);
                        }}
                        options={[...VEHICLE_BRANDS, { value: '__custom', label: 'Other / Not Listed' }]}
                        placeholder="Select brand"
                        required
                    />
                    {useCustomBrand && (
                        <Input className="mt-2" value={vehicle.make} onChange={(v) => updateField('make', v)} placeholder="Enter brand" required />
                    )}
                </FormField>

                <FormField label="Vehicle Model" required>
                    <Input value={vehicle.model} onChange={(v) => updateField('model', v)} placeholder="e.g., Camry, F-150, Civic" required />
                </FormField>

                <FormField label="Year" required>
                    <Select value={vehicle.year} onChange={(v) => updateField('year', v)} options={yearOptions} required />
                </FormField>

                {showTireSize && (
                    <FormField label="Tire Size" required>
                        <Select
                            value={vehicle.tireSize}
                            onChange={(v) => updateField('tireSize', v)}
                            options={TIRE_SIZES.map((size) => ({ value: size, label: size }))}
                            placeholder="Select tire size"
                            required
                        />
                    </FormField>
                )}

                <FormField label="VIN (Optional)">
                    <Input value={vehicle.vin} onChange={(v) => updateField('vin', v)} placeholder="17-character VIN" />
                </FormField>
            </div>

            <FormField label="Additional Notes (Optional)">
                <TextArea
                    value={vehicle.notes}
                    onChange={(v) => updateField('notes', v)}
                    placeholder="Any additional information about your vehicle..."
                    rows={3}
                />
            </FormField>
        </div>
    );
}

function Step3TireOptions({ options, onChange }: { options: TireOptions; onChange: (options: TireOptions) => void }) {
    const updateField = <K extends keyof TireOptions>(field: K, value: TireOptions[K]) => {
        onChange({ ...options, [field]: value });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Tire Service Details</h3>

            <FormField label="New or Used Tires" required>
                <RadioGroup
                    name="newOrUsed"
                    value={options.newOrUsed}
                    onChange={(v) => updateField('newOrUsed', v as 'new' | 'used')}
                    options={[
                        { value: 'new', label: 'New Tires' },
                        { value: 'used', label: 'Used Tires' },
                    ]}
                />
            </FormField>

            <FormField label="Number of Tires" required>
                <Select
                    value={String(options.numberOfTires)}
                    onChange={(v) => updateField('numberOfTires', Number(v))}
                    options={[
                        { value: '1', label: '1 Tire' },
                        { value: '2', label: '2 Tires' },
                        { value: '3', label: '3 Tires' },
                        { value: '4', label: '4 Tires' },
                        { value: '5', label: '5 Tires (includes spare)' },
                    ]}
                />
            </FormField>

            <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Additional Services</p>
                <div className="space-y-2">
                    <Checkbox checked={options.tpms} onChange={(v) => updateField('tpms', v)} label="TPMS Sensor Service ($85 per sensor)" />
                    <Checkbox checked={options.alignment} onChange={(v) => updateField('alignment', v)} label="Wheel Alignment ($120)" />
                    <Checkbox checked={options.flatRepair} onChange={(v) => updateField('flatRepair', v)} label="Flat Repair (if applicable)" />
                </div>
            </div>
        </div>
    );
}

function Step3OilOptions({ options, onChange }: { options: OilOptions; onChange: (options: OilOptions) => void }) {
    const updateField = <K extends keyof OilOptions>(field: K, value: OilOptions[K]) => {
        onChange({ ...options, [field]: value });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Oil Change Details</h3>

            <FormField label="Oil Type" required>
                <RadioGroup
                    name="oilType"
                    value={options.oilType}
                    onChange={(v) => updateField('oilType', v as 'conventional' | 'synthetic')}
                    options={[
                        { value: 'conventional', label: 'Conventional Oil' },
                        { value: 'synthetic', label: 'Synthetic Oil' },
                    ]}
                />
            </FormField>

            <FormField label="Last Oil Change Date">
                <Input type="date" value={options.lastChangeDate} onChange={(v) => updateField('lastChangeDate', v)} />
            </FormField>
        </div>
    );
}

function Step3BrakeOptions({ options, onChange }: { options: BrakeOptions; onChange: (options: BrakeOptions) => void }) {
    const updateField = <K extends keyof BrakeOptions>(field: K, value: BrakeOptions[K]) => {
        onChange({ ...options, [field]: value });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Brake Service Details</h3>

            <FormField label="Which Brakes Need Service?" required>
                <RadioGroup
                    name="brakePosition"
                    value={options.position}
                    onChange={(v) => updateField('position', v as 'front' | 'rear' | 'both')}
                    options={[
                        { value: 'front', label: 'Front Brakes' },
                        { value: 'rear', label: 'Rear Brakes' },
                        { value: 'both', label: 'Both Front & Rear' },
                    ]}
                />
            </FormField>

            <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Symptoms</p>
                <div className="space-y-2">
                    <Checkbox
                        checked={options.noiseOrVibration}
                        onChange={(v) => updateField('noiseOrVibration', v)}
                        label="Noise or vibration when braking"
                    />
                    <Checkbox checked={options.warningLight} onChange={(v) => updateField('warningLight', v)} label="Brake warning light is on" />
                </div>
            </div>
        </div>
    );
}

function Step3RepairOptions({ options, onChange }: { options: RepairOptions; onChange: (options: RepairOptions) => void }) {
    const updateField = <K extends keyof RepairOptions>(field: K, value: RepairOptions[K]) => {
        onChange({ ...options, [field]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            updateField('photos', Array.from(e.target.files));
        }
    };

    return (
        <div className="space-y-6">
            <FormField label="Describe the Problem" required>
                <TextArea
                    value={options.problemDescription}
                    onChange={(v) => updateField('problemDescription', v)}
                    placeholder="Please describe the issue you're experiencing with your vehicle..."
                    rows={4}
                />
            </FormField>

            <FormField label="Is the Vehicle Drivable?" required>
                <RadioGroup
                    name="drivable"
                    value={options.drivable}
                    onChange={(v) => updateField('drivable', v as 'yes' | 'no')}
                    options={[
                        { value: 'yes', label: 'Yes, it can be driven' },
                        { value: 'no', label: 'No, it needs towing' },
                    ]}
                />
            </FormField>
        </div>
    );
}

// Helper to check if service has specific required fields from database
function serviceHasField(service: ServiceConfig, fieldName: string): boolean {
    return Array.isArray(service.requiredFields) && service.requiredFields.includes(fieldName as any);
}

// Check if service has any tire-related fields
function hasTireFields(service: ServiceConfig): boolean {
    return (
        serviceHasField(service, 'tire_condition') ||
        serviceHasField(service, 'number_of_tires') ||
        serviceHasField(service, 'tpms_service') ||
        serviceHasField(service, 'alignment_service') ||
        serviceHasField(service, 'wheel_type') ||
        isTireService(service)
    );
}

// Check if service has any oil-related fields
function hasOilFields(service: ServiceConfig): boolean {
    return serviceHasField(service, 'oil_type') || serviceHasField(service, 'last_change_date') || isOilService(service);
}

// Check if service has any brake-related fields
function hasBrakeFields(service: ServiceConfig): boolean {
    return (
        serviceHasField(service, 'brake_position') ||
        serviceHasField(service, 'noise_or_vibration') ||
        serviceHasField(service, 'warning_light') ||
        isBrakeService(service)
    );
}

// Check if service has any repair-related fields
function hasRepairFields(service: ServiceConfig): boolean {
    return (
        serviceHasField(service, 'problem_description') ||
        serviceHasField(service, 'vehicle_drivable') ||
        serviceHasField(service, 'photo_paths') ||
        isRepairService(service)
    );
}

// Check if service has any required fields at all
function hasAnyRequiredFields(service: ServiceConfig): boolean {
    return hasTireFields(service) || hasOilFields(service) || hasBrakeFields(service) || hasRepairFields(service);
}

function Step3ServiceDetails({
    services,
    state,
    onChange,
}: {
    services: ServiceConfig[];
    state: BookingState;
    onChange: (state: BookingState) => void;
}) {
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
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-bold text-gray-900">Service Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Complete the details for your {services.length} selected service{services.length > 1 ? 's' : ''}
                </p>
            </div>

            {/* Service Cards */}
            <div className="space-y-4">
                {services.map((service) => {
                    const hasOptions = hasAnyRequiredFields(service);

                    return (
                        <div
                            key={service.id}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                        >
                            {/* Service Header */}
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

                            {/* Service Options */}
                            <div className="p-5">
                                {hasTireFields(service) && (
                                    <Step3TireOptions options={state.tireOptions} onChange={(tireOptions) => onChange({ ...state, tireOptions })} />
                                )}

                                {hasOilFields(service) && (
                                    <Step3OilOptions options={state.oilOptions} onChange={(oilOptions) => onChange({ ...state, oilOptions })} />
                                )}

                                {hasBrakeFields(service) && (
                                    <Step3BrakeOptions
                                        options={state.brakeOptions}
                                        onChange={(brakeOptions) => onChange({ ...state, brakeOptions })}
                                    />
                                )}

                                {hasRepairFields(service) && (
                                    <Step3RepairOptions
                                        options={state.repairOptions}
                                        onChange={(repairOptions) => onChange({ ...state, repairOptions })}
                                    />
                                )}

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

function Step4Appointment({ appointment, onChange }: { appointment: AppointmentInfo; onChange: (appointment: AppointmentInfo) => void }) {
    const handleDateChange = useCallback(
        (date: string) => {
            onChange({ ...appointment, date });
        },
        [appointment, onChange],
    );

    const handleTimeChange = useCallback(
        (time: string) => {
            onChange({ ...appointment, time });
        },
        [appointment, onChange],
    );

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Appointment Date</h3>
            <AppointmentDatePicker
                selectedDate={appointment.date}
                selectedTime={appointment.time}
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
            />
        </div>
    );
}

function Step5CustomerInfo({ customer, onChange }: { customer: CustomerInfo; onChange: (customer: CustomerInfo) => void }) {
    const updateField = <K extends keyof CustomerInfo>(field: K, value: CustomerInfo[K]) => {
        onChange({ ...customer, [field]: value });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Full Name" required>
                    <Input value={customer.fullName} onChange={(v) => updateField('fullName', v)} placeholder="John Doe" required />
                </FormField>

                <FormField label="Phone Number" required>
                    <Input type="tel" value={customer.phone} onChange={(v) => updateField('phone', v)} placeholder="(555) 123-4567" required />
                </FormField>

                <FormField label="Email Address" required>
                    <Input type="email" value={customer.email} onChange={(v) => updateField('email', v)} placeholder="john@example.com" required />
                </FormField>
            </div>

            <Checkbox checked={customer.smsUpdates} onChange={(v) => updateField('smsUpdates', v)} label="Send me SMS updates about my appointment" />
        </div>
    );
}

function Step6Review({ service, state }: { service: ServiceConfig; state: BookingState }) {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Not selected';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Booking</h3>

            <div className="space-y-4">
                {/* Service */}
                <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-2 font-semibold text-gray-900">Service</h4>
                    <p className="text-gray-700">{service.name}</p>
                    <p className="text-sm text-gray-500">{service.estimatedDuration}</p>
                </div>

                {/* Vehicle */}
                <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-2 font-semibold text-gray-900">Vehicle</h4>
                    <p className="text-gray-700">
                        {state.vehicle.year} {state.vehicle.make} {state.vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{state.vehicle.vehicleType}</p>
                    {state.vehicle.tireSize && <p className="text-sm text-gray-500">Tire Size: {state.vehicle.tireSize}</p>}
                </div>

                {/* Service Options */}
                {isTireService(service) && state.tireOptions.newOrUsed && (
                    <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="mb-2 font-semibold text-gray-900">Tire Options</h4>
                        <p className="text-gray-700 capitalize">{state.tireOptions.newOrUsed} Tires</p>
                        <p className="text-sm text-gray-500">{state.tireOptions.numberOfTires} tire(s)</p>
                        {state.tireOptions.tpms && <p className="text-sm text-gray-500">+ TPMS Service</p>}
                        {state.tireOptions.alignment && <p className="text-sm text-gray-500">+ Wheel Alignment</p>}
                    </div>
                )}

                {isOilService(service) && state.oilOptions.oilType && (
                    <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="mb-2 font-semibold text-gray-900">Oil Change Options</h4>
                        <p className="text-gray-700 capitalize">{state.oilOptions.oilType} Oil</p>
                    </div>
                )}

                {isBrakeService(service) && state.brakeOptions.position && (
                    <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="mb-2 font-semibold text-gray-900">Brake Service Options</h4>
                        <p className="text-gray-700 capitalize">{state.brakeOptions.position} Brakes</p>
                        {state.brakeOptions.noiseOrVibration && <p className="text-sm text-gray-500">Noise/vibration reported</p>}
                        {state.brakeOptions.warningLight && <p className="text-sm text-gray-500">Warning light on</p>}
                    </div>
                )}

                {isRepairService(service) && state.repairOptions.problemDescription && (
                    <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="mb-2 font-semibold text-gray-900">Repair Details</h4>
                        <p className="text-gray-700">{state.repairOptions.problemDescription}</p>
                        <p className="text-sm text-gray-500">Vehicle is {state.repairOptions.drivable === 'yes' ? 'drivable' : 'not drivable'}</p>
                    </div>
                )}

                {/* Appointment */}
                <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-2 font-semibold text-gray-900">Appointment</h4>
                    <p className="text-gray-700">{formatDate(state.appointment.date)}</p>
                    <p className="text-sm text-gray-500">{state.appointment.time || 'Time not selected'}</p>
                </div>

                {/* Customer */}
                <div className="rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-2 font-semibold text-gray-900">Contact Information</h4>
                    <p className="text-gray-700">{state.customer.fullName}</p>
                    <p className="text-sm text-gray-500">{state.customer.phone}</p>
                    <p className="text-sm text-gray-500">{state.customer.email}</p>
                    {state.customer.smsUpdates && <p className="mt-1 text-xs text-green-600">SMS updates enabled</p>}
                </div>
            </div>
        </div>
    );
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
            className="h-[320px] w-full bg-cover bg-center bg-no-repeat opacity-90"
            style={{
                backgroundImage: `linear-gradient(180deg, rgba(5,5,5,0.92), rgba(5,5,5,0.85)), url(${heroBackgroundImage})`,
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
                const v = state.vehicle;
                const baseValid = v.vehicleType && v.make && v.model && v.year;
                if (service && isTireService(service)) {
                    return !!(baseValid && v.tireSize);
                }
                return !!baseValid;
            case 4:
                // Service Details
                if (!service) return false;
                if (isTireService(service)) {
                    return !!state.tireOptions.newOrUsed;
                }
                if (isOilService(service)) {
                    return !!state.oilOptions.oilType;
                }
                if (isBrakeService(service)) {
                    return !!state.brakeOptions.position;
                }
                if (isRepairService(service)) {
                    return !!(state.repairOptions.problemDescription && state.repairOptions.drivable);
                }
                return true;
            case 5:
                // Customer Info
                const c = state.customer;
                const emailValid = c.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email);
                return !!(c.fullName && c.phone && emailValid);
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

        setIsSubmitting(true);
        setSubmitError(null);

        // Combine the main service with any additional selected services
        // Ensure IDs are numbers for the backend validation
        const mainServiceId = typeof service.id === 'string' ? parseInt(service.id, 10) : service.id;
        const allServiceIds = [
            mainServiceId,
            ...selectedServiceIds
                .filter((id) => id !== service.id.toString() && id !== service.id)
                .map((id) => (typeof id === 'string' ? parseInt(id, 10) : id)),
        ].filter((id) => !isNaN(id));

        const payload = {
            service_ids: allServiceIds,
            vehicle: {
                type: state.vehicle.vehicleType,
                make: state.vehicle.make,
                model: state.vehicle.model,
                year: state.vehicle.year,
                tire_size: state.vehicle.tireSize || null,
                vin: state.vehicle.vin || null,
                notes: state.vehicle.notes || null,
            },
            service_options: {
                tire_options: isTireService(service) ? state.tireOptions : null,
                oil_options: isOilService(service) ? state.oilOptions : null,
                brake_options: isBrakeService(service) ? state.brakeOptions : null,
                repair_options: isRepairService(service)
                    ? {
                          problem_description: state.repairOptions.problemDescription,
                          drivable: state.repairOptions.drivable,
                          has_photos: state.repairOptions.photos.length > 0,
                      }
                    : null,
            },
            date: state.appointment.date,
            time: state.appointment.time,
            customer: {
                full_name: state.customer.fullName,
                phone: state.customer.phone,
                email: state.customer.email,
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
            <Layout boxed={true} backgroundColorClass="bg-[#f5f5f5f5]" contentBackgroundClass="bg-white" background={heroBackground}>
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

    // Success state
    if (submitSuccess) {
        return (
            <Layout boxed={true} backgroundColorClass="bg-[#f5f5f5f5]" contentBackgroundClass="bg-[#f5f5f5f5]" background={heroBackground}>
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
        <Layout boxed={true} backgroundColorClass="bg-[#f5f5f5f5]" contentBackgroundClass="bg-white" background={heroBackground}>
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
                        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">Select Services</h2>
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

                <Step4Appointment appointment={state.appointment} onChange={(appointment) => setState((prev) => ({ ...prev, appointment }))} />
                <Step2VehicleInfo
                    vehicle={state.vehicle}
                    onChange={(vehicle) => setState({ ...state, vehicle })}
                    showTireSize={isTireService(service)}
                />
                <Step3ServiceDetails
                    services={dbServices.filter((s) => selectedServiceIds.includes(s.id.toString()))}
                    state={state}
                    onChange={setState}
                />
                <Step5CustomerInfo customer={state.customer} onChange={(customer) => setState({ ...state, customer })} />
                <Step6Review service={service} state={state} />
            </BookingWizard>

            {submitError && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
                    <p>{submitError}</p>
                </div>
            )}
        </Layout>
    );
}
