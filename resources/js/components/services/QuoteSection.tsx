import quoteBackground from '../../../images/quote_bg.png';
import { useLocale } from '../../locales/LocaleProvider';
import SectionContainer from '../layout/SectionContainer';

export default function QuoteSection() {
    const { content } = useLocale();
    const quoteContent = content?.services?.quote;

    return (
        <section className="bg-[#f5f5f5] py-10 sm:py-12">
            <SectionContainer>
                <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl">
                    <div
                        className="relative flex min-h-[200px] items-center justify-center bg-cover bg-center sm:min-h-[320px]"
                        style={{ backgroundImage: `url(${quoteBackground})` }}
                    >
                        <div className="relative z-[2] flex flex-col items-center px-6 py-8 text-center text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)] sm:px-10">
                            <p className="text-base font-semibold tracking-wide text-white/90 sm:text-3xl">
                                {quoteContent?.lineOne ?? 'From everyday upkeep to major repairs'}
                            </p>
                            <p className="mt-2 text-2xl leading-tight font-black uppercase sm:text-4xl">
                                {quoteContent?.lineTwo ?? "We've got you covered."}
                            </p>
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </section>
    );
}
