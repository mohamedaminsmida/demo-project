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
        <section className={`rounded-2xl bg-[#f5f5f5f5] px-6 py-10 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:px-12 ${className}`}>
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div className="space-y-6">
                    <div className="space-y-3">
                        {subtitle && <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase sm:text-sm">{subtitle}</p>}
                        <h3 className="text-2xl font-bold text-gray-900 sm:text-4xl">{title}</h3>
                    </div>

                    <ul className="space-y-4">
                        {features.map((feature) => (
                            <li key={feature.label} className="flex items-center gap-3 text-sm text-gray-800 sm:text-base">
                                <img src={checkIcon} alt="Check icon" className="-mt-0.5 h-5 w-5 sm:h-6 sm:w-6" />
                                <div>
                                    <p className="font-medium text-gray-900">{feature.label}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {footer}
                </div>

                <div className="relative">
                    <div className="overflow-hidden rounded-2xl shadow-[0_28px_55px_rgba(5,122,85,0.12)] lg:-ml-8 lg:translate-y-4 lg:transform">
                        <img
                            src={primaryImage}
                            alt="Service preview"
                            className="h-full min-h-[300px] w-full rounded-2xl object-cover lg:scale-105"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
