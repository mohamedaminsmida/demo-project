import { Fragment, useMemo } from 'react';

import { Link, usePage } from '@inertiajs/react';

import logoImage from '../../../images/logo.png';
import { locales } from '../../locales';
import { useLocale } from '../../locales/LocaleProvider';
import LanguageSelector from './LanguageSelector';
import PageLoaderBar from './PageLoaderBar';

export default function Header() {
    const { content: localeContent, setLocale } = useLocale();
    const { url } = usePage();
    const pathname = url.split('?')[0];

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
            <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-2 py-0.5 text-white md:gap-5 md:px-6 md:py-1">
                <div className="flex -translate-y-1 items-center gap-2.5">
                    <Link href="/">
                        <img src={logoImage} alt="Luque Atelier logo" className="h-16 w-auto object-contain sm:h-22 lg:h-26" />
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-white md:gap-7">
                    <nav className="flex items-center gap-4">
                        {navLinks.map((link, index) => {
                            const isDisabled = link.href === '/about' || link.href === '/contact';
                            const baseClass = pathname === link.href ? 'font-semibold text-[#a40d0d]' : 'text-white/70 transition hover:text-white';

                            return (
                                <Fragment key={link.label}>
                                    {isDisabled ? (
                                        <span className={`cursor-not-allowed text-white/40 ${pathname === link.href ? 'font-semibold' : ''}`}>
                                            {link.label}
                                        </span>
                                    ) : (
                                        <Link href={link.href} className={baseClass}>
                                            {link.label}
                                        </Link>
                                    )}
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
        </header>
    );
}
