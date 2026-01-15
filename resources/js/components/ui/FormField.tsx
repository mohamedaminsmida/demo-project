import type { ReactNode } from 'react';

export interface FormFieldProps {
    label: string;
    required?: boolean;
    children: ReactNode;
}

export function FormField({ label, required, children }: FormFieldProps) {
    return (
        <div className="space-y-3">
            <span className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </span>
            {children}
        </div>
    );
}
