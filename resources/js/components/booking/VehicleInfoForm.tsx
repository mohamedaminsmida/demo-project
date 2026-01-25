import { useEffect, useMemo, useState } from 'react';

import { FormField, Input, Select, TextArea } from '../../components/ui';
import { useLocale } from '../../locales/LocaleProvider';
import type { VehicleInfo, VehicleType } from '../../types/vehicle';

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
    const { content: t } = useLocale();

    const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
        { value: 'car', label: t.booking.vehicle.types.car },
        { value: 'light-truck', label: t.booking.vehicle.types.lightTruck },
        { value: 'truck', label: t.booking.vehicle.types.truck },
        { value: 'motorcycle', label: t.booking.vehicle.types.motorcycle },
        { value: 'van', label: t.booking.vehicle.types.van },
        { value: 'other', label: t.booking.vehicle.types.other },
    ];

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
            { value: '', label: t.booking.vehicle.selectModelYear },
            { value: String(currentYear), label: `${currentYear} (${t.booking.vehicle.currentYear})` },
            ...range.slice(1).map((year) => ({ value: String(year), label: String(year) })),
            { value: 'pre-1980', label: t.booking.vehicle.olderThan1980 },
        ];
    }, [t]);

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">{t.booking.vehicle.title}</h3>
            <div className="grid gap-4 md:grid-cols-2">
                <FormField label={t.booking.vehicle.vehicleType} required>
                    <Select
                        value={vehicle.vehicleType}
                        onChange={(v) => {
                            const nextType = v as VehicleType;
                            if (nextType !== 'other' && vehicle.otherType) {
                                updateField('otherType', '');
                            }
                            updateField('vehicleType', nextType);
                        }}
                        onBlur={() => markTouched('vehicleType')}
                        options={VEHICLE_TYPES}
                        placeholder={t.booking.vehicle.selectVehicleType}
                        error={fieldError('vehicleType')}
                        required
                    />
                </FormField>

                {vehicle.vehicleType === 'other' && (
                    <FormField label={t.booking.vehicle.otherVehicleType} required>
                        <Input
                            value={vehicle.otherType}
                            onChange={(v) => {
                                updateField('otherType', v);
                            }}
                            onBlur={() => markTouched('otherType')}
                            placeholder={t.booking.vehicle.describeVehicleType}
                            error={fieldError('otherType')}
                            required
                        />
                    </FormField>
                )}

                <FormField label={t.booking.vehicle.vehicleMake} required>
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
                        onBlur={() => markTouched('make')}
                        options={[...VEHICLE_BRANDS, { value: '__custom', label: t.booking.vehicle.otherNotListed }]}
                        placeholder={t.booking.vehicle.selectBrand}
                        error={fieldError('make')}
                        required
                    />
                    {useCustomBrand && (
                        <Input
                            className="mt-2"
                            value={vehicle.make}
                            onChange={(v) => {
                                updateField('make', v);
                            }}
                            onBlur={() => markTouched('make')}
                            placeholder={t.booking.vehicle.enterBrandName}
                            error={fieldError('make')}
                            required
                        />
                    )}
                </FormField>

                <FormField label={t.booking.vehicle.model} required>
                    <Input
                        value={vehicle.model}
                        onChange={(v) => {
                            updateField('model', v);
                        }}
                        onBlur={() => markTouched('model')}
                        placeholder={t.booking.vehicle.modelPlaceholder}
                        error={fieldError('model')}
                        required
                    />
                </FormField>

                <FormField label={t.booking.vehicle.year} required>
                    <Select
                        value={vehicle.year}
                        onChange={(v) => {
                            updateField('year', v);
                        }}
                        onBlur={() => markTouched('year')}
                        options={yearOptions}
                        placeholder={t.booking.vehicle.selectModelYear}
                        error={fieldError('year')}
                        required
                    />
                </FormField>

                {showTireSize && (
                    <FormField label={t.booking.vehicle.tireSize} required>
                        <Select
                            value={vehicle.tireSize}
                            onChange={(v) => {
                                updateField('tireSize', v);
                            }}
                            onBlur={() => markTouched('tireSize')}
                            options={TIRE_SIZES.map((size) => ({ value: size, label: size }))}
                            placeholder={t.booking.vehicle.selectTireSize}
                            error={fieldError('tireSize')}
                            required
                        />
                    </FormField>
                )}

                <FormField label={t.booking.vehicle.vin}>
                    <Input
                        value={vehicle.vin}
                        onChange={(v) => {
                            updateField('vin', v.toUpperCase());
                        }}
                        onBlur={() => markTouched('vin')}
                        placeholder={t.booking.vehicle.vinPlaceholder}
                        error={fieldError('vin')}
                    />
                </FormField>
            </div>

            <FormField label={t.booking.vehicle.notes}>
                <TextArea
                    value={vehicle.notes}
                    onChange={(v) => {
                        updateField('notes', v);
                    }}
                    onBlur={() => markTouched('notes')}
                    placeholder={t.booking.vehicle.notesPlaceholder}
                    rows={3}
                    error={fieldError('notes')}
                    maxLength={500}
                />
            </FormField>
        </div>
    );
}
