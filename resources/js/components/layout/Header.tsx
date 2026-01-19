import { Fragment, useMemo, useState } from 'react';

import { Link, usePage } from '@inertiajs/react';

import logoImage from '../../../images/logo.png';
import burgerIcon from '../../../images/svg/header/burger.svg';
import { locales } from '../../locales';
import { useLocale } from '../../locales/LocaleProvider';
import LanguageSelector from './LanguageSelector';
import PageLoaderBar from './PageLoaderBar';

export default function Header() {
    const { content: localeContent, setLocale } = useLocale();
    const { url } = usePage();
    const pathname = url.split('?')[0];
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <PageLoaderBar />
            <div className="mx-auto w-full max-w-5xl px-2 py-0.5 text-white md:px-6 md:py-1">
                {/* Mobile: burger at start, logo centered, language switcher at end */}
                <div className="relative flex min-h-[3.5rem] items-center justify-between gap-3 md:hidden">
                    <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <img src={burgerIcon} alt="Open menu" className="h-7 w-7 brightness-0 invert" />
                    </button>

                    <Link href="/" className="absolute top-1 left-1/2 -translate-x-1/2">
                        <img src={logoImage} alt="Luque Atelier logo" className="h-16 w-auto object-contain" />
                    </Link>

                    <div className="ml-auto">
                        <LanguageSelector
                            current={{ code: localeContent.code, name: localeContent.name, flag: localeContent.flag }}
                            options={Object.values(locales).map((locale) => ({
                                code: locale.code,
                                name: locale.name,
                                flag: locale.flag,
                            }))}
                            onSelect={setLocale}
                            className="origin-right scale-90"
                        />
                    </div>
                </div>

                {/* Desktop: logo left, nav middle, language selector right */}
                <div className="hidden flex-wrap items-center justify-between gap-5 text-sm font-medium text-white md:flex md:text-base">
                    <div className="flex -translate-y-1 items-center gap-2.5">
                        <Link href="/">
                            <img src={logoImage} alt="Luque Atelier logo" className="h-16 w-auto object-contain sm:h-22 lg:h-26" />
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-white md:gap-7 md:text-base">
                        <nav className="flex items-center gap-5">
                            {navLinks.map((link, index) => {
                                const baseClass =
                                    pathname === link.href ? 'font-semibold text-[#a40d0d]' : 'text-white transition hover:text-[#a40d0d]/80';

                                return (
                                    <Fragment key={link.label}>
                                        <Link href={link.href} className={baseClass}>
                                            {link.label}
                                        </Link>
                                        {index !== navLinks.length - 1 && <span className="h-4 w-px bg-white/30" aria-hidden />}
                                    </Fragment>
                                );
                            })}
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
            </div>

            {/* Mobile sidebar overlay */}
            <div className={`fixed inset-0 z-50 transition ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!isMenuOpen}>
                {/* Dark overlay to close menu on click */}
                <button
                    type="button"
                    className={`absolute inset-0 bg-black/70 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                />
                {/* Sliding drawer with nav links */}
                <aside
                    className={`absolute top-0 left-0 flex h-full w-72 flex-col gap-8 bg-[#2b2b2b] px-6 py-6 shadow-2xl transition-transform duration-300 ${
                        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <img src={logoImage} alt="Luque Atelier logo" className="h-16 w-auto" />
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-2xl text-white"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            ×
                        </button>
                    </div>

                    <nav className="flex flex-col gap-6 text-base font-medium">
                        {navLinks.map((link) => {
                            const baseClass = link.isActive ? 'font-semibold text-[#a40d0d]' : 'text-white transition hover:text-[#a40d0d]/80';

                            return (
                                <Link key={link.label} href={link.href} className={baseClass} onClick={() => setIsMenuOpen(false)}>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
            </div>
        </header>
    );
}
