import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { LocaleProvider } from '../../locales/LocaleProvider';
import Footer from './Footer';
import Header from './Header';

type LayoutProps = PropsWithChildren<{
    background?: ReactNode;
    boxed?: boolean;
    backgroundColorClass?: string;
    contentBackgroundClass?: string;
    showFooter?: boolean;
}>;

export default function Layout({
    children,
    background,
    boxed = true,
    backgroundColorClass = 'bg-[#050505]',
    contentBackgroundClass = 'bg-white',
    showFooter = true,
}: LayoutProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => setIsMounted(true), 50);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <LocaleProvider>
            <div className={`min-h-screen ${backgroundColorClass} text-slate-900`}>
                {background && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                        {background}
                    </div>
                )}
                <div className="relative flex min-h-screen flex-col">
                    <Header />

                    <main
                        className={`w-full flex-1 transition-opacity duration-500 ease-out ${
                            boxed ? 'mx-auto max-w-6xl px-2 py-12 sm:px-4' : ''
                        } ${isMounted ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {boxed ? (
                            <div
                                className={`rounded-2xl border border-white/80 ${contentBackgroundClass} p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-6`}
                            >
                                {isMounted ? (
                                    children
                                ) : (
                                    <div className="space-y-4">
                                        <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
                                        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                                        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                                    </div>
                                )}
                            </div>
                        ) : isMounted ? (
                            children
                        ) : (
                            <div className="mx-auto my-12 h-64 w-full max-w-4xl animate-pulse rounded-none bg-white/70" />
                        )}
                    </main>

                    {showFooter ? <Footer /> : null}
                </div>
            </div>
        </LocaleProvider>
    );
}
