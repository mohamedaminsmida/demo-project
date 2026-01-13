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
};

const maintenanceBlocks: MaintenanceBlock[] = [
    {
        id: 'oil-changes',
        title: 'Oil Changes',
        description: 'Quick, clean oil changes to protect your engine and improve performance.',
        bullets: ['Conventional / synthetic options', 'Filter replacement', 'Multi-point check'],
        image: firstImage,
        icon: oilIcon,
        ctaLabel: 'Schedule service',
        ctaHref: '#contact',
        imageWrapperClass: 'relative lg:h-[420px] lg:w-[450px]',
        imageClass: 'h-72 w-full object-cover lg:h-full',
    },
    {
        id: 'brakes',
        title: 'Brakes',
        description: 'Reliable brake inspections and repairs to keep you safe on the road.',
        bullets: ['Pad and rotor replacements', 'Caliper diagnostics', 'Fluid bleed or flush'],
        image: secondeImage,
        icon: brakesIcon,
        ctaLabel: 'Book brake service',
        ctaHref: '#contact',
        imageWrapperClass: 'relative lg:h-[420px] lg:w-[450px]',
        imageClass: 'h-72 w-full object-cover lg:h-full',
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
                            className={`flex flex-col gap-8 bg-white px-4 py-6 lg:flex-row ${
                                index === 0 ? 'lg:gap-12' : 'lg:gap-10'
                            } ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            {(() => {
                                const isOilCard = block.id === 'oil-changes';
                                const isBrakesCard = block.id === 'brakes';
                                const imageWrapperClass =
                                    block.imageWrapperClass ??
                                    (isOilCard
                                        ? 'relative max-w-[420px]'
                                        : isBrakesCard
                                          ? 'relative max-w-[420px]'
                                          : 'relative lg:h-[420px] lg:w-[450px]');
                                const imageSizingClass =
                                    block.imageClass ??
                                    (isOilCard
                                        ? 'max-h-[320px] w-full object-cover md:max-h-[360px]'
                                        : isBrakesCard
                                          ? 'max-h-[320px] w-full object-cover md:max-h-[360px]'
                                          : 'h-72 w-full object-cover lg:h-full');

                                return (
                                    <div className={imageWrapperClass}>
                                        <div
                                            className={`absolute -bottom-4 ${index % 2 === 0 ? '-left-4' : '-right-4'} h-16 w-3 bg-red-600`}
                                            aria-hidden
                                        ></div>
                                        <img
                                            src={block.image}
                                            alt={block.title}
                                            className={`${imageSizingClass} ${index % 2 !== 0 ? 'lg:-scale-x-100' : ''}`}
                                        />
                                    </div>
                                );
                            })()}
                            <div className="flex flex-1 flex-col space-y-2 text-left">
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-start">
                                        <img src={block.icon} alt="" aria-hidden className="h-14 w-14 object-contain md:h-50 md:w-50" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{block.title}</h3>
                                </div>
                                <p className="text-sm text-slate-600 md:text-base">{block.description}</p>
                                <ul className="space-y-2 text-xs text-slate-700 md:text-sm">
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
