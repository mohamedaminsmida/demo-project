import alignmentImage from '../../../images/alignment.png';
import newTiresImage from '../../../images/new_tires.png';
import redArrowIcon from '../../../images/svg/red-arrow.svg';
import usedTiresImage from '../../../images/used_tiers.png';
import wheelsImage from '../../../images/wheels.png';
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
    image?: string;
};

function ServiceCard({ service }: { service: ServiceItem }) {
    const isDark = service.variant === 'dark';
    const alignContentCenter = service.id === 'new-tires' || service.id === 'used-tires';
    const useGrayBackground = service.id === 'new-tires' || service.id === 'wheels';

    return (
        <div
            className={`flex flex-col gap-4 p-8 md:p-10 ${isDark ? 'bg-[#202020] text-white' : useGrayBackground ? 'bg-[#f5f5f5] text-slate-900' : 'bg-white text-slate-900'} ${
                alignContentCenter ? 'items-center md:items-start' : ''
            }`}
        >
            {service.image && (
                <div className={`flex md:mb-5 ${alignContentCenter ? 'w-full justify-center md:ml-16 md:justify-start' : ''}`}>
                    <img src={service.image} alt="" aria-hidden className="h-16 w-auto" />
                </div>
            )}
            <h3 className={`text-2xl font-semibold md:text-3xl ${alignContentCenter ? 'text-center md:ml-16 md:self-start md:text-left' : ''}`}>
                {service.title}
            </h3>
            <p
                className={`text-base leading-relaxed ${isDark ? 'text-white/80' : 'text-slate-600'} ${
                    alignContentCenter ? 'mx-auto max-w-xl text-center md:ml-16 md:text-left' : ''
                }`}
            >
                {service.description}
            </p>

            {service.sections.map((section) => (
                <div
                    key={section.heading}
                    className={`w-full space-y-2 ${alignContentCenter ? 'mx-auto max-w-xl text-center md:ml-16 md:text-left' : ''}`}
                >
                    <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{section.heading}</p>
                    <ul className="space-y-1 text-sm">
                        {section.items.map((item) => (
                            <li
                                key={`${section.heading}-${item}`}
                                className={`flex items-start gap-2 ${
                                    isDark ? 'text-white/75' : 'text-slate-700'
                                } ${alignContentCenter ? 'justify-center md:justify-start' : ''}`}
                            >
                                <img src={redArrowIcon} alt="" aria-hidden className="mt-0.5 h-4 w-4" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <div className={`pt-3 ${alignContentCenter ? 'mx-auto flex w-full max-w-xl justify-center md:ml-16 md:justify-start' : ''}`}>
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
            title: 'Used Tires',
            description: 'Budget-friendly, safety-checked used tires that deliver performance and value.',
            sections: [
                {
                    heading: 'Includes',
                    items: ['Inspection before sale', 'Mounting & balancing', 'Warranty options'],
                },
                {
                    heading: 'Standard services rates',
                    items: [
                        'Flat Repairs',
                        '$30 + tax (13"–18")',
                        '$35 + tax (19"–22")',
                        'Tire Rotation',
                        '$45 (when tires are not purchased in-store)',
                    ],
                },
            ],
            variant: 'dark',
            ctaLabel: 'Book Now',
            ctaHref: '/appointment?service=used-tires',
            image: usedTiresImage,
        },
        {
            id: 'wheels',
            title: 'Wheels',
            description: 'Wheel installation, replacement, and upgrades for aesthetics and performance.',
            sections: [
                {
                    heading: 'Includes',
                    items: ['Wheel mounting', 'Balancing', 'Fitment assistance'],
                },
                {
                    heading: 'Standard services rates',
                    items: ['Tire Dismount + Disposal', '$35 per tire (13"–17")', '$45 per tire (18"–20")'],
                },
            ],
            variant: 'light',
            ctaLabel: 'Book Now',
            ctaHref: '/appointment?service=wheels',
            image: wheelsImage,
        },
    ];

    return (
        <section id="tires-section" className="bg-[#f5f5f5] pt-12 pb-6 lg:pt-10 lg:pb-0">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
                <div className="mb-8 text-center lg:mb-8">
                    <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-bold text-slate-900 uppercase">Tires & Wheels</h2>
                </div>
            </div>

            <div className="w-full">
                <div className="grid gap-0 md:grid-cols-2">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
}
