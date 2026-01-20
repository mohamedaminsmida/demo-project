import { Input as AriaInput, Label, TextField, type TextFieldProps } from 'react-aria-components';
import { cx } from '../../utils/cn';

export interface InputProps extends TextFieldProps {
    label?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    labelClassName?: string;
    inputClassName?: string;
}

export function Input({ label, placeholder, error, isRequired, required, labelClassName, inputClassName, ...props }: InputProps) {
    const finalRequired = isRequired ?? required;

    return (
        <TextField {...props} isRequired={finalRequired} className="group flex flex-col gap-1.5">
            {label && (
                <Label className={cx('text-sm font-medium text-gray-900 cursor-default', labelClassName)}>
                    {label}
                    {finalRequired && <span className="text-error-500 ml-0.5">*</span>}
                </Label>
            )}
            <AriaInput
                placeholder={placeholder}
                className={cx(
                    'w-full rounded-xl border bg-white px-4 py-2.5',
                    'text-sm font-medium text-gray-800 placeholder:text-gray-500',
                    'shadow-sm transition-all duration-200',
                    // Default state
                    'border-gray-200',
                    // Hover state
                    'hover:border-gray-300',
                    // Focus state
                    'focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600',
                    // Disabled state
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
                    // Error state
                    error && 'border-error-500 focus:ring-error-500/20 focus:border-error-600',
                    inputClassName,
                )}
            />
            {error && <p className="text-xs text-error-600">{error}</p>}
        </TextField>
    );
}
