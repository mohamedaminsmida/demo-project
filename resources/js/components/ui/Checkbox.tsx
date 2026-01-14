import { Checkbox as AriaCheckbox, type CheckboxProps as AriaCheckboxProps } from 'react-aria-components';
import { cx } from '../../utils/cn';

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'children'> {
    label: string;
}

export function Checkbox({ label, ...props }: CheckboxProps) {
    return (
        <AriaCheckbox
            {...props}
            className={cx(
                'group flex items-center gap-3 cursor-pointer',
                'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
        >
            {({ isSelected }) => (
                <>
                    <div
                        className={cx(
                            'flex h-5 w-5 items-center justify-center rounded border-2 transition-all',
                            'group-focus-visible:ring-2 group-focus-visible:ring-green-500/20 group-focus-visible:ring-offset-2',
                            isSelected
                                ? 'bg-green-600 border-green-600'
                                : 'bg-white border-gray-300 group-hover:border-gray-400',
                        )}
                    >
                        {isSelected && (
                            <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M10 3L4.5 8.5L2 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </div>
                    <span className="text-sm text-gray-700 select-none">{label}</span>
                </>
            )}
        </AriaCheckbox>
    );
}
