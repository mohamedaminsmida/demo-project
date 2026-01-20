import { usePage } from '@inertiajs/react';

import contactBackground from '../../../images/contact_background.jpg';
import infoPanelBackground from '../../../images/Rectangle.png';
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

const SERVICE_OPTIONS = [
    { value: 'new-used-tires', label: 'New & Used Tires' },
    { value: 'mounting-balancing', label: 'Mounting & Balancing' },
    { value: 'repairs-valve', label: 'Repairs & Valve Replacement' },
    { value: 'same-day', label: 'Same-Day Service' },
    { value: 'not-sure', label: 'Not sure – please advise' },
];

const VEHICLE_TYPE_OPTIONS = [
    { value: 'car', label: 'Cars' },
    { value: 'light-truck', label: 'Light Trucks / SUVs' },
    { value: 'truck', label: 'Trucks' },
    { value: 'motorcycle', label: 'Motorcycles & Scooters' },
    { value: 'van', label: 'Vans & Minivans' },
    { value: 'other', label: 'Other' },
];

type SettingWorkingHour = {
    day: string;
    open?: string;
    close?: string;
    is_day_off?: boolean;
};

export default function ContactSection() {
    const { props } = usePage();
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
    const dayAbbrevMap: Record<string, string> = {
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
        sunday: 'Sun',
    };

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
                  const value = hasHours ? `${formatTime(entry.open)} – ${formatTime(entry.close)}` : 'Closed';
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
        <section
            className="bg-cover bg-center bg-no-repeat py-16 text-white"
            style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.9)), url(${contactBackground})` }}
        >
            <SectionContainer className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                <div className="relative min-h-[520px] overflow-hidden rounded-t-3xl lg:min-h-[620px]">
                    <img
                        src={infoPanelBackground}
                        alt="Contact info background"
                        className="h-full w-full rounded-t-3xl object-contain"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 space-y-6 p-6 text-white">
                        <div>
                            <h2 className="font-sans text-[clamp(1.8rem,4vw,2.8rem)] leading-tight font-bold lg:text-[clamp(2rem,4.2vw,3.2rem)]">
                                Get in touch
                            </h2>
                        </div>

                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="text-white">
                                    <MapPinIcon />
                                </span>
                                <h3 className="font-sans text-sm font-bold tracking-wider text-white uppercase lg:text-lg">Location</h3>
                            </div>
                            <p className="text-sm text-white/90 lg:text-lg">{settings?.footer_address || '332 Fair St, Centralia, WA 98531'}</p>
                        </div>

                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="text-white">
                                    <PhoneIcon />
                                </span>
                                <h3 className="font-sans text-sm font-bold tracking-wider text-white uppercase lg:text-lg">Phone</h3>
                            </div>
                            <a
                                href={`tel:${settings?.footer_phone || '+13607368313'}`}
                                className="text-sm text-white/90 transition hover:text-[#0f9f68] lg:text-lg"
                            >
                                {settings?.footer_phone || '+1 360-736-8313'}
                            </a>
                        </div>

                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="text-white">
                                    <EnvelopeIcon />
                                </span>
                                <h3 className="font-sans text-sm font-bold tracking-wider text-white uppercase lg:text-lg">Email</h3>
                            </div>
                            <a
                                href={`mailto:${settings?.footer_email || 'info@luquetires.com'}`}
                                className="text-sm text-white/90 transition hover:text-[#0f9f68] lg:text-lg"
                            >
                                {settings?.footer_email || 'info@luquetires.com'}
                            </a>
                        </div>

                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-white">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                                <h3 className="font-sans text-sm font-bold tracking-wider text-white uppercase lg:text-lg">Open Hours</h3>
                            </div>
                            <div className="space-y-1.5">
                                {groupedWorkingHours.map((entry, idx) => (
                                    <div key={idx} className="flex justify-between text-sm lg:text-lg">
                                        <span className="text-white/70">{entry.label}:</span>
                                        <span className="text-white/90">{entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/15 bg-black/40 p-8 text-white backdrop-blur-sm">
                    <form className="mt-6 grid gap-5 sm:grid-cols-2">
                        <FormField label="Name" required labelClassName="text-white/80">
                            <Input
                                placeholder="Full name"
                                isRequired
                                inputClassName="bg-white/5 border-white/25 text-white placeholder:text-white/60 text-base px-5 py-3 focus:border-[#0f9f68] focus:ring-[#0f9f68]/20"
                            />
                        </FormField>
                        <FormField label="Email" required labelClassName="text-white/80">
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                isRequired
                                inputClassName="bg-white/5 border-white/25 text-white placeholder:text-white/60 text-base px-5 py-3 focus:border-[#0f9f68] focus:ring-[#0f9f68]/20"
                            />
                        </FormField>
                        <FormField label="Phone" required labelClassName="text-white/80">
                            <Input
                                type="tel"
                                placeholder="(555) 123-4567"
                                isRequired
                                inputClassName="bg-white/5 border-white/25 text-white placeholder:text-white/60 text-base px-5 py-3 focus:border-[#0f9f68] focus:ring-[#0f9f68]/20"
                            />
                        </FormField>
                        <FormField label="Interested Service" required labelClassName="text-white/80">
                            <Select
                                options={SERVICE_OPTIONS}
                                placeholder="Select a service"
                                required
                                buttonClassName="bg-white/5 border-white/25 text-white text-base px-5 py-3 hover:border-white/40"
                            />
                        </FormField>
                        <FormField label="Vehicle Type" required labelClassName="text-white/80">
                            <Select
                                options={VEHICLE_TYPE_OPTIONS}
                                placeholder="Select vehicle type"
                                required
                                buttonClassName="bg-white/5 border-white/25 text-white text-base px-5 py-3 hover:border-white/40"
                            />
                        </FormField>
                        <div className="sm:col-span-2">
                            <FormField label="Message" required labelClassName="text-white/80">
                                <TextArea
                                    rows={4}
                                    placeholder="Tell us how we can help"
                                    isRequired
                                    textareaClassName="bg-white/5 border-white/25 text-white placeholder:text-white/60 text-base px-5 py-3 focus:border-[#0f9f68] focus:ring-[#0f9f68]/20"
                                />
                            </FormField>
                        </div>
                        <div className="sm:col-span-2">
                            <button
                                type="button"
                                className="w-full rounded-full bg-[#0f9f68] px-6 py-3 font-semibold text-white transition hover:bg-red-800"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </SectionContainer>
        </section>
    );
}
