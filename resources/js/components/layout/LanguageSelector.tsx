import type { MouseEvent } from 'react';

import type { LocaleCode } from '../../locales';

type LanguageOption = {
    code: LocaleCode;
    name: string;
    flag: string;
};

type LanguageSelectorProps = {
    current: LanguageOption;
    options: LanguageOption[];
    onSelect: (code: LocaleCode) => void;
};

export default function LanguageSelector({ current, options, onSelect }: LanguageSelectorProps) {
    const handleSelect = (code: LocaleCode, event: MouseEvent<HTMLButtonElement>) => {
        onSelect(code);
        const details = event.currentTarget.closest('details');
        details?.removeAttribute('open');
    };

    return (
        <details className="group relative">
            <summary className="inline-flex cursor-pointer list-none items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-slate-800 uppercase transition hover:border-slate-300 md:text-xs">
                <span className="text-sm leading-none">{current.flag}</span>
                <span>{current.code}</span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M3 5L6 8L9 5" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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
                        <span className="text-base">{option.flag}</span>
                        <span className="text-slate-700 normal-case">{option.name}</span>
                    </button>
                ))}
            </div>
        </details>
    );
}
