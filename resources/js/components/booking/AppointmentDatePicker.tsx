import { useEffect, useMemo, useState } from 'react';

import CheckIcon from '../../../images/svg/check.svg';

interface AppointmentDatePickerProps {
    selectedDate: string;
    selectedTime: string;
    onDateChange: (date: string) => void;
    onTimeChange: (time: string) => void;
}

export default function AppointmentDatePicker({
    selectedDate: initialDate,
    selectedTime: initialTime,
    onDateChange,
    onTimeChange,
}: AppointmentDatePickerProps) {
    // Derive initial month from saved date
    const getMonthFromDate = (dateStr: string): string | null => {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length >= 2) {
            return `${parts[0]}-${parts[1]}`;
        }
        return null;
    };

    // Derive initial hour from saved time
    const getHourFromTime = (timeStr: string): string | null => {
        if (!timeStr) return null;
        const match = timeStr.match(/(\d+):00\s*(AM|PM)/i);
        if (match) {
            let hour = parseInt(match[1], 10);
            const period = match[2].toUpperCase();
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            return String(hour);
        }
        return null;
    };

    const [selectedMonth, setSelectedMonth] = useState<string | null>(() => getMonthFromDate(initialDate));
    const [selectedDate, setSelectedDate] = useState<string>(initialDate || '');
    const [selectedHour, setSelectedHour] = useState<string | null>(() => getHourFromTime(initialTime));
    const [selectedTime, setSelectedTime] = useState<string>(initialTime || '');

    // Sync with parent when values change
    useEffect(() => {
        if (selectedDate !== initialDate) {
            onDateChange(selectedDate);
        }
    }, [selectedDate, onDateChange]);

    useEffect(() => {
        if (selectedTime !== initialTime) {
            onTimeChange(selectedTime);
        }
    }, [selectedTime, onTimeChange]);

    // Generate available months (current + next 11 months = 12 months total)
    const availableMonths = useMemo(() => {
        const months: { value: string; label: string }[] = [];
        const today = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
            });
            months.push({ value, label });
        }
        return months;
    }, []);

    // Generate dates for selected month
    const availableDates = useMemo(() => {
        if (!selectedMonth) return [];
        const dates: { value: string; label: string }[] = [];
        const today = new Date();
        const [year, month] = selectedMonth.split('-').map(Number);
        const lastDay = new Date(year, month, 0);

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month - 1, day);
            // Skip past dates and Sundays
            if (date > today && date.getDay() !== 0) {
                const value = date.toISOString().split('T')[0];
                const label = date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                });
                dates.push({ value, label });
            }
        }
        return dates;
    }, [selectedMonth]);

    // Generate hour options (8 AM to 5 PM)
    const availableHours = useMemo(() => {
        const hours: { value: string; label: string }[] = [];
        for (let i = 8; i <= 17; i++) {
            const hour = i > 12 ? i - 12 : i;
            const period = i >= 12 ? 'PM' : 'AM';
            const value = `${i}`;
            const label = `${hour}:00 ${period}`;
            hours.push({ value, label });
        }
        return hours;
    }, []);

    const handleMonthSelect = (monthValue: string) => {
        setSelectedMonth(monthValue);
        // Clear selected date if it's not in the new month
        if (selectedDate && !selectedDate.startsWith(monthValue)) {
            setSelectedDate('');
            setSelectedHour(null);
            setSelectedTime('');
        }
    };

    const handleDateSelect = (dateValue: string) => {
        setSelectedDate(dateValue);
        setSelectedHour(null);
        setSelectedTime('');
    };

    const handleHourSelect = (hourValue: string) => {
        setSelectedHour(hourValue);
        // Automatically set time to the selected hour
        const hour = parseInt(hourValue);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        setSelectedTime(`${displayHour}:00 ${period}`);
    };

    const handleChangeMonth = () => {
        setSelectedMonth(null);
        setSelectedDate('');
        setSelectedHour(null);
        setSelectedTime('');
    };

    const handleChangeDate = () => {
        setSelectedDate('');
        setSelectedHour(null);
        setSelectedTime('');
    };

    const selectedMonthLabel = availableMonths.find((m) => m.value === selectedMonth)?.label;
    const selectedDateLabel = availableDates.find((d) => d.value === selectedDate)?.label;
    const selectedHourLabel = availableHours.find((h) => h.value === selectedHour)?.label;

    return (
        <div className="space-y-6">
            {/* Month Selection */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    Select Month <span className="text-red-500">*</span>
                </label>

                {/* Collapsed Month Display */}
                {selectedMonth ? (
                    <div
                        onClick={handleChangeMonth}
                        className="cursor-pointer rounded-lg border border-green-500 bg-green-50 px-4 py-3 text-center transition-colors hover:bg-green-100"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <img src={CheckIcon} alt="Selected" className="h-5 w-5" />
                            <p className="text-sm font-semibold text-green-700">{selectedMonthLabel}</p>
                        </div>
                    </div>
                ) : (
                    /* Expanded Month Grid */
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {availableMonths.map((month) => (
                            <button
                                key={month.value}
                                type="button"
                                onClick={() => handleMonthSelect(month.value)}
                                className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-green-300 hover:bg-green-50"
                            >
                                {month.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Date Selection - Appears after month selection with smooth transition */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    selectedMonth ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Preferred Date <span className="text-red-500">*</span>
                    </label>

                    {/* Collapsed Date Display */}
                    {selectedDate ? (
                        <div
                            onClick={handleChangeDate}
                            className="cursor-pointer rounded-lg border border-green-500 bg-green-50 px-4 py-3 text-center transition-all duration-300 hover:bg-green-100"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <img src={CheckIcon} alt="Selected" className="h-5 w-5" />
                                <p className="text-sm font-semibold text-green-700">{selectedDateLabel}</p>
                            </div>
                        </div>
                    ) : (
                        /* Expanded Date Grid */
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            {availableDates.map((date) => (
                                <button
                                    key={date.value}
                                    type="button"
                                    onClick={() => handleDateSelect(date.value)}
                                    className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-green-300 hover:bg-green-50"
                                >
                                    {date.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Hour Selection - Appears after date selection with smooth transition */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    selectedDate ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Select Hour <span className="text-red-500">*</span>
                    </label>

                    {/* Collapsed Hour Display */}
                    {selectedHour ? (
                        <div
                            onClick={() => setSelectedHour(null)}
                            className="cursor-pointer rounded-lg border border-green-500 bg-green-50 px-4 py-3 text-center transition-all duration-300 hover:bg-green-100"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <img src={CheckIcon} alt="Selected" className="h-5 w-5" />
                                <p className="text-sm font-semibold text-green-700">{selectedHourLabel}</p>
                            </div>
                        </div>
                    ) : (
                        /* Expanded Hour Grid */
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                            {availableHours.map((hour) => (
                                <button
                                    key={hour.value}
                                    type="button"
                                    onClick={() => handleHourSelect(hour.value)}
                                    className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-green-300 hover:bg-green-50"
                                >
                                    {hour.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
