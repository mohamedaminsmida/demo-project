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
                    {isRequired && <span className="ml-0.5 text-red-600">*</span>}
                </span>
            )}
            <div
                className={cx(columns === 2 ? 'grid grid-cols-1 gap-3 sm:grid-cols-2' : 'flex flex-col gap-3')}
                role="radiogroup"
            >
                {options.map((option) => {
                    const isSelected = value === option.value;
                    const inputId = `${name}-${option.value}`;

                    return (
                        <label
                            key={option.value}
                            htmlFor={inputId}
                            className={cx(
                                'flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition focus-within:ring-2 focus-within:ring-green-500',
                                isSelected
                                    ? 'border-green-600 bg-green-50 text-green-900 shadow-sm'
                                    : 'border-gray-200 bg-white text-gray-800 hover:border-green-200'
                            )}
                        >
                            <span className="flex-1 text-sm font-medium">{option.label}</span>
                            <span
                                className={cx(
                                    'flex h-5 w-5 items-center justify-center rounded-full border-2 transition',
                                    isSelected ? 'border-green-600 bg-green-600' : 'border-gray-300 bg-white'
                                )}
                                aria-hidden="true"
                            >
                                <span
                                    className={cx(
                                        'h-2 w-2 rounded-full bg-white transition-opacity',
                                        isSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                            </span>
                            <input
                                type="radio"
                                id={inputId}
                                name={name}
                                value={option.value}
                                checked={isSelected}
                                onChange={(e) => onChange?.(e.target.value)}
                                className="sr-only"
                            />
                        </label>
                    );
                })}
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
