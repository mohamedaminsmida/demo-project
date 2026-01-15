import { Checkbox, FormField, RadioGroup, TextArea } from '../../ui';

export interface RepairOptionsData {
    symptoms: {
        noise: boolean;
        vibration: boolean;
        warning_light: boolean;
        performance: boolean;
        leak: boolean;
        electrical: boolean;
        other: boolean;
    };
    otherSymptomDescription: string;
    problemDescription: string;
    drivable: 'yes' | 'no' | '';
    photos: File[];
}

interface RepairOptionsProps {
    options: RepairOptionsData;
    onChange: (options: RepairOptionsData) => void;
    serviceId: string;
}

const SYMPTOM_OPTIONS = [
    { key: 'noise', label: 'Unusual noise (clicking, grinding, squealing)' },
    { key: 'vibration', label: 'Vibration or shaking' },
    { key: 'warning_light', label: 'Warning light on dashboard' },
    { key: 'performance', label: 'Performance issue (power loss, stalling)' },
    { key: 'leak', label: 'Fluid leak' },
    { key: 'electrical', label: 'Electrical problem' },
    { key: 'other', label: 'Other' },
] as const;

const DRIVABLE_OPTIONS = [
    { value: 'yes', label: 'Yes, it can be driven' },
    { value: 'no', label: 'No, it needs towing' },
];

export function RepairOptions({ options, onChange, serviceId }: RepairOptionsProps) {
    const updateField = <K extends keyof RepairOptionsData>(field: K, value: RepairOptionsData[K]) => {
        onChange({ ...options, [field]: value });
    };

    const handleSymptomToggle = (symptomKey: keyof RepairOptionsData['symptoms'], checked: boolean) => {
        const newSymptoms = { ...options.symptoms, [symptomKey]: checked };
        onChange({
            ...options,
            symptoms: newSymptoms,
            // Clear other description if "other" is unchecked
            otherSymptomDescription: symptomKey === 'other' && !checked ? '' : options.otherSymptomDescription,
        });
    };

    return (
        <div className="space-y-6">
            <FormField label="What type of symptom are you experiencing? (Select all that apply)" required>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {SYMPTOM_OPTIONS.map((symptom) => (
                        <Checkbox
                            key={symptom.key}
                            isSelected={options.symptoms?.[symptom.key] ?? false}
                            onChange={(checked) => handleSymptomToggle(symptom.key, checked)}
                            label={symptom.label}
                        />
                    ))}
                </div>
            </FormField>

            {options.symptoms?.other && (
                <FormField label="Please describe the symptom" required>
                    <TextArea
                        value={options.otherSymptomDescription}
                        onChange={(v) => updateField('otherSymptomDescription', v)}
                        placeholder="Please describe the symptom you're experiencing..."
                        rows={3}
                    />
                </FormField>
            )}

            <FormField label="Describe the Problem in Detail" required>
                <TextArea
                    value={options.problemDescription}
                    onChange={(v) => updateField('problemDescription', v)}
                    placeholder="Please provide more details about the issue..."
                    rows={4}
                />
            </FormField>

            <FormField label="Is the Vehicle Drivable?" required>
                <RadioGroup
                    name={`drivable-${serviceId}`}
                    value={options.drivable}
                    onChange={(v) => updateField('drivable', v as 'yes' | 'no')}
                    options={DRIVABLE_OPTIONS}
                />
            </FormField>
        </div>
    );
}
