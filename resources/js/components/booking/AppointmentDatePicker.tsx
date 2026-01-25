import { useCallback, useEffect, useMemo, useState } from 'react';

import CheckIcon from '../../../images/svg/check.svg';
import { useLocale } from '../../locales/LocaleProvider';

interface AppointmentDatePickerProps {
    selectedDate: string;
    selectedTime: string;
    serviceIds?: number[];
    onDateChange: (date: string) => void;
    onTimeChange: (time: string) => void;
}

type AvailabilityState = {
    availableHours: string[];
    bookedTimes: string[];
    unavailableHours: string[];
    serverTime: string;
};

type WorkingHourEntry = {
    day: string;
    is_day_off?: boolean;
};

export default function AppointmentDatePicker({
    selectedDate: initialDate,
    selectedTime: initialTime,
    serviceIds = [],
    onDateChange,
    onTimeChange,
}: AppointmentDatePickerProps) {
    const { content: t } = useLocale();
    // Derive initial month from saved date
    const getMonthFromDate = (dateStr: string): string | null => {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length >= 2) {
            return `${parts[0]}-${parts[1]}`;
        }
        return null;
    };

    const [selectedMonth, setSelectedMonth] = useState<string | null>(() => getMonthFromDate(initialDate));
    const [selectedDate, setSelectedDate] = useState<string>(initialDate || '');
    const [selectedHour, setSelectedHour] = useState<string | null>(() => initialTime || null);
    const [selectedTime, setSelectedTime] = useState<string>(initialTime || '');
    const [availability, setAvailability] = useState<AvailabilityState | null>(null);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [availabilityError, setAvailabilityError] = useState<string | null>(null);
    const [dayOffSet, setDayOffSet] = useState<Set<number>>(new Set());
    const [businessTimezone, setBusinessTimezone] = useState<string>('America/Los_Angeles');

    const userTimezone = useMemo(() => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
            return null;
        }
    }, []);

    const getUtcOffsetMinutes = (timeZone: string, date: Date): number | null => {
        try {
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone,
                timeZoneName: 'shortOffset',
                year: 'numeric',
            }).formatToParts(date);

            const tzPart = parts.find((part) => part.type === 'timeZoneName')?.value;
            if (!tzPart) return null;

            const match = tzPart.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/i);
            if (!match) return null;

            const sign = match[1] === '-' ? -1 : 1;
            const hours = parseInt(match[2], 10);
            const minutes = match[3] ? parseInt(match[3], 10) : 0;
            return sign * (hours * 60 + minutes);
        } catch {
            return null;
        }
    };

    const parseTimeString = (timeStr: string) => {
        const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!match) return null;
        let hour = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3].toUpperCase();
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        return { hour, minutes };
    };

    const getTzShortName = (timeZone: string, date: Date): string | null => {
        try {
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone,
                timeZoneName: 'short',
                hour: '2-digit',
            }).formatToParts(date);
            return parts.find((part) => part.type === 'timeZoneName')?.value ?? null;
        } catch {
            return null;
        }
    };

    const selectedLocalTimeLabel = useMemo(() => {
        if (!selectedDate || !selectedTime || !userTimezone || !businessTimezone) return null;

        const parsed = parseTimeString(selectedTime);
        if (!parsed) return null;

        const [year, month, day] = selectedDate.split('-').map((value) => parseInt(value, 10));
        if (!year || !month || !day) return null;

        const utcCandidate = new Date(Date.UTC(year, month - 1, day, parsed.hour, parsed.minutes, 0));
        const businessOffset = getUtcOffsetMinutes(businessTimezone, utcCandidate);
        if (businessOffset === null) return null;

        const instant = new Date(utcCandidate.getTime() - businessOffset * 60 * 1000);

        const businessLabel = getTzShortName(businessTimezone, instant) ?? businessTimezone;
        const userLabel = getTzShortName(userTimezone, instant) ?? userTimezone;

        const localText = new Intl.DateTimeFormat('en-US', {
            timeZone: userTimezone,
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }).format(instant);

        return {
            localText,
            businessLabel,
            userLabel,
            instant,
        };
    }, [selectedDate, selectedTime, userTimezone, businessTimezone]);

    // Sync with parent when values change
    useEffect(() => {
        if (selectedDate !== initialDate) {
            onDateChange(selectedDate);
        }
    }, [selectedDate, initialDate, onDateChange]);

    useEffect(() => {
        if (selectedTime !== initialTime) {
            onTimeChange(selectedTime);
        }
    }, [selectedTime, initialTime, onTimeChange]);

    useEffect(() => {
        if (!selectedDate) {
            setAvailability(null);
            setAvailabilityError(null);
            return;
        }

        const controller = new AbortController();
        setAvailabilityLoading(true);
        setAvailabilityError(null);

        const params = new URLSearchParams({ date: selectedDate });
        serviceIds.forEach((id) => params.append('service_ids[]', String(id)));

        fetch(`/api/appointments/availability?${params.toString()}`, { signal: controller.signal })
            .then(async (response) => {
                if (!response.ok) {
                    const payload = await response.json().catch(() => null);
                    const message = payload?.message ?? 'Failed to load availability';
                    throw new Error(message);
                }
                return response.json();
            })
            .then((payload) => {
                const data = payload?.data ?? {};
                setAvailability({
                    availableHours: Array.isArray(data.available_hours) ? data.available_hours : [],
                    bookedTimes: Array.isArray(data.booked_times) ? data.booked_times : [],
                    unavailableHours: Array.isArray(data.unavailable_hours) ? data.unavailable_hours : [],
                    serverTime: data.server_time ?? '',
                });
                console.log('[AppointmentDatePicker] Availability payload:', {
                    date: selectedDate,
                    serviceIds,
                    availableHours: data.available_hours ?? [],
                    bookedTimes: data.booked_times ?? [],
                    unavailableHours: data.unavailable_hours ?? [],
                });
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    setAvailabilityError(error.message ?? 'Failed to load availability');
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setAvailabilityLoading(false);
                }
            });

        return () => controller.abort();
    }, [selectedDate, serviceIds]);

    useEffect(() => {
        const controller = new AbortController();

        fetch('/api/settings', { signal: controller.signal })
            .then(async (response) => {
                if (!response.ok) {
                    const payload = await response.json().catch(() => null);
                    const message = payload?.message ?? 'Failed to load settings';
                    throw new Error(message);
                }
                return response.json();
            })
            .then((payload) => {
                const entries = Array.isArray(payload?.settings?.working_hours) ? (payload.settings.working_hours as WorkingHourEntry[]) : [];
                const tz =
                    typeof payload?.settings?.timezone === 'string' && payload.settings.timezone ? payload.settings.timezone : 'America/Los_Angeles';
                setBusinessTimezone(tz);
                const dayIndexMap: Record<string, number> = {
                    sunday: 0,
                    monday: 1,
                    tuesday: 2,
                    wednesday: 3,
                    thursday: 4,
                    friday: 5,
                    saturday: 6,
                };

                const offDays = new Set<number>([0, 1, 2, 3, 4, 5, 6]);
                entries.forEach((entry) => {
                    if (!entry?.day || dayIndexMap[entry.day] === undefined) {
                        return;
                    }

                    const index = dayIndexMap[entry.day];
                    if (entry.is_day_off) {
                        offDays.add(index);
                    } else {
                        offDays.delete(index);
                    }
                });
                setDayOffSet(offDays);
            })
            .catch(() => {
                // Ignore settings fetch errors; show all days by default.
            });

        return () => controller.abort();
    }, []);

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
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const [year, month] = selectedMonth.split('-').map(Number);
        const lastDay = new Date(year, month, 0);

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month - 1, day);
            // Skip past dates
            if (date >= startOfToday && !dayOffSet.has(date.getDay())) {
                const value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const label = date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                });
                dates.push({ value, label });
            }
        }
        return dates;
    }, [selectedMonth, dayOffSet]);

    const normalizeTimeLabel = useCallback((timeStr: string) => {
        const parsed = parseTimeString(timeStr);
        if (!parsed) return timeStr.trim();
        const displayHour = parsed.hour === 0 ? 12 : parsed.hour > 12 ? parsed.hour - 12 : parsed.hour;
        const period = parsed.hour >= 12 ? 'PM' : 'AM';
        return `${displayHour}:${String(parsed.minutes).padStart(2, '0')} ${period}`;
    }, []);

    const availableHours = useMemo(() => {
        if (!availability?.availableHours) {
            return [] as { value: string; label: string; disabled: boolean }[];
        }

        const unavailable = new Set((availability?.unavailableHours ?? []).map((hour) => normalizeTimeLabel(hour)));

        return availability.availableHours.map((hour) => {
            const normalizedHour = normalizeTimeLabel(hour);
            return {
                value: normalizedHour,
                label: normalizedHour,
                disabled: unavailable.has(normalizedHour),
            };
        });
    }, [availability?.availableHours, availability?.unavailableHours, normalizeTimeLabel]);

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
        if (availability) {
            console.log('[AppointmentDatePicker] Hour selected:', {
                date: selectedDate,
                hour: hourValue,
                serviceIds,
                unavailableHours: availability.unavailableHours,
                availableHours: availability.availableHours,
            });
        }
        setSelectedHour(hourValue);
        setSelectedTime(hourValue);
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

    useEffect(() => {
        if (!selectedHour || availableHours.length === 0) return;
        const selected = availableHours.find((hour) => hour.value === selectedHour);
        if (!selected || selected.disabled) {
            setSelectedHour(null);
            setSelectedTime('');
        }
    }, [availableHours, selectedHour]);

    const selectedMonthLabel = availableMonths.find((m) => m.value === selectedMonth)?.label;
    const selectedDateLabel = availableDates.find((d) => d.value === selectedDate)?.label;
    const selectedHourLabel = availableHours.find((h) => h.value === selectedHour)?.label;

    const preserveScrollPosition = (action: () => void) => {
        if (typeof window === 'undefined') {
            action();
            return;
        }

        const scrollY = window.scrollY;
        action();
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: scrollY });
        });
    };

    return (
        <div className="space-y-6" style={{ overflowAnchor: 'none' }}>
            {/* Month Selection */}
            <div className="space-y-3" style={{ overflowAnchor: 'none' }}>
                <label className="block text-sm font-medium text-gray-700">
                    {t.booking.appointment.selectMonth} <span className="text-red-500">{t.booking.appointment.required}</span>
                </label>

                {/* Collapsed Month Display */}
                {selectedMonth ? (
                    <div
                        onClick={() => preserveScrollPosition(handleChangeMonth)}
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
                                onClick={() => preserveScrollPosition(() => handleMonthSelect(month.value))}
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
                style={{ overflowAnchor: 'none' }}
            >
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        {t.booking.appointment.preferredDate} <span className="text-red-500">{t.booking.appointment.required}</span>
                    </label>

                    {/* Collapsed Date Display */}
                    {selectedDate ? (
                        <div
                            onClick={() => preserveScrollPosition(handleChangeDate)}
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
                                    onClick={() => preserveScrollPosition(() => handleDateSelect(date.value))}
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
                style={{ overflowAnchor: 'none' }}
            >
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        {t.booking.appointment.selectHour} <span className="text-red-500">{t.booking.appointment.required}</span>
                    </label>

                    {userTimezone && businessTimezone && userTimezone !== businessTimezone && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            <p className="font-medium">{t.booking.appointment.timezoneNote.replace('{timezone}', businessTimezone)}</p>
                            {selectedLocalTimeLabel && (
                                <p className="mt-1">
                                    {t.booking.appointment.yourLocalTime
                                        .replace('{time}', selectedLocalTimeLabel.localText)
                                        .replace('{label}', selectedLocalTimeLabel.userLabel)}
                                </p>
                            )}
                        </div>
                    )}

                    {availabilityLoading && <p className="text-sm text-gray-500">{t.booking.appointment.loadingHours}</p>}
                    {availabilityError && <p className="text-sm text-red-600">{availabilityError}</p>}

                    {/* Collapsed Hour Display */}
                    {selectedHour ? (
                        <div
                            onClick={() => preserveScrollPosition(() => setSelectedHour(null))}
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
                                    onClick={() => preserveScrollPosition(() => handleHourSelect(hour.value))}
                                    disabled={hour.disabled}
                                    className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                                        hour.disabled
                                            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                                            : 'cursor-pointer border-gray-300 text-gray-700 hover:border-green-300 hover:bg-green-50'
                                    }`}
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
