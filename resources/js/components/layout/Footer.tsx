import logoBlack from '../../../images/logo_black.png';

const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About us', href: '#about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact us', href: '#contact' },
];

const workingHours = [
    { label: 'Mon–Fri', value: '9:00 AM – 6:00 PM' },
    { label: 'Sat', value: '9:00 AM – 5:00 PM' },
    { label: 'Sun', value: 'Closed' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 bg-white text-slate-900">
            <div className="mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 lg:px-10">
                <div className="grid gap-4 border-b border-slate-200 pb-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
                    <div className="space-y-6">
                        <img src={logoBlack} alt="Luque Tires" className="h-20 w-auto object-contain lg:h-24" />
                        <p className="text-sm leading-relaxed text-slate-900">
                            Luque Tires began as a small, family-run shop with one simple goal: to keep our neighbors safe on the road. Founded on
                            trust, honesty, and hard work, we quickly became more than just a place to buy tires—we became part of the community.
                        </p>
                    </div>

                    <div className="space-y-6 text-sm">
                        <p className="text-xs font-semibold tracking-[0.2em] text-slate-900 uppercase">Contact info</p>
                        <ul className="space-y-1">
                            <li>+1 360-736-8313</li>
                            <li>
                                <a href="mailto:info@luquetires.com" className="hover:text-red-600">
                                    info@luquetires.com
                                </a>
                            </li>
                            <li>332 Fair St, Centralia, WA 98531</li>
                        </ul>
                        <div className="flex items-center gap-3">
                            <a href="https://facebook.com" className="text-slate-500 transition hover:text-red-600" aria-label="Facebook">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300">F</span>
                            </a>
                            <a href="https://instagram.com" className="text-slate-500 transition hover:text-red-600" aria-label="Instagram">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300">I</span>
                            </a>
                        </div>
                        <button type="button" className="rounded-full border border-slate-300 px-4 py-1 text-xs font-semibold uppercase">
                            (EN/ES)
                        </button>
                    </div>

                    <div className="space-y-6 text-sm">
                        <p className="text-xs font-semibold tracking-[0.2em] text-slate-900 uppercase">Quick Links</p>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="hover:text-red-600">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6 text-sm">
                        <p className="text-xs font-semibold tracking-[0.2em] text-slate-900 uppercase">Working Hours</p>
                        <ul className="space-y-1">
                            {workingHours.map((item) => (
                                <li key={item.label} className="flex items-center justify-between gap-4 text-slate-700">
                                    <span>{item.label}</span>
                                    <span className="font-medium text-slate-900">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-slate-900 sm:flex-row">
                    <p>Privacy Policy – © {currentYear} Luque Tires</p>
                    <a href="#privacy" className="text-slate-900 hover:text-red-600">
                        Privacy Policy
                    </a>
                </div>
            </div>
        </footer>
    );
}
