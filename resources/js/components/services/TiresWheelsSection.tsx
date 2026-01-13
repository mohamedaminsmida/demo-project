import { useLocale } from '../../locales/LocaleProvider';
import ServiceCtaButton from './ServiceCtaButton';

type ServiceItem = {
    id: string;
    title: string;
    description: string;
    sections: { heading: string; items: string[] }[];
    variant: 'light' | 'dark';
    ctaLabel: string;
    ctaHref: string;
};

function ServiceCard({ service }: { service: ServiceItem }) {
    const isDark = service.variant === 'dark';

    return (
        <div className={`flex flex-col gap-4 p-8 md:p-10 ${isDark ? 'bg-[#202020] text-white' : 'bg-white text-slate-900'}`}>
            <h3 className="text-2xl font-semibold md:text-3xl">{service.title}</h3>
            <p className={`text-base leading-relaxed ${isDark ? 'text-white/80' : 'text-slate-600'}`}>{service.description}</p>

            {service.sections.map((section) => (
                <div key={section.heading} className="space-y-2">
                    <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{section.heading}</p>
                    <ul className="space-y-1 text-sm">
                        {section.items.map((item) => (
                            <li key={`${section.heading}-${item}`} className={isDark ? 'text-white/75' : 'text-slate-700'}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <div className="pt-3">
                <ServiceCtaButton label={service.ctaLabel} href={service.ctaHref} variant="filled" />
            </div>
        </div>
    );
}

export default function TiresWheelsSection() {
    const { content } = useLocale();
    const newTiresContent = content?.services?.newTires ?? {
        title: 'New Tires',
        description: 'High-quality new tires from trusted brands, installed and balanced on-site.',
        includesTitle: 'Includes',
        includes: ['Wide selection of brands & sizes', 'Professional mounting & balancing', 'Safety inspection'],
        ratesTitle: 'Standard services rates',
        rates: [
            'Balance',
            '$25 per tire — tape weights',
            '$22 per tire — clip-on weights',
            'TPMS Sensors',
            '$85 per sensor (installation & programming included)',
        ],
    };
    const alignmentsContent = content?.services?.alignments ?? {
        title: 'Alignments',
        description: 'Precision wheel alignment to improve safety, handling, and tire lifespan.',
        includesTitle: 'Includes',
        includes: ['Front or four-wheel alignment', 'Steering & suspension check', 'Tire wear analysis'],
        ratesTitle: 'Standard services rates',
        rates: ['Four-wheel alignment', '$120 — four-way alignment'],
    };

    const services: ServiceItem[] = [
        {
            id: 'new-tires',
            title: newTiresContent.title,
            description: newTiresContent.description,
            sections: [
                { heading: newTiresContent.includesTitle, items: [...newTiresContent.includes] },
                { heading: newTiresContent.ratesTitle, items: [...newTiresContent.rates] },
            ],
            variant: 'light',
            ctaLabel: newTiresContent.ctaLabel ?? 'Call for availability',
            ctaHref: 'tel:+1-000-000-0000',
        },
        {
            id: 'alignments',
            title: alignmentsContent.title,
            description: alignmentsContent.description,
            sections: [
                { heading: alignmentsContent.includesTitle, items: [...alignmentsContent.includes] },
                { heading: alignmentsContent.ratesTitle, items: [...alignmentsContent.rates] },
            ],
            variant: 'dark',
            ctaLabel: alignmentsContent.ctaLabel ?? 'Book alignment',
            ctaHref: '#contact',
        },
        {
            id: 'used-tires',
            title: 'Used Tires',
            description: 'Certified used tires inspected for tread depth and structure with quick installation.',
            sections: [
                {
                    heading: 'Includes',
                    items: ['Tread & safety inspection', 'Mounting & balancing', 'Flat repair services'],
                },
                {
                    heading: 'Standard services rates',
                    items: ['$40 — pair installation', 'Trade-in options available'],
                },
            ],
            variant: 'dark',
            ctaLabel: 'Get a quote',
            ctaHref: '#contact',
        },
        {
            id: 'wheels',
            title: 'Wheels & Packages',
            description: 'Upgrade aesthetics and performance with OEM replacements or custom forged sets.',
            sections: [
                {
                    heading: 'Includes',
                    items: ['Wheel fitment consultation', 'Mounting & balancing', 'Protective coating options'],
                },
                {
                    heading: 'Standard services rates',
                    items: ['Packages from $899', 'Refinishing from $120 per wheel'],
                },
            ],
            variant: 'light',
            ctaLabel: 'Explore packages',
            ctaHref: '#contact',
        },
    ];

    return (
        <section id="tires-section" className="bg-white pt-12 pb-10 lg:pt-20 lg:pb-14">
            <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
                {/* Section Header */}
                <div className="mb-8 text-center lg:mb-12">
                    <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-bold text-slate-900 uppercase">Tires & Wheels</h2>
                </div>

                {/* Services Grid */}
                <div className="grid gap-0 md:grid-cols-2">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
}
