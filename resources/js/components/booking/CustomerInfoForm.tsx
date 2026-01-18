import { useState } from 'react';

import type { CustomerInfo } from '../../types/booking';
import { FormField, Input } from '../ui';

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
                        }}
                        onBlur={() => markTouched('fullName')}
                        placeholder="John Doe"
                        maxLength={255}
                        autoComplete="name"
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
                        }}
                        onBlur={() => markTouched('phone')}
                        placeholder="(212) 555-0123"
                        maxLength={20}
                        autoComplete="tel"
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
                        }}
                        onBlur={() => markTouched('email')}
                        placeholder="john@example.com"
                        maxLength={255}
                        autoComplete="email"
                        error={fieldError('email')}
                        required
                    />
                </FormField>
                <FormField label="Address" required>
                    <Input
                        value={customer.address}
                        onChange={(v) => {
                            updateField('address', v);
                        }}
                        onBlur={() => markTouched('address')}
                        placeholder="123 Main St, Springfield"
                        maxLength={255}
                        autoComplete="street-address"
                        error={fieldError('address')}
                        required
                    />
                </FormField>
            </div>
        </div>
    );
}
