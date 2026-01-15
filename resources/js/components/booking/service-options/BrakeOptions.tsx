import { Checkbox, FormField, RadioGroup } from '../../ui';

export interface BrakeOptionsData {
    position: 'front' | 'rear' | 'both' | '';
    noiseOrVibration: boolean;
    warningLight: boolean;
}

interface BrakeOptionsProps {
    options: BrakeOptionsData;
    onChange: (options: BrakeOptionsData) => void;
    serviceId: string;
}

const BRAKE_POSITION_OPTIONS = [
    { value: 'front', label: 'Front Brakes' },
    { value: 'rear', label: 'Rear Brakes' },
    { value: 'both', label: 'Both Front & Rear' },
];

export function BrakeOptions({ options, onChange, serviceId }: BrakeOptionsProps) {
    const updateField = <K extends keyof BrakeOptionsData>(field: K, value: BrakeOptionsData[K]) => {
        onChange({ ...options, [field]: value });
    };

    return (
        <div className="space-y-6">
            <h4 className="text-base font-semibold text-gray-900">Brake Service Details</h4>

            <FormField label="Which Brakes Need Service?" required>
                <RadioGroup
                    name={`brakePosition-${serviceId}`}
                    value={options.position}
                    onChange={(v) => updateField('position', v as BrakeOptionsData['position'])}
                    options={BRAKE_POSITION_OPTIONS}
                />
            </FormField>

            <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Current Issues</p>
                <div className="space-y-2">
                    <Checkbox
                        isSelected={options.noiseOrVibration}
                        onChange={(v) => updateField('noiseOrVibration', v)}
                        label="Noise or vibration when braking"
                    />
                    <Checkbox isSelected={options.warningLight} onChange={(v) => updateField('warningLight', v)} label="Brake warning light is on" />
                </div>
            </div>
        </div>
    );
}
