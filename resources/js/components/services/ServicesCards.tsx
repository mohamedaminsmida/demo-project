import { ChevronDown } from '@untitledui/icons';
import { useState } from 'react';
import { ServiceCategory } from '../../config/services';
import AnimatedList from './AnimatedList';

export type ServiceCard = {
    id: string;
    title: string;
    description?: string;
    backgroundImage: string;
    price?: number;
    link?: string;
    category: ServiceCategory;
};

export type ServicesCardsProps = {
    services: ServiceCard[];
    className?: string;
    selectedServiceIds?: string[];
    onServiceSelect?: (serviceId: string) => void;
};

export default function ServicesCards({ services, className = '', selectedServiceIds = [], onServiceSelect }: ServicesCardsProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<ServiceCategory>>(new Set(['tires', 'maintenance', 'repairs']));

    const handleCardClick = (serviceId: string) => {
        onServiceSelect?.(serviceId);
    };

    const toggleCategory = (category: ServiceCategory) => {
        setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    // Group services by category
    const servicesByCategory = services.reduce(
        (acc, service) => {
            if (!acc[service.category]) {
                acc[service.category] = [];
            }
            acc[service.category].push(service);
            return acc;
        },
        {} as Record<ServiceCategory, ServiceCard[]>,
    );

    const categoryTitles: Record<ServiceCategory, string> = {
        tires: 'Tires',
        maintenance: 'Maintenance',
        repairs: 'Repairs',
    };

    const categoryDescriptions: Record<ServiceCategory, string> = {
        tires: 'New and used tires, wheel alignment, and flat repair services',
        maintenance: 'Regular maintenance services including oil changes and brake service',
        repairs: 'Engine, transmission, and major repair services',
    };

    return (
        <section className={`px-6 py-10 ${className}`}>
            <div className="mx-auto max-w-7xl space-y-6">
                {Object.entries(servicesByCategory).map(([category, categoryServices]) => {
                    const isExpanded = expandedCategories.has(category as ServiceCategory);

                    return (
                        <div key={category}>
                            <div className="mb-4">
                                <button
                                    className="w-full cursor-pointer rounded-xl border border-gray-200"
                                    onClick={() => toggleCategory(category as ServiceCategory)}
                                >
                                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div className="text-left">
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {categoryTitles[category as ServiceCategory]}
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                {categoryDescriptions[category as ServiceCategory]} ({categoryServices.length} services)
                                            </p>
                                        </div>
                                        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                            </div>

                            {isExpanded && (
                                <div className="p-4">
                                    <AnimatedList
                                        items={categoryServices}
                                        onItemSelect={(service) => handleCardClick(service.id)}
                                        showGradients={false}
                                        enableArrowNavigation
                                        displayScrollbar={false}
                                        scrollable={false}
                                        listClassName="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3"
                                        renderItem={(service) => {
                                            const isSelected = selectedServiceIds.includes(service.id);

                                            return (
                                                <button
                                                    key={service.id}
                                                    type="button"
                                                    className="group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-cover bg-center shadow-lg transition-all focus:outline-none"
                                                    style={{ backgroundImage: `url(${service.backgroundImage})` }}
                                                >
                                                    <div
                                                        className={`absolute inset-0 transition-colors ${isSelected ? 'bg-black/80' : 'bg-gradient-to-t from-black/70 via-black/40 to-black/20'}`}
                                                    ></div>

                                                    <div className="relative flex min-h-[200px] flex-col items-center justify-center p-5">
                                                        {isSelected ? (
                                                            <>
                                                                <svg
                                                                    width="64"
                                                                    height="64"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="mb-3"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12ZM15.2906 9.34313C15.5153 9.50364 15.5674 9.81591 15.4069 10.0406L11.6569 15.2906C11.5714 15.4102 11.4377 15.4862 11.2912 15.4983C11.1448 15.5104 11.0004 15.4575 10.8964 15.3536L8.64645 13.1036C8.45118 12.9083 8.45118 12.5917 8.64645 12.3964C8.84171 12.2012 9.15829 12.2012 9.35355 12.3964L11.1862 14.2291L14.5931 9.45938C14.7536 9.23467 15.0659 9.18263 15.2906 9.34313Z"
                                                                        fill="white"
                                                                    />
                                                                </svg>
                                                                <h3 className="text-center text-xl font-bold text-white">{service.title}</h3>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <h3 className="mb-2 text-2xl font-bold text-white">{service.title}</h3>
                                                                {service.description && (
                                                                    <p className="text-sm text-white/90">{service.description}</p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
