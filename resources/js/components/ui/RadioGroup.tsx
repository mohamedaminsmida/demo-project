import {
    Label,
    Radio,
    RadioGroup as AriaRadioGroup,
    type RadioGroupProps as AriaRadioGroupProps,
} from 'react-aria-components';
import { cx } from '../../utils/cn';

export interface RadioOption {
    value: string;
    label: string;
}

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'children'> {
    label?: string;
    options: RadioOption[];
    error?: string;
}

export function RadioGroup({ label, options, error, ...props }: RadioGroupProps) {
    return (
        <AriaRadioGroup {...props} className="group flex flex-col gap-2">
            {label && (
                <Label className="text-sm font-medium text-gray-900 cursor-default">
                    {label}
                    {props.isRequired && <span className="text-error-500 ml-0.5">*</span>}
                </Label>
            )}
            <div className="flex flex-wrap gap-4">
                {options.map((option) => (
                    <Radio
                        key={option.value}
                        value={option.value}
                        className={cx(
                            'group flex items-center gap-2 cursor-pointer',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                    >
                        {({ isSelected }) => (
                            <>
                                <div
                                    className={cx(
                                        'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all',
                                        'group-focus-visible:ring-2 group-focus-visible:ring-green-500/20 group-focus-visible:ring-offset-2',
                                        isSelected
                                            ? 'border-green-600'
                                            : 'border-gray-300 group-hover:border-gray-400',
                                    )}
                                >
                                    {isSelected && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                                    )}
                                </div>
                                <span className="text-sm text-gray-700 select-none">{option.label}</span>
                            </>
                        )}
                    </Radio>
                ))}
            </div>
            {error && <p className="text-xs text-error-600">{error}</p>}
        </AriaRadioGroup>
    );
}
