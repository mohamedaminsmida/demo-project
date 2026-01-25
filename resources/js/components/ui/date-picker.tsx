import {
    DatePicker as AriaDatePicker,
    DatePickerProps as AriaDatePickerProps,
    DateValue,
    Dialog,
    Group,
    Label,
    Popover,
    Button,
    Calendar,
    CalendarGrid,
    CalendarCell,
    Heading,
} from 'react-aria-components';

export interface DatePickerProps extends AriaDatePickerProps<DateValue> {
    label?: string;
}

export function DatePicker({ label, ...props }: DatePickerProps) {
    return (
        <AriaDatePicker {...props} className="flex flex-col gap-2">
            {label && <Label className="text-sm font-medium text-gray-700">{label}</Label>}
            <Group className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-600/20">
                <div className="flex-1">
                    <input
                        className="w-full border-none bg-transparent text-sm outline-none focus:ring-0"
                        placeholder="Select date"
                    />
                </div>
                <Button className="ml-2 rounded p-1 hover:bg-gray-100">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </Button>
            </Group>
            <Popover className="z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                <Dialog className="outline-none">
                    <Calendar>
                        <header className="mb-4 flex items-center justify-between">
                            <Button slot="previous" className="rounded p-2 hover:bg-gray-100">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Button>
                            <Heading className="text-lg font-semibold" />
                            <Button slot="next" className="rounded p-2 hover:bg-gray-100">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Button>
                        </header>
                        <CalendarGrid className="border-separate border-spacing-1">
                            {(date) => (
                                <CalendarCell
                                    date={date}
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded text-sm hover:bg-gray-100 data-[selected]:bg-green-600 data-[selected]:text-white data-[disabled]:cursor-not-allowed data-[disabled]:text-gray-300"
                                />
                            )}
                        </CalendarGrid>
                    </Calendar>
                </Dialog>
            </Popover>
        </AriaDatePicker>
    );
}
