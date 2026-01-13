import quoteBackground from '../../../images/quote_bg.png';

export default function QuoteSection() {
    return (
        <section className="bg-[#f5f5f5] py-10 sm:py-12">
            <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
                <div className="relative w-full overflow-hidden shadow-2xl">
                    <div
                        className="relative flex min-h-[260px] items-center justify-center bg-cover bg-center sm:min-h-[320px]"
                        style={{ backgroundImage: `url(${quoteBackground})` }}
                    >
                        <div className="relative z-[2] flex flex-col items-center px-6 py-8 text-center text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)] sm:px-10">
                            <p className="text-xl font-semibold tracking-wide whitespace-nowrap text-white/90 sm:text-3xl">
                                From everyday upkeep to major repairs
                            </p>
                            <p className="mt-2 text-3xl leading-tight font-black whitespace-nowrap uppercase sm:text-4xl">We've got you covered.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
