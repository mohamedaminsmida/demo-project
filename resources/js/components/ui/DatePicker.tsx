import {
    Button,
    Calendar,
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell,
    DateInput,
    DatePicker as AriaDatePicker,
    DateSegment,
    Dialog,
    Group,
    Heading,
    Label,
    Popover,
    type DatePickerProps as AriaDatePickerProps,
    type DateValue,
} from 'react-aria-components';
import { cx } from '../../utils/cn';

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {
    label?: string;
    error?: string;
}

export function DatePicker<T extends DateValue>({ label, error, ...props }: DatePickerProps<T>) {
    return (
        <AriaDatePicker {...props} className="group flex flex-col gap-1.5">
            {label && (
                <Label className="text-sm font-medium text-gray-900 cursor-default">
                    {label}
                    {props.isRequired && <span className="text-error-500 ml-0.5">*</span>}
                </Label>
            )}
            <Group
                className={cx(
                    'relative flex items-center',
                    'w-full rounded-xl border bg-white px-4 py-2.5',
                    'shadow-sm transition-all duration-200',
                    // Default state
                    'border-gray-200',
                    // Hover state
                    'hover:border-gray-300',
                    // Focus-within state
                    'group-focus-within:ring-2 group-focus-within:ring-green-500/20 group-focus-within:border-green-600',
                    // Error state
                    error && 'border-error-500 group-focus-within:ring-error-500/20 group-focus-within:border-error-600',
                )}
            >
                <DateInput className="flex flex-1 items-center gap-1">
                    {(segment) => (
                        <DateSegment
                            segment={segment}
                            className={cx(
                                'rounded px-0.5 py-0.5 text-sm font-medium tabular-nums',
                                'outline-none',
                                'text-gray-800',
                                'placeholder-shown:text-gray-500',
                                'focus:bg-green-600 focus:text-white',
                            )}
                        />
                    )}
                </DateInput>
                <Button
                    className={cx(
                        'ml-2 flex h-6 w-6 items-center justify-center rounded',
                        'text-gray-400 hover:text-gray-600',
                        'focus:outline-none focus:ring-2 focus:ring-green-500/20',
                    )}
                >
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
                </Button>
            </Group>
            {error && <p className="text-xs text-error-600">{error}</p>}
            <Popover
                className={cx(
                    'overflow-auto rounded-xl bg-white shadow-lg border border-gray-200',
                    'entering:animate-in entering:fade-in entering:zoom-in-95',
                    'exiting:animate-out exiting:fade-out exiting:zoom-out-95',
                )}
            >
                <Dialog className="p-4 outline-none">
                    <Calendar>
                        <header className="flex items-center justify-between gap-2 pb-4">
                            <Button
                                slot="previous"
                                className={cx(
                                    'flex h-8 w-8 items-center justify-center rounded-lg',
                                    'text-gray-600 hover:bg-gray-100',
                                    'focus:outline-none focus:ring-2 focus:ring-green-500/20',
                                )}
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Button>
                            <Heading className="text-sm font-semibold text-gray-900" />
                            <Button
                                slot="next"
                                className={cx(
                                    'flex h-8 w-8 items-center justify-center rounded-lg',
                                    'text-gray-600 hover:bg-gray-100',
                                    'focus:outline-none focus:ring-2 focus:ring-green-500/20',
                                )}
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Button>
                        </header>
                        <CalendarGrid className="border-separate border-spacing-1">
                            <CalendarGridHeader>
                                {(day) => (
                                    <CalendarHeaderCell className="text-xs font-semibold text-gray-500 w-9 h-9 flex items-center justify-center">
                                        {day}
                                    </CalendarHeaderCell>
                                )}
                            </CalendarGridHeader>
                            <CalendarGridBody>
                                {(date) => (
                                    <CalendarCell
                                        date={date}
                                        className={cx(
                                            'flex h-9 w-9 items-center justify-center rounded-lg text-sm',
                                            'outline-none cursor-pointer',
                                            'text-gray-900',
                                            'hover:bg-gray-100',
                                            'focus:ring-2 focus:ring-green-500/20',
                                            'selected:bg-green-600 selected:text-white selected:font-semibold',
                                            'disabled:text-gray-300 disabled:cursor-not-allowed',
                                            'outside-month:text-gray-400',
                                        )}
                                    />
                                )}
                            </CalendarGridBody>
                        </CalendarGrid>
                    </Calendar>
                </Dialog>
            </Popover>
        </AriaDatePicker>
    );
}
