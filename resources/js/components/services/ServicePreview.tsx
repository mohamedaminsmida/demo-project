import type { ReactNode } from 'react';

export type ServicePreviewFeature = {
    label: string;
    description?: string;
    highlighted?: boolean;
};

export type ServicePreviewProps = {
    title: string;
    subtitle?: string;
    primaryImage: string;
    secondaryImage: string;
    features: ServicePreviewFeature[];
    className?: string;
    footer?: ReactNode;
};

export default function ServicePreview({ title, subtitle, primaryImage, secondaryImage, features, className = '', footer }: ServicePreviewProps) {
    return (
        <section className={`relative overflow-hidden rounded-[32px] bg-[#f6f6f6] px-6 py-10 sm:px-10 ${className}`}>
            <div className="flex flex-col gap-10 md:flex-row md:items-center">
                <div className="relative w-full md:w-1/2">
                    <div className="overflow-hidden rounded-[28px] shadow-[0_20px_45px_rgba(15,23,42,0.2)]">
                        <img src={primaryImage} alt="Service preview" className="h-full w-full object-cover" />
                    </div>
                    <div className="absolute bottom-4 -left-4 hidden max-w-[180px] rounded-3xl border border-white/80 bg-white/95 p-4 shadow-xl sm:block">
                        <img src={secondaryImage} alt="Service detail" className="h-full w-full rounded-2xl object-cover" />
                    </div>
                </div>

                <div className="flex w-full flex-1 flex-col gap-6 rounded-[28px] bg-white/90 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
                    <div>
                        {subtitle && <p className="text-sm font-medium tracking-wide text-gray-400 uppercase">{subtitle}</p>}
                        <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
                    </div>

                    <ul className="space-y-4">
                        {features.map((feature) => (
                            <li key={feature.label} className="flex items-start gap-3">
                                <span
                                    className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border text-xs font-semibold ${
                                        feature.highlighted ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 text-gray-400'
                                    }`}
                                >
                                    {feature.highlighted ? '✓' : '•'}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{feature.label}</p>
                                    {feature.description && <p className="text-sm text-gray-500">{feature.description}</p>}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {footer}
                </div>
            </div>
        </section>
    );
}
