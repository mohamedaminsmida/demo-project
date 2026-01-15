import { cx } from '../../utils/cn';

export interface RadioOption {
    value: string;
    label: string;
}

export interface RadioGroupProps {
    name: string;
    label?: string;
    options: RadioOption[];
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    columns?: 1 | 2;
    isRequired?: boolean;
}

export function RadioGroup({ name, label, options, value, onChange, error, columns = 1, isRequired }: RadioGroupProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <span className="text-sm font-medium text-gray-900">
                    {label}
                    {isRequired && <span className="text-error-500 ml-0.5">*</span>}
                </span>
            )}
            <div
                className={cx(
                    columns === 2 
                        ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' 
                        : 'flex flex-col gap-3'
                )}
                role="radiogroup"
            >
                {options.map((option) => {
                    const isSelected = value === option.value;
                    const inputId = `${name}-${option.value}`;

                    return (
                        <label
                            key={option.value}
                            htmlFor={inputId}
                            className="relative flex items-center gap-2 cursor-pointer select-none py-1"
                        >
                            <input
                                type="radio"
                                id={inputId}
                                name={name}
                                value={option.value}
                                checked={isSelected}
                                onChange={(e) => onChange?.(e.target.value)}
                                className="h-5 w-5 accent-green-600 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                    );
                })}
            </div>
            {error && <p className="text-xs text-error-600">{error}</p>}
        </div>
    );
}
