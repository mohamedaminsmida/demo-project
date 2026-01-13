import firstImage from '../../../images/FIRST.jpg';
import secondeImage from '../../../images/SECONDE.jpg';
import redArrowIcon from '../../../images/svg/red-arrow.svg';
import ServiceCtaButton from './ServiceCtaButton';

type MaintenanceBlock = {
    id: string;
    title: string;
    description: string;
    bullets: string[];
    image: string;
    ctaLabel: string;
    ctaHref: string;
};

const maintenanceBlocks: MaintenanceBlock[] = [
    {
        id: 'oil-changes',
        title: 'Oil Changes',
        description: 'Quick, clean oil changes to protect your engine and improve performance.',
        bullets: ['Conventional / synthetic options', 'Filter replacement', 'Multi-point check'],
        image: firstImage,
        ctaLabel: 'Schedule service',
        ctaHref: '#contact',
    },
    {
        id: 'brakes',
        title: 'Brakes',
        description: 'Reliable brake inspections and repairs to keep you safe on the road.',
        bullets: ['Pad and rotor replacements', 'Caliper diagnostics', 'Fluid bleed or flush'],
        image: secondeImage,
        ctaLabel: 'Book brake service',
        ctaHref: '#contact',
    },
];

export default function MaintenanceSection() {
    return (
        <section className="bg-white pt-8 pb-6 lg:pt-12 lg:pb-0">
            <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
                <div className="mb-8 text-center lg:mb-5">
                    <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-bold text-slate-900 uppercase">Maintenance</h2>
                    <p className="mt-2 text-base text-slate-900">Keep your vehicle running at its best.</p>
                </div>

                <div className="space-y-8 px-0 lg:px-6">
                    {maintenanceBlocks.map((block, index) => (
                        <div
                            key={block.id}
                            className={`flex flex-col gap-8 bg-white px-4 py-6 lg:flex-row ${
                                index === 0 ? 'lg:gap-24' : 'lg:gap-16'
                            } ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className="relative lg:h-[480px] lg:w-[560px]">
                                <div
                                    className={`absolute -bottom-4 ${index % 2 === 0 ? '-left-4' : '-right-4'} h-16 w-3 bg-red-600`}
                                    aria-hidden
                                ></div>
                                <img
                                    src={block.image}
                                    alt={block.title}
                                    className={`h-80 w-full object-cover lg:h-full ${index % 2 !== 0 ? 'lg:-scale-x-100' : ''}`}
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-center space-y-4 text-left">
                                <h3 className="text-2xl font-semibold text-slate-900">{block.title}</h3>
                                <p className="text-base text-slate-600">{block.description}</p>
                                <ul className="space-y-2 text-sm text-slate-700">
                                    {block.bullets.map((bullet) => (
                                        <li key={bullet} className="flex items-start gap-2">
                                            <img src={redArrowIcon} alt="" aria-hidden className="mt-0.5 h-4 w-4" />
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                                <ServiceCtaButton label={block.ctaLabel} href={block.ctaHref} variant="filled" className="w-fit" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
