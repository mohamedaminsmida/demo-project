import { useCallback } from 'react';
import {
    Button,
    Label,
    ListBox,
    ListBoxItem,
    Popover,
    Select as AriaSelect,
    SelectValue,
    type SelectProps as AriaSelectProps,
} from 'react-aria-components';
import { cx } from '../../utils/cn';

const ChevronDownIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps
    extends Omit<AriaSelectProps<SelectOption>, 'children' | 'selectedKey' | 'defaultSelectedKey' | 'onSelectionChange'> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    required?: boolean;
}

export function Select({
    label,
    options,
    placeholder,
    error,
    value,
    defaultValue,
    onChange,
    isRequired,
    required,
    onSelectionChange,
    ...props
}: SelectProps) {
    const finalRequired = isRequired ?? required;

    const handleSelectionChange = useCallback(
        (key: React.Key | null) => {
            onSelectionChange?.(key);
            onChange?.(key?.toString() ?? '');
        },
        [onSelectionChange, onChange],
    );

    return (
        <AriaSelect
            {...props}
            className="group flex flex-col gap-1.5"
            selectedKey={value ?? props.selectedKey}
            defaultSelectedKey={defaultValue ?? props.defaultSelectedKey}
            onSelectionChange={handleSelectionChange}
            isRequired={finalRequired}
        >
            {label && (
                <Label className="text-sm font-medium text-gray-900 cursor-default">
                    {label}
                    {finalRequired && <span className="text-error-500 ml-0.5">*</span>}
                </Label>
            )}
            <Button
                className={cx(
                    'relative flex items-center justify-between gap-2',
                    'w-full rounded-xl border bg-white px-4 py-2.5 pr-10',
                    'text-sm font-medium text-left',
                    'shadow-sm transition-all duration-200',
                    'cursor-pointer',
                    // Default state
                    'border-gray-200 text-gray-800',
                    // Hover state
                    'hover:border-gray-300',
                    // Focus state
                    'focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600',
                    // Disabled state
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
                    // Error state
                    error && 'border-error-500 focus:ring-error-500/20 focus:border-error-600',
                )}
            >
                <SelectValue placeholder={placeholder} className="flex-1 truncate data-[placeholder]:text-gray-500" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDownIcon />
                </span>
            </Button>
            {error && <p className="text-xs text-error-600">{error}</p>}
            <Popover
                className={cx(
                    'w-[--trigger-width] overflow-auto rounded-xl',
                    'bg-white shadow-lg border border-gray-200',
                    'entering:animate-in entering:fade-in entering:zoom-in-95',
                    'exiting:animate-out exiting:fade-out exiting:zoom-out-95',
                )}
            >
                <ListBox className="outline-none p-1 max-h-[300px]">
                    {options.map((option) => (
                        <ListBoxItem
                            key={option.value}
                            id={option.value}
                            textValue={option.label}
                            className={cx(
                                'relative flex items-center gap-2 px-3 py-2 rounded-lg',
                                'text-sm text-gray-900 cursor-pointer outline-none',
                                'transition-colors duration-150',
                                // Hover state
                                'hover:bg-gray-50',
                                // Focus state
                                'focus:bg-gray-100',
                                // Selected state
                                'selected:bg-green-50 selected:text-green-900 selected:font-medium',
                            )}
                        >
                            {option.label}
                        </ListBoxItem>
                    ))}
                </ListBox>
            </Popover>
        </AriaSelect>
    );
}
