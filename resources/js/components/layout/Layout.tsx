import type { PropsWithChildren, ReactNode } from 'react';

import { LocaleProvider } from '../../locales/LocaleProvider';
import Footer from './Footer';
import Header from './Header';

type LayoutProps = PropsWithChildren<{
    background?: ReactNode;
    boxed?: boolean;
    backgroundColorClass?: string;
}>;

export default function Layout({ children, background, boxed = true, backgroundColorClass = 'bg-[#050505]' }: LayoutProps) {
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

                    <main className={`w-full flex-1 ${boxed ? 'mx-auto max-w-6xl px-4 py-12' : ''}`}>
                        {boxed ? (
                            <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">{children}</div>
                        ) : (
                            children
                        )}
                    </main>

                    <Footer />
                </div>
            </div>
        </LocaleProvider>
    );
}
