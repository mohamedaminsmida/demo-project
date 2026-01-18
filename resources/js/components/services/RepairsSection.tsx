import engineReplacementImage from '../../../images/engine_replacement.png';
import liftImage from '../../../images/lift.png';
import redArrowIcon from '../../../images/svg/red-arrow.svg';
import transmissionImage from '../../../images/transmission.png';
import { useLocale } from '../../locales/LocaleProvider';
import ServiceCtaButton from './ServiceCtaButton';

type RepairCard = {
    id: string;
    title: string;
    description: string;
    bullets: string[];
    image: string;
    variant: 'light' | 'dark';
    ctaLabel: string;
    ctaHref: string;
};

export default function RepairsSection() {
    const { content } = useLocale();
    const repairsContent = content?.services?.repairs;
    const transmissionsContent = repairsContent?.items?.transmissions ?? {
        title: 'Transmissions',
        description:
            'Professional transmission diagnostics, service, and replacement. Reliable brake inspections and repairs to keep you safe on the road.',
        bullets: ['Fluid service', 'Transmission repair', 'Full rebuild or replacement'],
        ctaLabel: 'Book Now',
    };
    const engineContent = repairsContent?.items?.['engine-replacement'] ?? {
        title: 'Engine Replacement',
        description: 'Complete engine replacement performed with precision and high-quality parts.',
        bullets: ['Engine sourcing', 'Installation', 'Final testing & tune'],
        ctaLabel: 'Book Now',
    };
    const liftKitsContent = repairsContent?.items?.['lift-kits'] ?? {
        title: 'Lift Kits',
        description: 'Upgrade height and suspension with professional lift kit installation.',
        bullets: ['Lift kit fitting', 'Alignment after installation', 'Safety inspection'],
        ctaLabel: 'Book Now',
    };
    const repairCards: RepairCard[] = [
        {
            id: 'transmissions',
            title: transmissionsContent.title,
            description: transmissionsContent.description,
            bullets: [...transmissionsContent.bullets],
            image: transmissionImage,
            variant: 'light',
            ctaLabel: transmissionsContent.ctaLabel ?? 'Book Now',
            ctaHref: '/appointment?service=transmission',
        },
        {
            id: 'engine-replacement',
            title: engineContent.title,
            description: engineContent.description,
            bullets: [...engineContent.bullets],
            image: engineReplacementImage,
            variant: 'dark',
            ctaLabel: engineContent.ctaLabel ?? 'Book Now',
            ctaHref: '/appointment?service=engine-replacement',
        },
        {
            id: 'lift-kits',
            title: liftKitsContent.title,
            description: liftKitsContent.description,
            bullets: [...liftKitsContent.bullets],
            image: liftImage,
            variant: 'light',
            ctaLabel: liftKitsContent.ctaLabel ?? 'Book Now',
            ctaHref: '/appointment?service=lift-kit',
        },
    ];

    return (
        <section className="mb-2 mb-20 bg-[#f5f5f5] py-14 sm:py-0">
            <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
                <div className="mb-8 text-center md:mb-8">
                    <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-black tracking-[0.05em] text-[#232323] uppercase">
                        {repairsContent?.title ?? 'Repairs'}
                    </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {repairCards.map((card) => {
                        const isDark = card.variant === 'dark';
                        const isTransmission = card.id === 'transmissions';
                        const isEngine = card.id === 'engine-replacement';
                        const isLiftCard = card.id === 'lift-kits';
                        return (
                            <article
                                key={card.id}
                                className={`${
                                    isDark ? 'bg-[#1c1c1c] text-white' : 'bg-white text-[#1f1f1f]'
                                } mx-auto flex h-full w-full max-w-[360px] flex-col p-7 shadow-lg md:min-h-[350px]`}
                            >
                                <div className="mb-5 space-y-2">
                                    <div
                                        className={`${
                                            isTransmission ? 'max-w-[210px]' : isEngine ? 'max-w-[240px]' : isLiftCard ? 'max-w-[130px]' : 'w-full'
                                        }`}
                                    >
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className={`mb-4 w-full rounded-md object-contain ${
                                                isTransmission
                                                    ? 'max-h-24 md:max-h-28'
                                                    : isEngine
                                                      ? 'max-h-28 md:max-h-32'
                                                      : isLiftCard
                                                        ? 'max-h-24 md:max-h-28'
                                                        : ''
                                            }`}
                                        />
                                    </div>
                                    <p className={`text-sm leading-relaxed ${isDark ? 'text-white/80' : 'text-[#4c4c4c]'}`}>{card.description}</p>
                                </div>
                                <ul className="flex flex-1 flex-col gap-3 text-sm">
                                    {card.bullets.map((bullet) => (
                                        <li key={`${card.id}-${bullet}`} className="flex items-start gap-2 text-sm">
                                            <img src={redArrowIcon} alt="" aria-hidden className="mt-0.5 h-4 w-4" />
                                            <span className={isDark ? 'text-white/85' : 'text-[#555555]'}>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6">
                                    <ServiceCtaButton label={card.ctaLabel} href={card.ctaHref} variant="filled" />
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
