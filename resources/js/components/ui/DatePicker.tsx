import { useContext, useEffect, useMemo, useRef } from 'react';
import { getLocalTimeZone, today } from '@internationalized/date';
import {
    Button,
    Calendar,
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell,
    CalendarStateContext,
    DateInput,
    DatePicker as AriaDatePicker,
    DateSegment,
    Dialog,
    Group,
    Heading,
    I18nProvider,
    Label,
    ListBox,
    ListBoxItem,
    Popover,
    Select as AriaSelect,
    SelectValue,
    type DatePickerProps as AriaDatePickerProps,
    type DateValue,
} from 'react-aria-components';
import { cx } from '../../utils/cn';

function MonthYearPickers({ locale }: { locale: string }) {
    const state = useContext(CalendarStateContext);
    const focusedDate = state?.focusedDate;

    const month = focusedDate?.month;
    const year = focusedDate?.year;

    const monthsInYear = useMemo(() => {
        if (!focusedDate) return 12;
        const calendar = (focusedDate as unknown as { calendar?: { getMonthsInYear?: (date: typeof focusedDate) => number } }).calendar;
        if (calendar && typeof calendar.getMonthsInYear === 'function') {
            return calendar.getMonthsInYear(focusedDate);
        }
        return 12;
    }, [focusedDate]);

    const months = useMemo(() => Array.from({ length: monthsInYear }, (_, idx) => idx + 1), [monthsInYear]);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const start = 1990;
        const end = currentYear;
        return Array.from({ length: end - start + 1 }, (_, idx) => end - idx);
    }, []);

    if (!state || !focusedDate || !month || !year) {
        return <Heading className="text-sm font-semibold text-gray-900" />;
    }

    const monthLabel = (m: number) => new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2020, m - 1, 1));

    return (
        <div className="flex items-center gap-2">
            <AriaSelect
                aria-label="Month"
                selectedKey={String(month)}
                onSelectionChange={(key) => {
                    const nextMonth = Number(key);
                    state.setFocusedDate(focusedDate.set({ month: nextMonth, day: 1 }));
                }}
            >
                <Button
                    className={cx(
                        'relative flex items-center justify-between gap-2',
                        'h-9 min-w-[96px] rounded-lg border bg-white px-3 pr-8',
                        'text-xs font-semibold text-gray-900',
                        'border-gray-200 shadow-sm',
                        'hover:border-gray-300',
                        'focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600',
                    )}
                >
                    <SelectValue className="truncate" />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </Button>
                <Popover
                    className={cx(
                        'w-[--trigger-width] overflow-auto rounded-xl',
                        'bg-white shadow-lg border border-gray-200',
                        'entering:animate-in entering:fade-in entering:zoom-in-95',
                        'exiting:animate-out exiting:fade-out exiting:zoom-out-95',
                    )}
                    placement="bottom"
                >
                    <ListBox className="outline-none p-1 max-h-[260px]">
                        {months.map((m) => (
                            <ListBoxItem
                                key={m}
                                id={String(m)}
                                textValue={monthLabel(m)}
                                className={cx(
                                    'relative flex items-center px-3 py-2 rounded-lg',
                                    'text-xs text-gray-900 cursor-pointer outline-none',
                                    'transition-colors duration-150',
                                    'hover:bg-gray-50',
                                    'focus:bg-gray-100',
                                    'selected:bg-green-50 selected:text-green-900 selected:font-semibold',
                                )}
                            >
                                {monthLabel(m)}
                            </ListBoxItem>
                        ))}
                    </ListBox>
                </Popover>
            </AriaSelect>

            <AriaSelect
                aria-label="Year"
                selectedKey={String(year)}
                onSelectionChange={(key) => {
                    const nextYear = Number(key);
                    state.setFocusedDate(focusedDate.set({ year: nextYear, day: 1 }));
                }}
            >
                <Button
                    className={cx(
                        'relative flex items-center justify-between gap-2',
                        'h-9 min-w-[92px] rounded-lg border bg-white px-3 pr-8',
                        'text-xs font-semibold text-gray-900',
                        'border-gray-200 shadow-sm',
                        'hover:border-gray-300',
                        'focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600',
                    )}
                >
                    <span className="truncate">{year}</span>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </Button>
                <Popover
                    className={cx(
                        'w-[--trigger-width] overflow-auto rounded-xl',
                        'bg-white shadow-lg border border-gray-200',
                        'entering:animate-in entering:fade-in entering:zoom-in-95',
                        'exiting:animate-out exiting:fade-out exiting:zoom-out-95',
                    )}
                    placement="bottom"
                >
                    <ListBox className="outline-none p-1 max-h-[252px]">
                        {years.map((y) => (
                            <ListBoxItem
                                key={y}
                                id={String(y)}
                                textValue={String(y)}
                                className={cx(
                                    'relative flex items-center px-3 py-2 rounded-lg',
                                    'text-xs text-gray-900 cursor-pointer outline-none',
                                    'transition-colors duration-150',
                                    'hover:bg-gray-50',
                                    'focus:bg-gray-100',
                                    'selected:bg-green-50 selected:text-green-900 selected:font-semibold',
                                )}
                            >
                                {y}
                            </ListBoxItem>
                        ))}
                    </ListBox>
                </Popover>
            </AriaSelect>
        </div>
    );
}

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {
    label?: string;
    error?: string;
}

export function DatePicker<T extends DateValue>({ label, error, ...props }: DatePickerProps<T>) {
    const didInitDefault = useRef(false);
    const resolvedLocale = useMemo(() => {
        if (typeof document !== 'undefined') {
            const docLang = document.documentElement.lang?.trim();
            if (docLang) return docLang;
        }
        if (typeof navigator !== 'undefined' && navigator.language) {
            return navigator.language;
        }
        return 'en';
    }, []);

    const todayValue = useMemo(() => today(getLocalTimeZone()), []);
    const computedDefaultValue =
        props.defaultValue ?? (props.value == null ? (todayValue as unknown as T) : undefined);

    useEffect(() => {
        if (didInitDefault.current) return;
        if (props.value != null) return;
        if (props.defaultValue != null) return;
        if (typeof props.onChange !== 'function') return;
        didInitDefault.current = true;
        props.onChange(todayValue as unknown as Parameters<NonNullable<typeof props.onChange>>[0]);
    }, [props, todayValue]);

    return (
        <I18nProvider locale={resolvedLocale}>
            <AriaDatePicker
                {...props}
                defaultValue={computedDefaultValue}
                className="group flex flex-col gap-1.5"
            >
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
                    <DateInput className="flex flex-1 items-center gap-1 pointer-events-none select-none">
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
                    placement="bottom"
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
                                        <path
                                            d="M15 18L9 12L15 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Button>
                                <MonthYearPickers locale={resolvedLocale} />
                                <Button
                                    slot="next"
                                    className={cx(
                                        'flex h-8 w-8 items-center justify-center rounded-lg',
                                        'text-gray-600 hover:bg-gray-100',
                                        'focus:outline-none focus:ring-2 focus:ring-green-500/20',
                                    )}
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9 18L15 12L9 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Button>
                            </header>
                            <CalendarGrid className="table border-separate border-spacing-1">
                                <CalendarGridHeader className="table-header-group">
                                    {(day) => (
                                        <CalendarHeaderCell className="table-cell h-9 w-9 text-center align-middle text-xs font-semibold text-gray-500">
                                            {day}
                                        </CalendarHeaderCell>
                                    )}
                                </CalendarGridHeader>
                                <CalendarGridBody className="table-row-group">
                                    {(date) => (
                                        <CalendarCell
                                            date={date}
                                            className={cx(
                                                'table-cell h-9 w-9 rounded-lg text-center align-middle text-sm leading-9',
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
        </I18nProvider>
    );
}
