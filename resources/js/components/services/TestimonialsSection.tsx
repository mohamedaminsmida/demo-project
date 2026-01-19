import { useRef } from 'react';

import SectionContainer from '../layout/SectionContainer';

type Testimonial = {
    id: string;
    name: string;
    avatar: string;
    relativeTime: string;
    rating: number;
    snippet: string;
};

const testimonials: Testimonial[] = [
    {
        id: 'brandy',
        name: 'Brandy S',
        avatar: 'B',
        relativeTime: '1 month ago',
        rating: 5,
        snippet: 'I was greeted before I even exited my vehicle!',
    },
    {
        id: 'christopher',
        name: 'Christopher Brown',
        avatar: 'https://i.pravatar.cc/64?img=12',
        relativeTime: '1 month ago',
        rating: 5,
        snippet: 'Well equipped shop for tires, alignments, and oil changes. Very fair rates and stellar service.',
    },
    {
        id: 'manchu',
        name: 'Manchuwarrior Hellfire',
        avatar: 'https://i.pravatar.cc/64?img=44',
        relativeTime: '3 months ago',
        rating: 5,
        snippet: 'Great service, friendly staff, and fast turnaround. Highly recommend!',
    },
    {
        id: 'william',
        name: 'William',
        avatar: 'W',
        relativeTime: '3 months ago',
        rating: 5,
        snippet: 'Wonderful service, honest prices. My go-to shop for anything automotive.',
    },
    {
        id: 'sophia',
        name: 'Sophia R',
        avatar: 'S',
        relativeTime: '2 weeks ago',
        rating: 5,
        snippet: 'Quick turnaround and they walked me through every detail. Great experience.',
    },
    {
        id: 'julian',
        name: 'Julian Patel',
        avatar: 'https://i.pravatar.cc/64?img=53',
        relativeTime: '2 months ago',
        rating: 5,
        snippet: 'Friendly crew, spotless shop, and pricing was exactly as quoted.',
    },
    {
        id: 'nora',
        name: 'Nora L',
        avatar: 'N',
        relativeTime: '4 months ago',
        rating: 5,
        snippet: 'They fixed my alignment fast and my ride feels brand new again.',
    },
];

export default function TestimonialsSection() {
    const trackRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        const node = trackRef.current;
        if (!node) return;
        const offset = direction === 'left' ? -320 : 320;
        node.scrollBy({ left: offset, behavior: 'smooth' });
    };

    return (
        <section className="relative bg-gradient-to-br from-[#0d0d0d] via-[#151515] to-[#0f3c2f] py-16 text-white">
            <SectionContainer className="flex flex-col gap-10">
                <div className="text-center">
                    <h2 className="font-sans text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-bold text-white uppercase">Reviews</h2>
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        className="absolute top-1/2 -left-3 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-2xl text-black shadow-lg transition hover:bg-black hover:text-white lg:flex"
                        aria-label="Scroll testimonials left"
                    >
                        ‹
                    </button>

                    <div ref={trackRef} className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {testimonials.map((testimonial) => (
                            <article
                                key={testimonial.id}
                                className="min-w-[260px] flex-1 rounded-3xl bg-white p-6 text-slate-900 shadow-[0_30px_60px_rgba(0,0,0,0.2)] sm:min-w-[300px]"
                            >
                                <header className="mb-4 flex items-center gap-3">
                                    {testimonial.avatar.startsWith('http') ? (
                                        <img src={testimonial.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white">
                                            {testimonial.avatar}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-slate-900">{testimonial.name}</p>
                                        <p className="text-sm text-slate-500">{testimonial.relativeTime}</p>
                                    </div>
                                    <img
                                        src="https://www.gstatic.com/images/branding/product/1x/googlelogo_light_color_74x24dp.png"
                                        alt="Google"
                                        className="ml-auto h-5 w-auto"
                                    />
                                </header>

                                <div className="mb-3 flex items-center gap-1 text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`h-4 w-4 ${index < testimonial.rating ? 'fill-current' : 'opacity-25'}`}
                                            viewBox="0 0 20 20"
                                            aria-hidden
                                        >
                                            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                                        </svg>
                                    ))}
                                    <span className="ml-2 text-sm text-slate-500">5.0</span>
                                </div>

                                <p className="text-base text-slate-700">{testimonial.snippet}</p>
                            </article>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        className="absolute top-1/2 -right-3 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-2xl text-black shadow-lg transition hover:bg-black hover:text-white lg:flex"
                        aria-label="Scroll testimonials right"
                    >
                        ›
                    </button>
                </div>
            </SectionContainer>
        </section>
    );
}
