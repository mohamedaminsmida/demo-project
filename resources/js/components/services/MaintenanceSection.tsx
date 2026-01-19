import firstImage from '../../../images/FIRST.jpg';
import secondeImage from '../../../images/SECONDE.jpg';
import brakesIcon from '../../../images/brakes.png';
import oilIcon from '../../../images/oil_change.png';
import redArrowIcon from '../../../images/svg/red-arrow.svg';
import { useLocale } from '../../locales/LocaleProvider';
import SectionContainer from '../layout/SectionContainer';
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

export default function MaintenanceSection() {
    const { content } = useLocale();
    const maintenanceContent = content?.services?.maintenance;
    const oilChangesContent = maintenanceContent?.items?.['oil-changes'] ?? {
        title: 'Oil Changes',
        description: 'Quick, clean oil changes to protect your engine and improve performance.',
        bullets: ['Conventional / synthetic options', 'Filter replacement', 'Multi-point check'],
        ctaLabel: 'Book Now',
    };
    const brakesContent = maintenanceContent?.items?.brakes ?? {
        title: 'Brakes',
        description: 'Reliable brake inspections and repairs to keep you safe on the road.',
        bullets: ['Pad and rotor replacements', 'Caliper diagnostics', 'Fluid bleed or flush'],
        ctaLabel: 'Book Now',
    };
    const maintenanceBlocks: MaintenanceBlock[] = [
        {
            id: 'oil-changes',
            title: oilChangesContent.title,
            description: oilChangesContent.description,
            bullets: [...oilChangesContent.bullets],
            image: firstImage,
            icon: oilIcon,
            ctaLabel: oilChangesContent.ctaLabel ?? 'Book Now',
            ctaHref: '/appointment?service=oil-change',
            backgroundClass: 'bg-[#f5f5f5]',
        },
        {
            id: 'brakes',
            title: brakesContent.title,
            description: brakesContent.description,
            bullets: [...brakesContent.bullets],
            image: secondeImage,
            icon: brakesIcon,
            ctaLabel: brakesContent.ctaLabel ?? 'Book Now',
            ctaHref: '/appointment?service=brakes',
            backgroundClass: 'bg-[#f5f5f5]',
        },
    ];

    return (
        <section className="bg-[#f5f5f5] pt-8 pb-6 lg:pt-12 lg:pb-0">
            <SectionContainer>
                <div className="mb-8 text-center lg:mb-5">
                    <h2 className="font-sans text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-bold text-slate-900 uppercase">
                        {maintenanceContent?.title ?? 'Maintenance'}
                    </h2>
                    <p className="mt-2 text-base text-slate-900">{maintenanceContent?.subtitle ?? 'Keep your vehicle running at its best.'}</p>
                </div>

                <div>
                    <div className="flex flex-col gap-8">
                        {maintenanceBlocks.map((block, index) => {
                            const isReversed = index % 2 === 1;
                            return (
                                <div key={block.id} className="w-full">
                                    <div
                                        className={`flex h-full flex-col gap-6 overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.08)] lg:h-[420px] lg:items-stretch lg:gap-10 ${
                                            isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                                        }`}
                                    >
                                        <div
                                            className={`${block.imageWrapperClass ?? 'relative h-64 w-full lg:h-full lg:w-[35%]'} ${
                                                isReversed ? 'lg:ml-10' : 'lg:mr-10'
                                            }`}
                                        >
                                            <div
                                                className={`absolute -bottom-4 h-16 w-3 bg-red-600 ${isReversed ? '-right-4' : '-left-4'}`}
                                                aria-hidden
                                            ></div>
                                            <img src={block.image} alt={block.title} className={block.imageClass ?? 'h-full w-full object-cover'} />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center gap-3 px-6 py-6 text-left sm:px-8">
                                            <div className="flex flex-col gap-1">
                                                <div className="mb-4 flex justify-start">
                                                    <div className={block.iconMaxWidth ?? 'max-w-[240px]'}>
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
                                            <ul className="space-y-2 text-xs text-slate-700 md:mb-4 md:text-sm">
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            </SectionContainer>
        </section>
    );
}
