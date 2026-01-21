import { usePage } from '@inertiajs/react';

import logoBlack from '../../../images/logo_black.png';
import strivehawkLogo from '../../../images/Strivehawk.png';
import facebookIcon from '../../../images/svg/footer/facebook.svg';
import instagramIcon from '../../../images/svg/footer/instagram.svg';
import { useLocale } from '../../locales/LocaleProvider';

type SettingWorkingHour = {
    day: string;
    open?: string;
    close?: string;
    is_day_off?: boolean;
};

type WorkingHourDisplay = {
    dayKey: string;
    label: string;
    value: string;
};

export default function Footer() {
    const { content: localeContent } = useLocale();
    const { props } = usePage();
    const currentYear = new Date().getFullYear();
    const { footer } = localeContent;
    const workingHoursLocale = footer.workingHours as typeof footer.workingHours & {
        dayLabels?: Record<string, string>;
        closedLabel?: string;
    };
    const settings = (
        props as {
            settings?: {
                footer_description?: string;
                footer_phone?: string;
                footer_email?: string;
                footer_address?: string;
                footer_facebook?: string;
                footer_instagram?: string;
                working_hours?: SettingWorkingHour[];
            };
        }
    ).settings;
    const footerDescription = settings?.footer_description;
    const footerPhone = settings?.footer_phone || footer.contact.phone;
    const footerEmail = settings?.footer_email || footer.contact.email;
    const footerAddress = settings?.footer_address || footer.contact.address;
    const footerFacebook = settings?.footer_facebook;
    const footerInstagram = settings?.footer_instagram;

    const quickLinks = [
        { label: footer.quickLinks.items.home, href: '/' },
        { label: footer.quickLinks.items.about, href: '#about' },
        { label: footer.quickLinks.items.services, href: '/services' },
        { label: footer.quickLinks.items.contact, href: '#contact' },
    ];

    const formatTime = (time?: string) => {
        if (!time) return '';
        const [hourStr, minuteStr = '00'] = time.split(':');
        const hours = Number(hourStr);
        if (Number.isNaN(hours)) {
            return time;
        }
        const period = hours >= 12 ? 'PM' : 'AM';
        const normalized = ((hours + 11) % 12) + 1;
        return `${normalized}:${minuteStr} ${period}`;
    };

    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabelMap: Record<string, string> = workingHoursLocale.dayLabels ?? {};
    const dayAbbrevMap: Record<string, string> = {
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
        sunday: 'Sun',
    };
    const closedLabel = workingHoursLocale.closedLabel ?? 'Closed';

    const workingHoursFromSettings: WorkingHourDisplay[] = Array.isArray(settings?.working_hours)
        ? settings.working_hours
              .filter((entry): entry is SettingWorkingHour => Boolean(entry?.day))
              .sort((a, b) => {
                  const aIndex = dayOrder.indexOf(a.day.toLowerCase());
                  const bIndex = dayOrder.indexOf(b.day.toLowerCase());
                  return (aIndex === -1 ? dayOrder.length : aIndex) - (bIndex === -1 ? dayOrder.length : bIndex);
              })
              .map((entry) => {
                  const dayKey = entry.day.toLowerCase();
                  const fullLabel = dayLabelMap[dayKey] ?? dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
                  const label = dayAbbrevMap[dayKey] ?? fullLabel;
                  const hasHours = !entry.is_day_off && entry.open && entry.close;
                  const value = hasHours ? `${formatTime(entry.open)} – ${formatTime(entry.close)}` : closedLabel;
                  return { dayKey, label, value };
              })
        : [];

    const groupedWorkingHours = (() => {
        if (workingHoursFromSettings.length === 0) {
            return null;
        }

        const groups: { startDay: string; endDay: string; startLabel: string; endLabel: string; value: string }[] = [];
        let current: { startDay: string; endDay: string; startLabel: string; endLabel: string; value: string } | null = null;

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
                if (current) {
                    groups.push(current);
                }
                current = {
                    startDay: entry.dayKey,
                    endDay: entry.dayKey,
                    startLabel: entry.label,
                    endLabel: entry.label,
                    value: entry.value,
                };
            }
        });

        if (current) {
            groups.push(current);
        }

        return groups.map((group) => ({
            label: group.startDay === group.endDay ? group.startLabel : `${group.startLabel}–${group.endLabel}`,
            value: group.value,
        }));
    })();

    const workingHoursToRender = groupedWorkingHours ?? footer.workingHours.items;

    return (
        <footer className="border-t border-slate-200 bg-white text-slate-700">
            <div className="mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 lg:px-10">
                <div className="grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-2">
                    <div className="space-y-6">
                        <img src={logoBlack} alt="Luque Tires" className="-mt-2 h-24 w-auto object-contain lg:-mt-3 lg:h-28" />
                        <p className="text-sm leading-relaxed text-slate-700 lg:text-base">{footerDescription || footer.about}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-sm text-slate-700 sm:gap-8 md:grid-cols-3 md:gap-8 lg:gap-8 lg:text-base">
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-slate-800 lg:text-base">{footer.contact.title}</p>
                            <ul className="space-y-1">
                                <li>{footerPhone}</li>
                                <li>
                                    <a href={`mailto:${footerEmail}`} className="text-slate-700 hover:text-red-600">
                                        {footerEmail}
                                    </a>
                                </li>
                                <li>{footerAddress}</li>
                            </ul>
                            <div className="flex items-center gap-3">
                                {footerFacebook && (
                                    <a
                                        href={footerFacebook}
                                        className="text-slate-700 transition hover:text-red-600"
                                        aria-label="Facebook"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img src={facebookIcon} alt="Facebook" className="h-4 w-4 lg:h-5 lg:w-5" />
                                    </a>
                                )}
                                {footerInstagram && (
                                    <a
                                        href={footerInstagram}
                                        className="text-slate-700 transition hover:text-red-600"
                                        aria-label="Instagram"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img src={instagramIcon} alt="Instagram" className="h-4 w-4 lg:h-5 lg:w-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-slate-800 lg:text-base">{footer.quickLinks.title}</p>
                            <ul className="space-y-1">
                                {quickLinks.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-slate-700 hover:text-red-600">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4 md:-ml-10">
                            <p className="text-sm font-semibold text-slate-800 lg:text-base">{footer.workingHours.title}</p>
                            <ul className="space-y-1">
                                {workingHoursToRender.map((item) => (
                                    <li key={item.label} className="flex flex-col gap-1 text-slate-700 sm:flex-row sm:items-center sm:gap-4">
                                        <span className="whitespace-nowrap">{item.label}</span>
                                        <span className="font-medium whitespace-nowrap text-slate-800 sm:text-right">{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-slate-700 sm:flex-row lg:text-sm">
                    <p>{footer.privacy.line.replace('{year}', String(currentYear))}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-700 lg:text-sm">
                        <span>Powered by</span>
                        <img src={strivehawkLogo} alt="Strivehawk" className="h-6 w-auto" />
                    </div>
                    <a href="/privacy-policy" className="text-slate-700 hover:text-red-600">
                        {footer.privacy.link}
                    </a>
                </div>
            </div>
        </footer>
    );
}
