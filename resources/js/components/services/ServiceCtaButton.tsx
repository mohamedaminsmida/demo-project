import clsx from 'clsx';
import type { MouseEvent } from 'react';

import arrowIcon from '../../../images/svg/arrow.svg';

import { useLocale } from '../../locales/LocaleProvider';

type ServiceCtaButtonProps = {
    label?: string;
    href?: string;
    className?: string;
    variant?: 'default' | 'filled';
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    target?: string;
    rel?: string;
};

export default function ServiceCtaButton({
    label: overrideLabel,
    href = '#tires-section',
    className,
    variant = 'default',
    onClick,
    target,
    rel,
}: ServiceCtaButtonProps) {
    const { content } = useLocale();
    const label = overrideLabel ?? content?.cta?.serviceButton ?? 'Explore tire services';

    const baseClasses =
        variant === 'filled'
            ? 'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0f9f68] px-6 pr-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-800 hover:pr-9'
            : 'group inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-white px-6 pr-6 py-3 text-sm font-semibold text-zinc-900 shadow-[0_15px_30px_rgba(0,0,0,0.25)] transition-all duration-500 ease-out hover:bg-[#0f9f68] hover:text-white hover:pr-9';

    return (
        <a
            href={href}
            className={clsx(baseClasses, className)}
            target={target}
            rel={rel}
            onClick={(event) => {
                if (onClick) {
                    onClick(event);
                }
            }}
        >
            <span className="relative inline-flex items-center">
                <span>{label}</span>
                <span
                    aria-hidden
                    className="absolute -right-8 block h-5 w-5 text-white opacity-0 transition-all duration-200 ease-out group-hover:-right-6 group-hover:opacity-100"
                    style={{
                        WebkitMaskImage: `url(${arrowIcon})`,
                        maskImage: `url(${arrowIcon})`,
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        backgroundColor: 'currentColor',
                    }}
                />
            </span>
        </a>
    );
}
