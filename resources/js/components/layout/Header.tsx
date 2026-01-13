import { Fragment, useEffect, useMemo, useState } from 'react';

import { Link, usePage } from '@inertiajs/react';

import { locales } from '../../locales';
import { useLocale } from '../../locales/LocaleProvider';
import LanguageSelector from './LanguageSelector';

export default function Header() {
    const { content: localeContent, currentCode, setLocale } = useLocale();
    const [isScrolled, setIsScrolled] = useState(false);
    const { url } = usePage();
    const pathname = url.split('?')[0];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 16);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = useMemo(
        () => [
            { label: localeContent.nav.home, href: '/', isActive: pathname === '/' },
            { label: localeContent.nav.about, href: '/about', isActive: pathname === '/about' },
            { label: localeContent.nav.services, href: '/services', isActive: pathname === '/services' },
            { label: localeContent.nav.contact, href: '/contact', isActive: pathname === '/contact' },
        ],
        [localeContent.nav, pathname],
    );

    return (
        <header className="z-40 w-full bg-transparent px-4 py-0.5 text-white md:px-6 md:py-1">
            <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 px-2 py-0.5 text-white md:gap-5 md:px-6 md:py-1">
                <div className="flex -translate-y-1 items-center gap-2.5">
                    <Link href="/">
                        <img src="/storage/images/logo.png" alt="Luque Atelier logo" className="h-15 w-auto object-contain sm:h-20 lg:h-24" />
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-white md:gap-7">
                    <nav className="flex items-center gap-4">
                        {navLinks.map((link, index) => (
                            <Fragment key={link.label}>
                                <Link
                                    href={link.href}
                                    onClick={(event) => event.preventDefault()}
                                    aria-disabled
                                    className={pathname === link.href ? 'font-semibold text-[#a40d0d]' : 'text-white/70 transition hover:text-white'}
                                >
                                    {link.label}
                                </Link>
                                {index !== navLinks.length - 1 && <span className="h-4 w-px bg-white/30" aria-hidden />}
                            </Fragment>
                        ))}
                    </nav>

                    <LanguageSelector
                        current={{ code: localeContent.code, name: localeContent.name, flag: localeContent.flag }}
                        options={Object.values(locales).map((locale) => ({
                            code: locale.code,
                            name: locale.name,
                            flag: locale.flag,
                        }))}
                        onSelect={setLocale}
                    />
                </div>
            </div>
        </header>
    );
}
