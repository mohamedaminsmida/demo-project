import { useState } from 'react';

import { useLocale } from '../../locales/LocaleProvider';
import type { CustomerInfo } from '../../types/booking';
import { FormField, Input } from '../ui';

interface CustomerInfoFormProps {
    customer: CustomerInfo;
    onChange: (customer: CustomerInfo) => void;
    errors?: Partial<Record<keyof CustomerInfo, string>>;
}

export default function CustomerInfoForm({ customer, onChange, errors }: CustomerInfoFormProps) {
    const { content: t } = useLocale();
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
            <h3 className="text-2xl font-bold text-gray-900 sm:text-2xl">{t.booking.customer.title}</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <FormField label={t.booking.customer.fullName} required>
                    <Input
                        value={customer.fullName}
                        onChange={(v) => {
                            updateField('fullName', v);
                        }}
                        onBlur={() => markTouched('fullName')}
                        placeholder={t.booking.customer.fullNamePlaceholder}
                        maxLength={255}
                        autoComplete="name"
                        error={fieldError('fullName')}
                        required
                    />
                </FormField>

                <FormField label={t.booking.customer.phone} required>
                    <Input
                        type="tel"
                        value={customer.phone}
                        onChange={(v) => {
                            updateField('phone', formatUsPhone(v));
                        }}
                        onBlur={() => markTouched('phone')}
                        placeholder={t.booking.customer.phonePlaceholder}
                        maxLength={20}
                        autoComplete="tel"
                        error={fieldError('phone')}
                        required
                    />
                </FormField>

                <FormField label={t.booking.customer.email} required>
                    <Input
                        type="email"
                        value={customer.email}
                        onChange={(v) => {
                            updateField('email', v);
                        }}
                        onBlur={() => markTouched('email')}
                        placeholder={t.booking.customer.emailPlaceholder}
                        maxLength={255}
                        autoComplete="email"
                        error={fieldError('email')}
                        required
                    />
                </FormField>
                <FormField label={t.booking.customer.address} required>
                    <Input
                        value={customer.address}
                        onChange={(v) => {
                            updateField('address', v);
                        }}
                        onBlur={() => markTouched('address')}
                        placeholder={t.booking.customer.addressPlaceholder}
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
