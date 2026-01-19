import alignmentImage from '../../../images/alignment.png';
import newTiresImage from '../../../images/new_tires.png';
import redArrowIcon from '../../../images/svg/red-arrow.svg';
import usedTiresImage from '../../../images/used_tiers.png';
import wheelsImage from '../../../images/wheels.png';
import { useLocale } from '../../locales/LocaleProvider';
import SectionContainer from '../layout/SectionContainer';
import ServiceCtaButton from './ServiceCtaButton';

type ServiceItem = {
    id: string;
    title: string;
    description: string;
    sections: { heading: string; items: string[] }[];
    variant: 'light' | 'dark';
    ctaLabel: string;
    ctaHref: string;
    image?: string;
};

function ServiceCard({
    service,
    cornerClass = '',
    alignCentered = true,
    orderClass = '',
}: {
    service: ServiceItem;
    cornerClass?: string;
    alignCentered?: boolean;
    orderClass?: string;
}) {
    const isDark = service.variant === 'dark';
    const alignContentCenter = alignCentered && (service.id === 'new-tires' || service.id === 'used-tires');

    return (
        <div
            className={`flex h-full flex-col gap-4 rounded-3xl p-8 md:p-10 ${isDark ? 'bg-[#202020] text-white' : 'bg-[#f5f5f5] text-slate-900'} ${
                alignContentCenter ? 'items-center sm:items-start' : ''
            } ${cornerClass} ${orderClass}`}
        >
            {service.image && (
                <div className={`flex md:mb-5 ${alignContentCenter ? 'w-full justify-center sm:justify-start' : ''}`}>
                    <img src={service.image} alt="" aria-hidden className="h-16 w-auto" />
                </div>
            )}
            <h3 className={`text-2xl font-semibold md:text-3xl ${alignContentCenter ? 'text-center sm:self-start sm:text-left' : ''}`}>
                {service.title}
            </h3>
            <p
                className={`text-base leading-relaxed ${isDark ? 'text-white/80' : 'text-slate-600'} ${
                    alignContentCenter ? 'mx-auto max-w-xl text-center sm:mx-0 sm:max-w-none sm:text-left' : ''
                }`}
            >
                {service.description}
            </p>

            {service.sections.map((section) => (
                <div
                    key={section.heading}
                    className={`w-full space-y-2 ${alignContentCenter ? 'mx-auto max-w-xl text-center sm:mx-0 sm:max-w-none sm:text-left' : ''}`}
                >
                    <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{section.heading}</p>
                    <ul className="space-y-1 text-sm">
                        {section.items.map((item) => (
                            <li
                                key={`${section.heading}-${item}`}
                                className={`flex items-start gap-2 ${
                                    isDark ? 'text-white/75' : 'text-slate-700'
                                } ${alignContentCenter ? 'justify-center sm:justify-start' : ''}`}
                            >
                                <img src={redArrowIcon} alt="" aria-hidden className="mt-0.5 h-4 w-4" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <div
                className={`mt-auto pt-3 ${
                    alignContentCenter ? 'mx-auto flex w-full max-w-xl justify-center sm:mx-0 sm:max-w-none sm:justify-start' : ''
                }`}
            >
                <ServiceCtaButton label={service.ctaLabel} href={service.ctaHref} variant="filled" />
            </div>
        </div>
    );
}

export default function TiresWheelsSection() {
    const { content } = useLocale();
    const tiresWheelsContent = content?.services?.tiresWheels;
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
    const usedTiresContent = tiresWheelsContent?.usedTires ?? {
        title: 'Used Tires',
        description: 'Budget-friendly, safety-checked used tires that deliver performance and value.',
        includesTitle: 'Includes',
        includes: ['Inspection before sale', 'Mounting & balancing', 'Warranty options'],
        ratesTitle: 'Standard services rates',
        rates: ['Flat Repairs', '$30 + tax (13"–18")', '$35 + tax (19"–22")', 'Tire Rotation', '$45 (when tires are not purchased in-store)'],
    };
    const wheelsContent = tiresWheelsContent?.wheels ?? {
        title: 'Wheels',
        description: 'Wheel installation, replacement, and upgrades for aesthetics and performance.',
        includesTitle: 'Includes',
        includes: ['Wheel mounting', 'Balancing', 'Fitment assistance'],
        ratesTitle: 'Standard services rates',
        rates: ['Tire Dismount + Disposal', '$35 per tire (13"–17")', '$45 per tire (18"–20")'],
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
            ctaLabel: newTiresContent.ctaLabel ?? 'Book Now',
            ctaHref: '/appointment?service=new-tires',
            image: newTiresImage,
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
            ctaLabel: alignmentsContent.ctaLabel ?? 'Book Alignment',
            ctaHref: '/appointment?service=alignment',
            image: alignmentImage,
        },
        {
            id: 'used-tires',
            title: usedTiresContent.title,
            description: usedTiresContent.description,
            sections: [
                {
                    heading: usedTiresContent.includesTitle,
                    items: [...usedTiresContent.includes],
                },
                {
                    heading: usedTiresContent.ratesTitle,
                    items: [...usedTiresContent.rates],
                },
            ],
            variant: 'dark',
            ctaLabel: usedTiresContent.ctaLabel ?? 'Book Now',
            ctaHref: '/appointment?service=used-tires',
            image: usedTiresImage,
        },
        {
            id: 'wheels',
            title: wheelsContent.title,
            description: wheelsContent.description,
            sections: [
                {
                    heading: wheelsContent.includesTitle,
                    items: [...wheelsContent.includes],
                },
                {
                    heading: wheelsContent.ratesTitle,
                    items: [...wheelsContent.rates],
                },
            ],
            variant: 'light',
            ctaLabel: wheelsContent.ctaLabel ?? 'Book Now',
            ctaHref: '/appointment?service=wheels',
            image: wheelsImage,
        },
    ];

    const layoutVariants: ServiceItem['variant'][] = ['light', 'dark', 'dark', 'light'];
    const cornerClasses = ['sm:rounded-br-none', 'sm:rounded-bl-none', 'sm:rounded-tr-none', 'sm:rounded-tl-none'];

    const orderClasses = ['order-1', 'order-2', 'order-4 sm:order-3', 'order-3 sm:order-4'];

    const servicesInGrid = services.map((service, index) => ({
        ...service,
        variant: layoutVariants[index] ?? service.variant,
        cornerClass: cornerClasses[index] ?? '',
        alignCentered: index % 2 !== 0,
        orderClass: orderClasses[index] ?? '',
    }));

    return (
        <section id="tires-section" className="bg-[#f5f5f5] pt-12 pb-6 lg:pt-10 lg:pb-0">
            <SectionContainer>
                <div className="mb-8 text-center lg:mb-8">
                    <h2 className="font-sans text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-bold text-slate-900 uppercase">
                        {tiresWheelsContent?.title ?? 'Tires & Wheels'}
                    </h2>
                </div>
            </SectionContainer>

            <SectionContainer>
                <div className="grid grid-cols-1 items-stretch gap-0 sm:grid-cols-2">
                    {servicesInGrid.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            cornerClass={service.cornerClass}
                            alignCentered={service.alignCentered}
                            orderClass={service.orderClass}
                        />
                    ))}
                </div>
            </SectionContainer>
        </section>
    );
}
