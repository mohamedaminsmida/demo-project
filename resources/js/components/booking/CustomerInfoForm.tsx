import { useState } from 'react';

import type { CustomerInfo } from '../../types/booking';
import { Checkbox, FormField, Input } from '../ui';

interface CustomerInfoFormProps {
    customer: CustomerInfo;
    onChange: (customer: CustomerInfo) => void;
    errors?: Partial<Record<keyof CustomerInfo, string>>;
}

export default function CustomerInfoForm({ customer, onChange, errors }: CustomerInfoFormProps) {
    const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof CustomerInfo, boolean>>>({});

    const updateField = <K extends keyof CustomerInfo>(field: K, value: CustomerInfo[K]) => {
        onChange({ ...customer, [field]: value });
    };

    const markTouched = <K extends keyof CustomerInfo>(field: K) => {
        setTouchedFields((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
    };

    const fieldError = <K extends keyof CustomerInfo>(field: K) => {
        if (!errors?.[field]) {
            return undefined;
        }

        return touchedFields[field] ? errors[field] : undefined;
    };

    const formatUsPhone = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 10);
        if (digits.length <= 3) {
            return digits;
        }
        if (digits.length <= 6) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        }
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Full Name" required>
                    <Input
                        value={customer.fullName}
                        onChange={(v) => {
                            updateField('fullName', v);
                            markTouched('fullName');
                        }}
                        placeholder="John Doe"
                        error={fieldError('fullName')}
                        required
                    />
                </FormField>

                <FormField label="Phone Number" required>
                    <Input
                        type="tel"
                        value={customer.phone}
                        onChange={(v) => {
                            updateField('phone', formatUsPhone(v));
                            markTouched('phone');
                        }}
                        placeholder="(212) 555-0123"
                        error={fieldError('phone')}
                        required
                    />
                </FormField>

                <FormField label="Email Address" required>
                    <Input
                        type="email"
                        value={customer.email}
                        onChange={(v) => {
                            updateField('email', v);
                            markTouched('email');
                        }}
                        placeholder="john@example.com"
                        error={fieldError('email')}
                        required
                    />
                </FormField>
            </div>

            <Checkbox
                isSelected={customer.smsUpdates}
                onChange={(v) => updateField('smsUpdates', v)}
                label="Send me Email updates about my appointment"
            />
        </div>
    );
}
