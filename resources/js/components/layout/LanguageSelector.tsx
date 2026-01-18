import type { MouseEvent } from 'react';

import type { LocaleCode } from '../../locales';

import globeIcon from '../../../images/svg/header/globe.svg';

type LanguageOption = {
    code: LocaleCode;
    name: string;
    flag: string;
};

type LanguageSelectorProps = {
    current: LanguageOption;
    options: LanguageOption[];
    onSelect: (code: LocaleCode) => void;
    className?: string;
};

export default function LanguageSelector({ current, options, onSelect, className }: LanguageSelectorProps) {
    const handleSelect = (code: LocaleCode, event: MouseEvent<HTMLButtonElement>) => {
        onSelect(code);
        const details = event.currentTarget.closest('details');
        details?.removeAttribute('open');
    };

    return (
        <details className={`group relative ${className ?? ''}`}>
            <summary className="inline-flex cursor-pointer list-none items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tracking-[0.15em] text-slate-800 uppercase transition hover:border-slate-300 md:text-sm">
                <span className="flex items-center gap-1.5">
                    <img src={globeIcon} alt="Languages" className="h-4 w-4" />
                    <span className="text-sm md:text-base">{current.code}</span>
                </span>
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                    className="transition-transform duration-200 group-open:rotate-180"
                >
                    <path d="M3 5L6 8L9 5" stroke="#111" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </summary>
            <div className="pointer-events-none absolute top-11 right-0 z-10 min-w-[8rem] origin-top scale-95 rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-500 uppercase opacity-0 transition-all duration-200 ease-out group-open:pointer-events-auto group-open:scale-100 group-open:opacity-100">
                {options.map((option) => (
                    <button
                        key={option.code}
                        type="button"
                        onClick={(event) => handleSelect(option.code, event)}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <div className="flex flex-col text-left leading-tight">
                            <span className="text-base text-slate-700 normal-case md:text-sm">{option.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </details>
    );
}
