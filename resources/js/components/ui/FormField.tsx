import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface FormFieldProps {
    label: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
    labelClassName?: string;
}

export function FormField({ label, required, children, className, labelClassName }: FormFieldProps) {
    return (
        <div className={clsx('space-y-3', className)}>
            <span className={clsx('block text-sm font-medium text-gray-700', labelClassName)}>
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </span>
            {children}
        </div>
    );
}
