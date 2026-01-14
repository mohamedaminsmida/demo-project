import type { ReactNode } from 'react';

import defaultServiceImage from '../../../images/FIRST.jpg';
import checkIcon from '../../../images/svg/check.svg';
import type { ServiceConfig } from '../../config/services';

export type ServicePreviewFeature = {
    label: string;
    description?: string;
    highlighted?: boolean;
};

export type ServicePreviewProps = {
    service?: ServiceConfig;
    // Legacy props for backward compatibility
    title?: string;
    subtitle?: string;
    primaryImage?: string;
    secondaryImage?: string;
    features?: ServicePreviewFeature[];
    price?: number;
    className?: string;
    footer?: ReactNode;
};

export default function ServicePreview({
    service,
    title: legacyTitle,
    subtitle: legacySubtitle,
    primaryImage: legacyPrimaryImage,
    secondaryImage: legacySecondaryImage,
    features: legacyFeatures,
    price: legacyPrice,
    className = '',
    footer,
}: ServicePreviewProps) {
    // Use service data if provided, otherwise fall back to legacy props
    const title = service?.name || legacyTitle || 'Service';
    const subtitle = service?.category?.toUpperCase() || legacySubtitle;
    const primaryImage = service?.image || legacyPrimaryImage || defaultServiceImage;

    // Build features from service details or use legacy features
    const features = service?.details?.includes ? service.details.includes.map((item) => ({ label: item })) : legacyFeatures || [];

    const price = service?.basePrice || legacyPrice;
    const keyOptions = features;
    const formattedPrice = typeof price === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price) : null;

    return (
        <section className={`rounded-3xl bg-[#f5f5f5f5] px-6 py-10 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:px-12 ${className}`}>
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div className="space-y-6">
                    <div className="space-y-3">
                        {subtitle && <p className="text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase">{subtitle}</p>}
                        <h3 className="text-3xl font-semibold text-gray-900">{title}</h3>
                    </div>

                    <ul className="space-y-4">
                        {features.map((feature) => (
                            <li key={feature.label} className="flex items-center gap-3 text-base text-gray-800">
                                <img src={checkIcon} alt="Check icon" className="-mt-0.5 h-6 w-6" />
                                <div>
                                    <p className="font-medium text-gray-900">{feature.label}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {footer}
                </div>

                <div className="relative">
                    <div className="overflow-hidden rounded-[36px] shadow-[0_28px_55px_rgba(5,122,85,0.12)] lg:-ml-8 lg:translate-y-4 lg:transform">
                        <img
                            src={primaryImage}
                            alt="Service preview"
                            className="h-full min-h-[300px] w-full object-cover lg:scale-105"
                            loading="lazy"
                        />
                    </div>

                    <div className="mt-4 lg:absolute lg:top-1/2 lg:-left-24 lg:mt-0 lg:w-[240px] lg:-translate-y-[5%]">
                        <div className="rounded-[22px] border border-white/70 bg-white/95 p-4 shadow-[0_18px_40px_rgba(5,122,85,0.18)] backdrop-blur">
                            <div className="mb-3 flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-700/90 text-white">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path
                                            d="M12 3L3 7l9 4 9-4-9-4Z"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M3 12l9 4 9-4"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M3 17l9 4 9-4"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <button type="button" className="ml-auto rounded-full border border-gray-200 p-1.5 text-gray-400">
                                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {formattedPrice && (
                                <p className="mb-3 text-[11px] font-semibold text-gray-600">
                                    Starting at <span className="text-green-700">{formattedPrice}</span>
                                </p>
                            )}

                            <div className="space-y-2">
                                {keyOptions.map((option) => (
                                    <div
                                        key={option.label}
                                        className="flex items-center justify-between rounded-2xl border border-gray-100 px-3 py-2"
                                    >
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-900">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500">
                                                <svg className="h-2 w-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M5 12H19"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                            {option.label}
                                        </div>
                                        <button
                                            type="button"
                                            className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:text-gray-700"
                                        >
                                            <svg className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M8 5.33333V8"
                                                    stroke="currentColor"
                                                    strokeWidth="1.4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <circle cx="8" cy="11" r="0.666667" fill="currentColor" />
                                                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
