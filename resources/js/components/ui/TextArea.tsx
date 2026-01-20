import { Label, TextArea as AriaTextArea, TextField, type TextFieldProps } from 'react-aria-components';
import { cx } from '../../utils/cn';

export interface TextAreaProps extends TextFieldProps {
    label?: string;
    placeholder?: string;
    rows?: number;
    error?: string;
    labelClassName?: string;
    textareaClassName?: string;
}

export function TextArea({ label, placeholder, rows = 3, error, labelClassName, textareaClassName, ...props }: TextAreaProps) {
    return (
        <TextField {...props} className="group flex flex-col gap-1.5">
            {label && (
                <Label className={cx('text-sm font-medium text-gray-900 cursor-default', labelClassName)}>
                    {label}
                    {props.isRequired && <span className="text-error-500 ml-0.5">*</span>}
                </Label>
            )}
            <AriaTextArea
                rows={rows}
                placeholder={placeholder}
                className={cx(
                    'w-full rounded-xl border bg-white px-4 py-2.5',
                    'text-sm font-medium text-gray-800 placeholder:text-gray-500',
                    'shadow-sm transition-all duration-200',
                    'resize-none',
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
                    textareaClassName,
                )}
            />
            {error && <p className="text-xs text-error-600">{error}</p>}
        </TextField>
    );
}
