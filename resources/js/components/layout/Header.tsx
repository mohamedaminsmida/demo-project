import { usePage } from '@inertiajs/react';

import logoImage from '../../../images/logo.png';
import { locales } from '../../locales';
import { useLocale } from '../../locales/LocaleProvider';
import LanguageSelector from './LanguageSelector';
import PageLoaderBar from './PageLoaderBar';

export default function Header() {
    const { content: localeContent, setLocale } = useLocale();
    usePage();

    return (
        <header className="z-40 w-full bg-transparent px-4 py-0.5 text-white md:px-6 md:py-1">
            <PageLoaderBar />
            <div className="mx-auto w-full max-w-none px-2 py-0.5 text-white md:max-w-5xl md:px-0 md:py-1">
                {/* Mobile: back button left, logo centered, language switcher right */}
                <div className="relative flex min-h-[3.5rem] items-center justify-between gap-3 md:hidden">
                    <button
                        type="button"
                        className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-green-700 shadow-sm backdrop-blur-sm transition hover:bg-white/15"
                        onClick={() => {
                            if (typeof window !== 'undefined' && window.history.length > 1) {
                                window.history.back();
                            }
                        }}
                        aria-label="Go back"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                            <path
                                d="M19 12H5M5 12L12 5M5 12L12 19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <a href="https://luquetires.com/" className="pointer-events-auto absolute top-1 left-1/2 -ml-2 -translate-x-1/2 md:-ml-0">
                        <img src={logoImage} alt="Luque Atelier logo" className="h-16 w-auto object-contain" />
                    </a>

                    <div>
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

                {/* Desktop: back button left, logo centered, language selector right */}
                <div className="relative hidden min-h-[4rem] items-center justify-between md:flex">
                    <button
                        type="button"
                        className="flex h-11 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-green-700 shadow-sm backdrop-blur-sm transition hover:bg-white/15"
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                window.location.href = 'https://luquetires.com/';
                            }
                        }}
                        aria-label="Go back"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                            <path
                                d="M19 12H5M5 12L12 5M5 12L12 19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <a href="https://luquetires.com/" className="pointer-events-auto absolute top-1 left-1/2 -translate-x-1/2">
                        <img src={logoImage} alt="Luque Atelier logo" className="h-16 w-auto object-contain sm:h-22 lg:h-26" />
                    </a>

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
