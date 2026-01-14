import { useMemo } from 'react';
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

const CalendarIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export interface YearOption {
    value: string;
    label: string;
}

export interface YearPickerProps extends Omit<AriaSelectProps<YearOption>, 'children'> {
    label?: string;
    placeholder?: string;
    error?: string;
    startYear?: number;
    endYear?: number;
    includeOlder?: boolean;
}

export function YearPicker({ 
    label, 
    placeholder = 'Select year', 
    error, 
    startYear,
    endYear,
    includeOlder = true,
    ...props 
}: YearPickerProps) {
    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const start = startYear || currentYear - 44;
        const end = endYear || currentYear;
        const range = Array.from({ length: end - start + 1 }, (_, i) => end - i);

        const options: YearOption[] = range.map((year) => ({
            value: String(year),
            label: year === currentYear ? `${year} (Current Year)` : String(year),
        }));

        if (includeOlder) {
            options.push({
                value: 'pre-1980',
                label: '1979 or Older',
            });
        }

        return options;
    }, [startYear, endYear, includeOlder]);

    return (
        <AriaSelect {...props} className="group flex flex-col gap-1.5">
            {label && (
                <Label className="text-sm font-medium text-gray-900 cursor-default">
                    {label}
                    {props.isRequired && <span className="text-error-500 ml-0.5">*</span>}
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
                <SelectValue className="flex-1 truncate data-[placeholder]:text-gray-500" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <CalendarIcon />
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
                    {yearOptions.map((option) => (
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
