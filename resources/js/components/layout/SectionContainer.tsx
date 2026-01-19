import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

type SectionContainerProps = PropsWithChildren<{
    className?: string;
    fullWidth?: boolean;
}>;

export default function SectionContainer({ children, className, fullWidth = false }: SectionContainerProps) {
    const widthClass = fullWidth ? 'max-w-none' : 'max-w-[1360px]';

    return <div className={clsx('mx-auto w-full px-4 sm:px-6 lg:px-10', widthClass, className)}>{children}</div>;
}
