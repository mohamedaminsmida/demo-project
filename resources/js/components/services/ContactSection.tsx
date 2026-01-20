import { usePage } from '@inertiajs/react';

import contactBackground from '../../../images/contact_background.jpg';
import contactUpperBackground from '../../../images/contact_upper_background.png';
import infoPanelBackground from '../../../images/Rectangle.png';
import { useLocale } from '../../locales/LocaleProvider';
import SectionContainer from '../layout/SectionContainer';
import { FormField, Input, Select, TextArea } from '../ui';

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a1.5 1.5 0 001.5-1.5v-2.571a1.5 1.5 0 00-1.178-1.47l-3.03-.757a1.5 1.5 0 00-1.757.87l-.558 1.305a11.96 11.96 0 01-6.17-6.17l1.305-.558a1.5 1.5 0 00.87-1.757l-.757-3.03A1.5 1.5 0 008.321 3.75H5.75a1.5 1.5 0 00-1.5 1.5z"
        />
    </svg>
);

const EnvelopeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5l9 6 9-6" />
        <rect x="3" y="4.5" width="18" height="15" rx="2" />
    </svg>
);

const MapPinIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4-4 6-7.5 6-10.5a6 6 0 10-12 0C6 13.5 8 17 12 21z" />
        <circle cx="12" cy="10.5" r="2" />
    </svg>
);

const contactDetails = [
    {
        icon: PhoneIcon,
        label: 'Call Us',
        value: '(555) 123-4567',
        href: 'tel:5551234567',
    },
    {
        icon: EnvelopeIcon,
        label: 'Email',
        value: 'hello@luqueatelier.com',
        href: 'mailto:hello@luqueatelier.com',
    },
    {
        icon: MapPinIcon,
        label: 'Visit',
        value: '1234 Gold Street, Montreal, QC',
        href: 'https://maps.google.com/?q=1234+Gold+Street+Montreal+QC',
    },
];

type SettingWorkingHour = {
    day: string;
    open?: string;
    close?: string;
    is_day_off?: boolean;
};

export default function ContactSection() {
    const { content: localeContent } = useLocale();
    const { props } = usePage();
    const contactContent = localeContent.contactSection;
    const settings = (
        props as {
            settings?: {
                footer_phone?: string;
                footer_email?: string;
                footer_address?: string;
                working_hours?: SettingWorkingHour[];
            };
        }
    ).settings;

    const formatTime = (time?: string) => {
        if (!time) return '';
        const [hourStr, minuteStr = '00'] = time.split(':');
        const hours = Number(hourStr);
        if (Number.isNaN(hours)) return time;
        const period = hours >= 12 ? 'PM' : 'AM';
        const normalized = ((hours + 11) % 12) + 1;
        return `${normalized}:${minuteStr} ${period}`;
    };

    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayAbbrevMap: Record<string, string> = contactContent.hours.dayAbbrev;
    const closedLabel = contactContent.hours.closedLabel;

    const workingHoursFromSettings = Array.isArray(settings?.working_hours)
        ? settings.working_hours
              .filter((entry): entry is SettingWorkingHour => Boolean(entry?.day))
              .sort((a, b) => {
                  const aIndex = dayOrder.indexOf(a.day.toLowerCase());
                  const bIndex = dayOrder.indexOf(b.day.toLowerCase());
                  return (aIndex === -1 ? dayOrder.length : aIndex) - (bIndex === -1 ? dayOrder.length : bIndex);
              })
              .map((entry) => {
                  const dayKey = entry.day.toLowerCase();
                  const label = dayAbbrevMap[dayKey] ?? dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
                  const hasHours = !entry.is_day_off && entry.open && entry.close;
                  const value = hasHours ? `${formatTime(entry.open)} – ${formatTime(entry.close)}` : contactContent.hours.closedLabel;
                  return { dayKey, label, value };
              })
        : [];

    const groupedWorkingHours = (() => {
        if (workingHoursFromSettings.length === 0) return [];
        const groups: { startLabel: string; endLabel: string; value: string; startDay: string; endDay: string }[] = [];
        let current: { startLabel: string; endLabel: string; value: string; startDay: string; endDay: string } | null = null;

        workingHoursFromSettings.forEach((entry) => {
            const dayIdx = dayOrder.indexOf(entry.dayKey);
            if (
                current &&
                entry.value === current.value &&
                dayIdx !== -1 &&
                dayOrder.indexOf(current.endDay) !== -1 &&
                dayIdx === dayOrder.indexOf(current.endDay) + 1
            ) {
                current.endDay = entry.dayKey;
                current.endLabel = entry.label;
            } else {
                if (current) groups.push(current);
                current = {
                    startDay: entry.dayKey,
                    endDay: entry.dayKey,
                    startLabel: entry.label,
                    endLabel: entry.label,
                    value: entry.value,
                };
            }
        });
        if (current) groups.push(current);
        return groups.map((group) => ({
            label: group.startDay === group.endDay ? group.startLabel : `${group.startLabel}–${group.endLabel}`,
            value: group.value,
        }));
    })();

    return (
        <>
            <section
                className="relative z-0 bg-cover bg-center bg-no-repeat pt-24 pb-44 text-slate-800"
                style={{ backgroundImage: `url(${contactUpperBackground})` }}
            >
                <SectionContainer>
                    <div className="max-w-8xl space-y-4">
                        <h2 className="font-sans text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight font-bold tracking-wide text-slate-900 uppercase lg:text-[clamp(1.8rem,4vw,2.8rem)]">
                            {contactContent.title}
                        </h2>
                        <p className="text-base leading-relaxed font-medium text-slate-700 sm:text-lg sm:leading-8">{contactContent.description}</p>
                    </div>
                </SectionContainer>
            </section>
            <section
                className="relative z-10 bg-cover bg-center bg-no-repeat py-16 text-white"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.9)), url(${contactBackground})` }}
            >
                <SectionContainer className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                    <div
                        className="relative z-20 -mt-14 min-h-[520px] overflow-hidden rounded-t-3xl bg-cover bg-center shadow-2xl sm:-mt-22 lg:-mt-30 lg:min-h-[620px]"
                        style={{ backgroundImage: `url(${infoPanelBackground})` }}
                    >
                        <div className="relative z-10 space-y-7 p-7 text-white">
                            <h2 className="font-sans text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight font-bold tracking-wide text-white uppercase lg:text-[clamp(1.8rem,4vw,2.4rem)]">
                                {contactContent.panelTitle}
                            </h2>
                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="text-white [&>svg]:h-8 [&>svg]:w-8">
                                        <MapPinIcon />
                                    </span>
                                    <h3 className="font-sans text-base font-bold tracking-[0.18em] text-white uppercase lg:text-xl">
                                        {contactContent.info.location}
                                    </h3>
                                </div>
                                <p className="text-base text-white/90 lg:text-xl">{settings?.footer_address || '332 Fair St, Centralia, WA 98531'}</p>
                            </div>

                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="text-white [&>svg]:h-8 [&>svg]:w-8">
                                        <PhoneIcon />
                                    </span>
                                    <h3 className="font-sans text-base font-bold tracking-[0.18em] text-white uppercase lg:text-xl">
                                        {contactContent.info.phone}
                                    </h3>
                                </div>
                                <a
                                    href={`tel:${settings?.footer_phone || '+13607368313'}`}
                                    className="text-base text-white/90 transition hover:text-[#0f9f68] lg:text-xl"
                                >
                                    {settings?.footer_phone || '+1 360-736-8313'}
                                </a>
                            </div>

                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="text-white [&>svg]:h-8 [&>svg]:w-8">
                                        <EnvelopeIcon />
                                    </span>
                                    <h3 className="font-sans text-base font-bold tracking-[0.18em] text-white uppercase lg:text-xl">
                                        {contactContent.info.email}
                                    </h3>
                                </div>
                                <a
                                    href={`mailto:${settings?.footer_email || 'info@luquetires.com'}`}
                                    className="text-base text-white/90 transition hover:text-[#0f9f68] lg:text-xl"
                                >
                                    {settings?.footer_email || 'info@luquetires.com'}
                                </a>
                            </div>

                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-white">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v6l4 2" />
                                    </svg>
                                    <h3 className="font-sans text-base font-bold tracking-[0.18em] text-white uppercase lg:text-xl">
                                        {contactContent.hours.title}
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    {groupedWorkingHours.map((entry, idx) => (
                                        <div key={idx} className="flex justify-between text-base lg:text-xl">
                                            <span className="text-white/85">{entry.label}:</span>
                                            <span className="font-semibold text-white">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/15 bg-black/40 p-8 text-white backdrop-blur-sm">
                        <form className="mt-6 grid gap-5 sm:grid-cols-2">
                            <FormField label={contactContent.form.nameLabel} required labelClassName="text-white/80 text-base lg:text-lg">
                                <Input
                                    placeholder={contactContent.form.namePlaceholder}
                                    isRequired
                                    inputClassName="bg-white/5 border-white/25 text-white placeholder:text-white/60 text-base px-5 py-3 focus:border-[#0f9f68] focus:ring-[#0f9f68]/20"
                                />
                            </FormField>
                            <FormField label={contactContent.form.emailLabel} required labelClassName="text-white/80 text-base lg:text-lg">
                                <Input
                                    type="email"
                                    placeholder={contactContent.form.emailPlaceholder}
                                    isRequired
                                    inputClassName="bg-white/5 border-white/25 text-white placeholder:text-white/60 text-base px-5 py-3 focus:border-[#0f9f68] focus:ring-[#0f9f68]/20"
                                />
                            </FormField>
                            <div className="sm:col-span-2">
                                <FormField label={contactContent.form.phoneLabel} required labelClassName="text-white/80 text-base lg:text-lg">
                                    <Input
                                        type="tel"
                                        placeholder={contactContent.form.phonePlaceholder}
                                        isRequired
                                        inputClassName="bg-white/5 border-white/25 text-white placeholder:text-white/60 text-base px-5 py-3 focus:border-[#0f9f68] focus:ring-[#0f9f68]/20"
                                    />
                                </FormField>
                            </div>
                            <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
                                <FormField label={contactContent.form.serviceLabel} required labelClassName="text-white/80 text-base lg:text-lg">
                                    <Select
                                        options={[...contactContent.form.serviceOptions]}
                                        placeholder={contactContent.form.servicePlaceholder}
                                        required
                                        buttonClassName="bg-white/5 border-white/25 text-white text-base px-5 py-3 hover:border-white/40"
                                    />
                                </FormField>
                                <FormField label={contactContent.form.vehicleLabel} required labelClassName="text-white/80 text-base lg:text-lg">
                                    <Select
                                        options={[...contactContent.form.vehicleOptions]}
                                        placeholder={contactContent.form.vehiclePlaceholder}
                                        required
                                        buttonClassName="bg-white/5 border-white/25 text-white text-base px-5 py-3 hover:border-white/40"
                                    />
                                </FormField>
                            </div>
                            <div className="sm:col-span-2">
                                <FormField label={contactContent.form.messageLabel} required labelClassName="text-white/80 text-base lg:text-lg">
                                    <TextArea
                                        rows={4}
                                        placeholder={contactContent.form.messagePlaceholder}
                                        isRequired
                                        textareaClassName="bg-white/5 border-white/25 text-white placeholder:text-white/60 text-base px-5 py-3 focus:border-[#0f9f68] focus:ring-[#0f9f68]/20"
                                    />
                                </FormField>
                            </div>
                            <div className="sm:col-span-2">
                                <button
                                    type="button"
                                    className="w-full cursor-pointer rounded-full bg-[#0f9f68] px-6 py-3 font-semibold text-white transition hover:bg-red-800"
                                >
                                    {contactContent.form.submitLabel}
                                </button>
                            </div>
                        </form>
                    </div>
                </SectionContainer>
            </section>
        </>
    );
}
