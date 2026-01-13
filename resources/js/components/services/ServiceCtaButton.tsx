import clsx from 'clsx';
import type { MouseEvent } from 'react';

import { useLocale } from '../../locales/LocaleProvider';

type ServiceCtaButtonProps = {
    label?: string;
    href?: string;
    className?: string;
    variant?: 'default' | 'filled';
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function ServiceCtaButton({
    label: overrideLabel,
    href = '#tires-section',
    className,
    variant = 'default',
    onClick,
}: ServiceCtaButtonProps) {
    const { content } = useLocale();
    const label = overrideLabel ?? content?.cta?.serviceButton ?? 'Explore tire services';

    const baseClasses =
        variant === 'filled'
            ? 'inline-flex cursor-pointer items-center justify-center rounded-full bg-green-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-red-800'
            : 'inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 shadow-[0_15px_30px_rgba(0,0,0,0.25)] transition-colors duration-500 ease-out hover:bg-green-800 hover:text-white';

    return (
        <a
            href={href}
            className={clsx(baseClasses, className)}
            onClick={(event) => {
                if (onClick) {
                    onClick(event);
                }
            }}
        >
            {label}
        </a>
    );
}
