import { useCallback } from 'react';

import { useLocale } from '../../locales/LocaleProvider';
import type { AppointmentInfo } from '../../types/booking';
import AppointmentDatePicker from './AppointmentDatePicker';

interface AppointmentStepProps {
    appointment: AppointmentInfo;
    onChange: (appointment: AppointmentInfo) => void;
    selectedServiceIds: number[];
}

export default function AppointmentStep({ appointment, onChange, selectedServiceIds }: AppointmentStepProps) {
    const { content: t } = useLocale();

    const handleDateChange = useCallback(
        (date: string) => {
            onChange({ ...appointment, date });
        },
        [appointment, onChange],
    );

    const handleTimeChange = useCallback(
        (time: string) => {
            onChange({ ...appointment, time });
        },
        [appointment, onChange],
    );

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 sm:text-2xl">{t.booking.appointment.title}</h3>
            <AppointmentDatePicker
                selectedDate={appointment.date}
                selectedTime={appointment.time}
                serviceIds={selectedServiceIds}
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
            />
        </div>
    );
}
