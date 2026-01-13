import redArrowIcon from '../../../images/svg/red-arrow.svg';
import ServiceCtaButton from './ServiceCtaButton';

type RepairCard = {
    id: string;
    title: string;
    description: string;
    bullets: string[];
    variant: 'light' | 'dark';
    ctaLabel: string;
    ctaHref: string;
};

const repairCards: RepairCard[] = [
    {
        id: 'transmissions',
        title: 'Transmissions',
        description:
            'Professional transmission diagnostics, service, and replacement. Reliable brake inspections and repairs to keep you safe on the road.',
        bullets: ['Fluid service', 'Transmission repair', 'Full rebuild or replacement'],
        variant: 'light',
        ctaLabel: 'Request estimate',
        ctaHref: '#contact',
    },
    {
        id: 'engine-replacement',
        title: 'Engine Replacement',
        description: 'Complete engine replacement performed with precision and high-quality parts.',
        bullets: ['Engine sourcing', 'Installation', 'Final testing & tune'],
        variant: 'dark',
        ctaLabel: 'Call for details',
        ctaHref: 'tel:+1-000-000-0000',
    },
    {
        id: 'lift-kits',
        title: 'Lift Kits',
        description: 'Upgrade height and suspension with professional lift kit installation.',
        bullets: ['Lift kit fitting', 'Alignment after installation', 'Safety inspection'],
        variant: 'light',
        ctaLabel: 'Get a quote',
        ctaHref: '#contact',
    },
];

export default function RepairsSection() {
    return (
        <section className="mb-10 bg-[#f5f5f5] py-14 sm:py-5">
            <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
                <div className="mb-8 text-center md:mb-8">
                    <h2 className="mt-2 text-[clamp(2rem,4vw,2.8rem)] font-black tracking-[0.05em] text-[#232323] uppercase">Repairs</h2>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {repairCards.map((card) => {
                        const isDark = card.variant === 'dark';
                        return (
                            <article
                                key={card.id}
                                className={`${
                                    isDark ? 'bg-[#1c1c1c] text-white' : 'bg-white text-[#1f1f1f]'
                                } mx-auto flex h-full w-full max-w-[360px] flex-col p-7 shadow-lg md:min-h-[370px]`}
                            >
                                <div className="mb-5 space-y-2">
                                    <h3 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-[#1f1f1f]'}`}>{card.title}</h3>
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
