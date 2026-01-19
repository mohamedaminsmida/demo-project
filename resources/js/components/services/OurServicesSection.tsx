import type { CSSProperties } from 'react';

import firstSectionBg from '../../../images/first_section_two.png';
import { useLocale } from '../../locales/LocaleProvider';
import ServiceCtaButton from './ServiceCtaButton';

export default function OurServicesSection() {
    const { content } = useLocale();
    const ourServicesContent = content?.services?.ourServices;
    const sectionStyle: CSSProperties = {
        backgroundImage: `url(${firstSectionBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1a1a1a',
    };

    return (
        <section
            className="relative -mt-24 flex min-h-[320px] items-center justify-center overflow-hidden pt-24 pb-0 font-sans text-white lg:-mt-32 lg:min-h-[460px] lg:pt-36 lg:pb-12 [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans"
            style={sectionStyle}
        >
            <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
                <div className="mx-auto flex max-w-[520px] flex-col items-center gap-4 text-center lg:-translate-y-6">
                    <h2 className="text-[clamp(1.5rem,3vw,2.7rem)] leading-tight font-bold uppercase">
                        {ourServicesContent?.title ?? 'Our Services'}
                    </h2>
                    <p className="text-sm text-white/90 lg:text-base">
                        {ourServicesContent?.description ??
                            'At Luque Tires, we provide complete tire care, essential maintenance, and expert repairs — all with honest pricing, fast turnaround, and bilingual service. Choose a category below to explore what we offer.'}
                    </p>
                    <ServiceCtaButton
                        onClick={(event) => {
                            if (typeof window !== 'undefined') {
                                event.preventDefault();
                                const target = document.querySelector('#tires-section');
                                target?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
