import { ChevronDown } from '@untitledui/icons';
import { useEffect, useMemo, useState } from 'react';
import AnimatedList from './AnimatedList';

// API types (matching your backend models)
export type ServiceCategoryApi = {
    id: number;
    name: string;
    slug: string;
    services?: ServiceApi[];
};

export type ServiceApi = {
    id: number;
    slug: string;
    name: string;
    description: string;
    image?: string;
    estimated_duration: string;
    base_price?: number;
    is_active: boolean;
    service_category_id?: number;
};

export type ServiceCard = {
    id: string;
    title: string;
    description?: string;
    backgroundImage: string;
    price?: number;
    link?: string;
    category: ServiceCategoryApi;
};

export type ServicesCardsProps = {
    categories?: ServiceCategoryApi[];
    className?: string;
    selectedServiceIds?: string[];
    onServiceSelect?: (serviceId: string) => void;
};

// Helper to fetch categories with services
export async function fetchServiceCategories(): Promise<ServiceCategoryApi[]> {
    const res = await fetch('/api/service-categories?include=services');
    if (!res.ok) throw new Error('Failed to fetch service categories');
    return res.json();
}

export default function ServicesCards({ categories: propCategories, className = '', selectedServiceIds = [], onServiceSelect }: ServicesCardsProps) {
    const [categories, setCategories] = useState<ServiceCategoryApi[] | null>(propCategories || null);
    const [loading, setLoading] = useState(!propCategories);
    const [error, setError] = useState<string | null>(null);

    // Guard: only run fetch effect if useEffect is available (runtime safety)
    if (typeof useEffect === 'function') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (propCategories) return;
            fetchServiceCategories()
                .then(setCategories)
                .catch(() => setError('Failed to load categories'))
                .finally(() => setLoading(false));
        }, [propCategories]);
    }

    const handleCardClick = (serviceId: string) => {
        onServiceSelect?.(serviceId);
    };

    const toggleCategory = (categorySlug: string) => {
        setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(categorySlug)) {
                newSet.delete(categorySlug);
            } else {
                newSet.add(categorySlug);
            }
            return newSet;
        });
    };

    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // Sort categories: if a service is selected, put its category first and expand it
    const sortedCategories = useMemo(() => {
        if (!categories || !categories.length) return [];

        const selectedServiceId = selectedServiceIds?.[0];
        if (!selectedServiceId) return categories;

        const selectedService = categories.flatMap((cat) => cat.services || []).find((s) => s.id.toString() === selectedServiceId);

        if (!selectedService?.service_category_id) return categories;

        // Find the category by service_category_id
        const selectedCategory = categories.find((cat) => cat.id === selectedService.service_category_id);
        if (!selectedCategory) return categories;

        const selectedCategorySlug = selectedCategory.slug;

        // Put selected category first
        const selected = categories.find((cat) => cat.slug === selectedCategorySlug);
        const others = categories.filter((cat) => cat.slug !== selectedCategorySlug);

        const result = selected ? [selected, ...others] : categories;

        // Auto-expand the selected category
        setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            newSet.add(selectedCategorySlug);
            return newSet;
        });

        return result;
    }, [categories, selectedServiceIds]);

    if (loading) return <div className="p-10 text-center">Loading services...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!categories?.length) return <div className="p-10 text-center">No service categories found.</div>;

    // Check if there are any active services at all
    const hasAnyServices = categories.some((cat) => cat.services?.some((s) => s.is_active));
    if (!hasAnyServices) return <div className="p-10 text-center">No services available at the moment.</div>;

    // Helper to get a fallback background image
    const getBackgroundImage = (service: ServiceApi) => {
        if (service.image) return `/storage/${service.image}`;
        return '/images/default-service.png';
    };

    return (
        <section className={`px-0 py-10 sm:px-6 ${className}`}>
            <div className="w-full space-y-6 sm:mx-auto sm:max-w-7xl">
                {sortedCategories.map((category) => {
                    const isExpanded = expandedCategories.has(category.slug);
                    const categoryServices = category.services?.filter((s) => s.is_active) ?? [];

                    return (
                        <div key={category.id}>
                            <div className="mb-4">
                                <button
                                    className="w-full cursor-pointer rounded-xl border border-gray-200"
                                    onClick={() => toggleCategory(category.slug)}
                                >
                                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <h2 className="text-lg font-semibold text-gray-900 sm:text-2xl dark:text-white">{category.name}</h2>
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800 sm:px-2.5 sm:text-xs dark:bg-green-900 dark:text-green-200">
                                                {categoryServices.length} services
                                            </span>
                                            <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {isExpanded && (
                                <div className="p-4">
                                    {categoryServices.length === 0 ? (
                                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            No services available in this category.
                                        </div>
                                    ) : (
                                        <AnimatedList
                                            items={categoryServices}
                                            onItemSelect={(service) => handleCardClick(service.id.toString())}
                                            showGradients={false}
                                            enableArrowNavigation
                                            displayScrollbar={false}
                                            scrollable={false}
                                            listClassName="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3"
                                            renderItem={(service) => {
                                                const isSelected = selectedServiceIds.includes(service.id.toString());

                                                return (
                                                    <button
                                                        key={service.id}
                                                        type="button"
                                                        className="group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-cover bg-center shadow-lg transition-all focus:outline-none"
                                                        style={{ backgroundImage: `url(${getBackgroundImage(service)})` }}
                                                    >
                                                        <div
                                                            className={`absolute inset-0 transition-colors ${isSelected ? 'bg-black/80' : 'bg-gradient-to-t from-black/70 via-black/40 to-black/20'}`}
                                                        ></div>

                                                        <div className="relative flex min-h-[160px] flex-col items-center justify-center p-4 sm:min-h-[200px] sm:p-5">
                                                            {isSelected ? (
                                                                <>
                                                                    <svg
                                                                        width="64"
                                                                        height="64"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="mb-3 h-12 w-12 sm:h-16 sm:w-16"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            clipRule="evenodd"
                                                                            d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12ZM15.2906 9.34313C15.5153 9.50364 15.5674 9.81591 15.4069 10.0406L11.6569 15.2906C11.5714 15.4102 11.4377 15.4862 11.2912 15.4983C11.1448 15.5104 11.0004 15.4575 10.8964 15.3536L8.64645 13.1036C8.45118 12.9083 8.45118 12.5917 8.64645 12.3964C8.84171 12.2012 9.15829 12.2012 9.35355 12.3964L11.1862 14.2291L14.5931 9.45938C14.7536 9.23467 15.0659 9.18263 15.2906 9.34313Z"
                                                                            fill="white"
                                                                        />
                                                                    </svg>
                                                                    <h3 className="text-center text-lg font-bold text-white sm:text-xl">
                                                                        {service.name}
                                                                    </h3>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">{service.name}</h3>
                                                                    {service.description && (
                                                                        <p className="text-xs text-white/90 sm:text-sm">{service.description}</p>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
