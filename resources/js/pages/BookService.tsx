import { Head } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import firstServiceImage from '../../images/FIRST.jpg';
import heroBackgroundImage from '../../images/first_section.png';
import secondServiceImage from '../../images/SECONDE.jpg';

import BookingWizard from '../components/booking/BookingWizard';
import Layout from '../components/layout/Layout';
import ServicePreview from '../components/services/ServicePreview';
import ServicesCards from '../components/services/ServicesCards';
import { getServiceBySlug, isBrakeService, isOilService, isRepairService, isTireService, type ServiceConfig } from '../config/services';
import { useService } from '../hooks/useService';
import { useServices } from '../hooks/useServices';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type VehicleType = 'car' | 'suv' | 'truck' | 'van';

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
    { id: 2, name: 'Vehicle Info' },
    { id: 3, name: 'Service Details' },
    { id: 4, name: 'Appointment' },
    { id: 5, name: 'Customer Info' },
    { id: 6, name: 'Review & Submit' },
];

const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
    { value: 'car', label: 'Car' },
    { value: 'suv', label: 'SUV' },
    { value: 'truck', label: 'Truck' },
    { value: 'van', label: 'Van' },
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

function Input({
    type = 'text',
    value,
    onChange,
    placeholder,
    required,
    className = '',
}: {
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none ${className}`}
        />
    );
}

function Select({
    value,
    onChange,
    options,
    placeholder,
    required,
}: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
    return (
        <label className="flex cursor-pointer items-center gap-3">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}

function RadioGroup({
    value,
    onChange,
    options,
    name,
}: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    name: string;
}) {
    return (
        <div className="flex flex-wrap gap-4">
            {options.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                    <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
            ))}
        </div>
    );
}

function TextArea({
    value,
    onChange,
    placeholder,
    rows = 4,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
        />
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
    const updateField = <K extends keyof VehicleInfo>(field: K, value: VehicleInfo[K]) => {
        onChange({ ...vehicle, [field]: value });
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 40 }, (_, i) => ({
        value: String(currentYear - i),
        label: String(currentYear - i),
    }));

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

                <FormField label="Brand" required>
                    <Input value={vehicle.make} onChange={(v) => updateField('make', v)} placeholder="e.g., Toyota, Ford, Honda" required />
                </FormField>

                <FormField label="Model" required>
                    <Input value={vehicle.model} onChange={(v) => updateField('model', v)} placeholder="e.g., Camry, F-150, Civic" required />
                </FormField>

                <FormField label="Year" required>
                    <Select value={vehicle.year} onChange={(v) => updateField('year', v)} options={years} placeholder="Select year" required />
                </FormField>

                {showTireSize && (
                    <FormField label="Tire Size" required>
                        <Input value={vehicle.tireSize} onChange={(v) => updateField('tireSize', v)} placeholder="e.g., 225/65R17" required />
                    </FormField>
                )}

                <FormField label="VIN (Optional)">
                    <Input value={vehicle.vin} onChange={(v) => updateField('vin', v)} placeholder="17-character VIN" />
                </FormField>
            </div>

            <FormField label="Additional Notes">
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
            <h3 className="text-lg font-semibold text-gray-900">Repair Details</h3>

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

            <FormField label="Upload Photos (Optional)">
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100"
                    />
                    {options.photos.length > 0 && <p className="mt-2 text-sm text-gray-600">{options.photos.length} file(s) selected</p>}
                </div>
            </FormField>
        </div>
    );
}

function Step3ServiceDetails({ service, state, onChange }: { service: ServiceConfig; state: BookingState; onChange: (state: BookingState) => void }) {
    if (isTireService(service)) {
        return <Step3TireOptions options={state.tireOptions} onChange={(tireOptions) => onChange({ ...state, tireOptions })} />;
    }

    if (isOilService(service)) {
        return <Step3OilOptions options={state.oilOptions} onChange={(oilOptions) => onChange({ ...state, oilOptions })} />;
    }

    if (isBrakeService(service)) {
        return <Step3BrakeOptions options={state.brakeOptions} onChange={(brakeOptions) => onChange({ ...state, brakeOptions })} />;
    }

    if (isRepairService(service)) {
        return <Step3RepairOptions options={state.repairOptions} onChange={(repairOptions) => onChange({ ...state, repairOptions })} />;
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
            <p className="text-gray-600">No additional details required for this service.</p>
        </div>
    );
}

function Step4Appointment({ appointment, onChange }: { appointment: AppointmentInfo; onChange: (appointment: AppointmentInfo) => void }) {
    const updateField = <K extends keyof AppointmentInfo>(field: K, value: AppointmentInfo[K]) => {
        onChange({ ...appointment, [field]: value });
    };

    // Generate next 14 days for date selection
    const availableDates = useMemo(() => {
        const dates: { value: string; label: string }[] = [];
        const today = new Date();
        for (let i = 1; i <= 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            // Skip Sundays
            if (date.getDay() !== 0) {
                const value = date.toISOString().split('T')[0];
                const label = date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                });
                dates.push({ value, label });
            }
        }
        return dates;
    }, []);

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Select Appointment</h3>

            <FormField label="Preferred Date" required>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {availableDates.map((date) => (
                        <button
                            key={date.value}
                            type="button"
                            onClick={() => updateField('date', date.value)}
                            className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                                appointment.date === date.value
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                            }`}
                        >
                            {date.label}
                        </button>
                    ))}
                </div>
            </FormField>

            {appointment.date && (
                <FormField label="Preferred Time" required>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                        {TIME_SLOTS.map((time) => (
                            <button
                                key={time}
                                type="button"
                                onClick={() => updateField('time', time)}
                                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                                    appointment.time === time
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </FormField>
            )}
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
                return true;
            case 2:
                const v = state.vehicle;
                const baseValid = v.vehicleType && v.make && v.model && v.year;
                if (service && isTireService(service)) {
                    return !!(baseValid && v.tireSize);
                }
                return !!baseValid;
            case 3:
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
            case 4:
                return !!(state.appointment.date && state.appointment.time);
            case 5:
                const c = state.customer;
                return !!(c.fullName && c.phone && c.email);
            case 6:
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

        const payload = {
            service_id: service.id,
            vehicle: {
                type: state.vehicle.vehicleType,
                make: state.vehicle.make,
                model: state.vehicle.model,
                year: state.vehicle.year,
                tire_size: state.vehicle.tireSize || null,
                vin: state.vehicle.vin || null,
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
            notes: state.vehicle.notes || null,
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

            if (!response.ok) {
                throw new Error('Failed to submit appointment');
            }

            setSubmitSuccess(true);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Service not found
    if (!service) {
        return (
            <Layout boxed={true} backgroundColorClass="bg-[#f5f5f5f5]" background={heroBackground}>
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
            <Layout boxed={true} backgroundColorClass="bg-[#f5f5f5f5]" background={heroBackground}>
                <Head title="Booking Confirmed" />
                <div className="py-12 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
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
        <Layout boxed={true} backgroundColorClass="bg-[#f5f5f5f5]" background={heroBackground}>
            <Head title={`Book ${service.name}`} />

            <BookingWizard currentStep={currentStep} onStepChange={setCurrentStep} onComplete={handleSubmit}>
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

                <Step2VehicleInfo
                    vehicle={state.vehicle}
                    onChange={(vehicle) => setState({ ...state, vehicle })}
                    showTireSize={isTireService(service)}
                />
                <Step3ServiceDetails service={service} state={state} onChange={setState} />
                <Step4Appointment appointment={state.appointment} onChange={(appointment) => setState({ ...state, appointment })} />
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
