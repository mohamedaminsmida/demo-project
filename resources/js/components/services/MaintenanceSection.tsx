import firstImage from '../../../images/FIRST.jpg';
import secondeImage from '../../../images/SECONDE.jpg';
import brakesIcon from '../../../images/brakes.png';
import oilIcon from '../../../images/oil_change.png';
import redArrowIcon from '../../../images/svg/red-arrow.svg';
import ServiceCtaButton from './ServiceCtaButton';

type MaintenanceBlock = {
    id: string;
    title: string;
    description: string;
    bullets: string[];
    image: string;
    icon: string;
    ctaLabel: string;
    ctaHref: string;
    imageWrapperClass?: string;
    imageClass?: string;
    iconMaxWidth?: string;
    iconMaxHeight?: string;
    backgroundClass?: string;
};

const maintenanceBlocks: MaintenanceBlock[] = [
    {
        id: 'oil-changes',
        title: 'Oil Changes',
        description: 'Quick, clean oil changes to protect your engine and improve performance.',
        bullets: ['Conventional / synthetic options', 'Filter replacement', 'Multi-point check'],
        image: firstImage,
        icon: oilIcon,
        ctaLabel: 'Book Now',
        ctaHref: '/appointment?service=oil-change',
        backgroundClass: 'bg-[#f5f5f5]',
    },
    {
        id: 'brakes',
        title: 'Brakes',
        description: 'Reliable brake inspections and repairs to keep you safe on the road.',
        bullets: ['Pad and rotor replacements', 'Caliper diagnostics', 'Fluid bleed or flush'],
        image: secondeImage,
        icon: brakesIcon,
        ctaLabel: 'Book Now',
        ctaHref: '/appointment?service=brakes',
        backgroundClass: 'bg-[#f5f5f5]',
    },
];

export default function MaintenanceSection() {
    return (
        <section className="bg-[#f5f5f5] pt-8 pb-6 lg:pt-12 lg:pb-0">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
                <div className="mb-8 text-center lg:mb-5">
                    <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-bold text-slate-900 uppercase">Maintenance</h2>
                    <p className="mt-2 text-base text-slate-900">Keep your vehicle running at its best.</p>
                </div>

                <div className="space-y-8 px-0 lg:px-6">
                    {maintenanceBlocks.map((block, index) => (
                        <div
                            key={block.id}
                            className={`flex flex-col gap-8 ${block.backgroundClass ?? 'bg-white'} px-4 py-6 lg:flex-row ${
                                index === 0 ? 'lg:gap-12' : 'lg:gap-2'
                            } ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className={block.imageWrapperClass ?? 'relative lg:h-[420px] lg:w-[450px]'}>
                                <div
                                    className={`absolute -bottom-4 ${index % 2 === 0 ? '-left-4' : '-right-4'} h-16 w-3 bg-red-600`}
                                    aria-hidden
                                ></div>
                                <img
                                    src={block.image}
                                    alt={block.title}
                                    className={`${block.imageClass ?? 'h-72 w-full object-cover lg:h-full'} ${index % 2 !== 0 ? 'lg:-scale-x-100' : ''}`}
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-center space-y-2 text-left">
                                <div className="flex flex-col gap-1">
                                    <div className="mb-6 flex justify-start">
                                        <div className={block.iconMaxWidth ?? 'max-w-[250px]'}>
                                            <img
                                                src={block.icon}
                                                alt=""
                                                aria-hidden
                                                className={`w-full object-contain ${block.iconMaxHeight ?? 'max-h-20 md:max-h-50'}`}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{block.title}</h3>
                                </div>
                                <p className="text-sm text-slate-600 md:text-base">{block.description}</p>
                                <ul className="space-y-2 text-xs text-slate-700 md:mb-5 md:text-sm">
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
