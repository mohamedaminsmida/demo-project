import { FormField, Input, RadioGroup } from '../../ui';

export interface OilOptionsData {
    oilType: 'conventional' | 'synthetic-blend' | 'full-synthetic' | 'high-mileage' | '';
    lastChangeDate: string;
}

interface OilOptionsProps {
    options: OilOptionsData;
    onChange: (options: OilOptionsData) => void;
    serviceId: string;
}

const OIL_TYPE_OPTIONS = [
    { value: 'conventional', label: 'Conventional' },
    { value: 'synthetic-blend', label: 'Synthetic Blend' },
    { value: 'full-synthetic', label: 'Full Synthetic' },
    { value: 'high-mileage', label: 'High Mileage' },
];

export function OilOptions({ options, onChange, serviceId }: OilOptionsProps) {
    const updateField = <K extends keyof OilOptionsData>(field: K, value: OilOptionsData[K]) => {
        onChange({ ...options, [field]: value });
    };

    return (
        <div className="space-y-6">
            <h4 className="text-base font-semibold text-gray-900">Oil Change Details</h4>

            <FormField label="Oil Type" required>
                <RadioGroup
                    name={`oilType-${serviceId}`}
                    value={options.oilType}
                    onChange={(v) => updateField('oilType', v as OilOptionsData['oilType'])}
                    options={OIL_TYPE_OPTIONS}
                    columns={2}
                />
            </FormField>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Last Oil Change Date (Optional)</label>
                <Input type="date" value={options.lastChangeDate} onChange={(v) => updateField('lastChangeDate', v)} />
            </div>
        </div>
    );
}
