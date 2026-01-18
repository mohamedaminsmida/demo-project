import { useEffect, useMemo, useState } from 'react';

import { FormField, Input, Select, TextArea } from '../../components/ui';
import type { VehicleInfo, VehicleType } from '../../types/vehicle';

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

interface VehicleInfoFormProps {
    vehicle: VehicleInfo;
    onChange: (vehicle: VehicleInfo) => void;
    showTireSize: boolean;
    errors?: Partial<Record<keyof VehicleInfo, string>>;
}

export default function VehicleInfoForm({ vehicle, onChange, showTireSize, errors }: VehicleInfoFormProps) {
    const [useCustomBrand, setUseCustomBrand] = useState(() => {
        if (!vehicle.make) return false;
        return !VEHICLE_BRANDS.some((brand) => brand.value === vehicle.make);
    });
    const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof VehicleInfo, boolean>>>({});

    const updateField = <K extends keyof VehicleInfo>(field: K, value: VehicleInfo[K]) => {
        onChange({ ...vehicle, [field]: value });
    };

    const markTouched = <K extends keyof VehicleInfo>(field: K) => {
        setTouchedFields((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
    };

    const fieldError = <K extends keyof VehicleInfo>(field: K) => {
        if (!errors?.[field]) {
            return undefined;
        }

        return touchedFields[field] ? errors[field] : undefined;
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
                        onChange={(v) => {
                            const nextType = v as VehicleType;
                            if (nextType !== 'other' && vehicle.otherType) {
                                updateField('otherType', '');
                            }
                            updateField('vehicleType', nextType);
                            markTouched('vehicleType');
                        }}
                        options={VEHICLE_TYPES}
                        placeholder="Select vehicle type"
                        error={fieldError('vehicleType')}
                        required
                    />
                </FormField>

                {vehicle.vehicleType === 'other' && (
                    <FormField label="Other Vehicle Type" required>
                        <Input
                            value={vehicle.otherType}
                            onChange={(v) => {
                                updateField('otherType', v);
                                markTouched('otherType');
                            }}
                            placeholder="Describe the vehicle type"
                            error={fieldError('otherType')}
                            required
                        />
                    </FormField>
                )}

                <FormField label="Vehicle Make" required>
                    <Select
                        value={useCustomBrand ? '__custom' : vehicle.make}
                        onChange={(v) => {
                            if (v === '__custom') {
                                setUseCustomBrand(true);
                                updateField('make', '');
                                markTouched('make');
                                return;
                            }
                            setUseCustomBrand(false);
                            updateField('make', v);
                            markTouched('make');
                        }}
                        options={[...VEHICLE_BRANDS, { value: '__custom', label: 'Other / Not Listed' }]}
                        placeholder="Select brand"
                        error={fieldError('make')}
                        required
                    />
                    {useCustomBrand && (
                        <Input
                            className="mt-2"
                            value={vehicle.make}
                            onChange={(v) => {
                                updateField('make', v);
                                markTouched('make');
                            }}
                            placeholder="Enter brand"
                            error={fieldError('make')}
                            required
                        />
                    )}
                </FormField>

                <FormField label="Vehicle Model" required>
                    <Input
                        value={vehicle.model}
                        onChange={(v) => {
                            updateField('model', v);
                            markTouched('model');
                        }}
                        placeholder="e.g., Camry, F-150, Civic"
                        error={fieldError('model')}
                        required
                    />
                </FormField>

                <FormField label="Year" required>
                    <Select
                        value={vehicle.year}
                        onChange={(v) => {
                            updateField('year', v);
                            markTouched('year');
                        }}
                        options={yearOptions}
                        error={fieldError('year')}
                        required
                    />
                </FormField>

                {showTireSize && (
                    <FormField label="Tire Size" required>
                        <Select
                            value={vehicle.tireSize}
                            onChange={(v) => {
                                updateField('tireSize', v);
                                markTouched('tireSize');
                            }}
                            options={TIRE_SIZES.map((size) => ({ value: size, label: size }))}
                            placeholder="Select tire size"
                            error={fieldError('tireSize')}
                            required
                        />
                    </FormField>
                )}

                <FormField label="VIN (Optional)">
                    <Input
                        value={vehicle.vin}
                        onChange={(v) => {
                            updateField('vin', v);
                            markTouched('vin');
                        }}
                        placeholder="17-character VIN"
                        error={fieldError('vin')}
                    />
                </FormField>
            </div>

            <FormField label="Additional Notes (Optional)">
                <TextArea
                    value={vehicle.notes}
                    onChange={(v) => {
                        updateField('notes', v);
                        markTouched('notes');
                    }}
                    placeholder="Any additional information about your vehicle..."
                    rows={3}
                    error={fieldError('notes')}
                />
            </FormField>
        </div>
    );
}
