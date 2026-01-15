import { FormField, RadioGroup, Select } from '../../ui';

export interface TireOptionsData {
    newOrUsed: 'new' | 'used' | '';
    numberOfTires: number;
    tpms: boolean;
    alignment: boolean;
    flatRepair: boolean;
}

interface TireOptionsProps {
    options: TireOptionsData;
    onChange: (options: TireOptionsData) => void;
    serviceId: string;
}

const TIRE_CONDITION_OPTIONS = [
    { value: 'new', label: 'New Tires' },
    { value: 'used', label: 'Used Tires' },
];

const TIRE_COUNT_OPTIONS = [
    { value: '1', label: '1 Tire' },
    { value: '2', label: '2 Tires' },
    { value: '3', label: '3 Tires' },
    { value: '4', label: '4 Tires' },
];

export function TireOptions({ options, onChange, serviceId }: TireOptionsProps) {
    const updateField = <K extends keyof TireOptionsData>(field: K, value: TireOptionsData[K]) => {
        onChange({ ...options, [field]: value });
    };

    return (
        <div className="space-y-6">
            <h4 className="text-base font-semibold text-gray-900">Tire Service Details</h4>

            <FormField label="New or Used Tires" required>
                <RadioGroup
                    name={`tireCondition-${serviceId}`}
                    value={options.newOrUsed}
                    onChange={(v) => updateField('newOrUsed', v as 'new' | 'used')}
                    options={TIRE_CONDITION_OPTIONS}
                />
            </FormField>

            <FormField label="Number of Tires" required>
                <Select
                    value={options.numberOfTires.toString()}
                    onChange={(v) => updateField('numberOfTires', parseInt(v, 10))}
                    options={TIRE_COUNT_OPTIONS}
                    placeholder="Select number of tires"
                />
            </FormField>
        </div>
    );
}
