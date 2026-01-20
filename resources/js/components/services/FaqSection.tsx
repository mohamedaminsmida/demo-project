import { useState } from 'react';

import questionIcon from '../../../images/svg/question.svg';
import SectionContainer from '../layout/SectionContainer';

type FaqItem = {
    id: string;
    question: string;
    answer: string;
};

type FaqGroup = {
    id: string;
    label: string;
    items: FaqItem[];
};

const faqGroups: FaqGroup[] = [
    {
        id: 'general',
        label: 'General',
        items: [
            {
                id: 'booking',
                question: 'How do I book a service appointment?',
                answer: 'You can book online in a few clicks or call our team directly. We will confirm the service type, timing, and any special requests.',
            },
            {
                id: 'walk-ins',
                question: 'Do you accept walk-ins?',
                answer: 'Walk-ins are welcome when we have availability, but appointments help us serve you faster. Call ahead to check today’s wait time.',
            },
            {
                id: 'estimates',
                question: 'Can I get an estimate before service?',
                answer: 'Absolutely. We provide transparent estimates before we begin any work, so you know exactly what to expect.',
            },
        ],
    },
    {
        id: 'features',
        label: 'Features',
        items: [
            {
                id: 'warranty',
                question: 'Do your services come with a warranty?',
                answer: 'Yes. Many services include a workmanship warranty. Specific coverage details are provided with your invoice.',
            },
            {
                id: 'parts',
                question: 'What parts do you use?',
                answer: 'We source high-quality OEM and trusted aftermarket parts depending on your preferences and budget.',
            },
            {
                id: 'inspection',
                question: 'Is a vehicle inspection included?',
                answer: 'Most services include a multi-point inspection to keep you informed about your vehicle’s condition.',
            },
        ],
    },
    {
        id: 'license',
        label: 'License',
        items: [
            {
                id: 'payment',
                question: 'What payment methods do you accept?',
                answer: 'We accept major credit cards, debit, and cash. Financing options may be available for larger repairs.',
            },
            {
                id: 'fleet',
                question: 'Do you offer fleet services?',
                answer: 'Yes, we work with fleet and commercial accounts. Contact us to tailor a service plan for your vehicles.',
            },
            {
                id: 'support',
                question: 'How can I reach support?',
                answer: 'Reach us by phone, email, or the contact form on our website. We respond quickly during business hours.',
            },
        ],
    },
];

export default function FaqSection() {
    const allItems = faqGroups.flatMap((group) => group.items);
    const [openItemId, setOpenItemId] = useState(allItems[0]?.id ?? '');

    return (
        <section className="bg-white py-16">
            <SectionContainer className="flex flex-col items-center gap-10">
                <div className="max-w-2xl text-center">
                    <h2 className="font-sans text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-bold text-slate-900 uppercase">
                        Frequently asked questions
                    </h2>
                    <p className="mt-4 text-base text-slate-500">
                        Find answers to common questions about our services. If you need more help, feel free to reach out to our team.
                    </p>
                </div>

                <div className="flex w-full max-w-[1000px] flex-col gap-4">
                    {allItems.map((item) => {
                        const isOpen = item.id === openItemId;
                        return (
                            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white transition hover:border-red-700">
                                <button
                                    type="button"
                                    onClick={() => setOpenItemId(isOpen ? '' : item.id)}
                                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center text-emerald-600 sm:h-9 sm:w-9">
                                            <img src={questionIcon} alt="" aria-hidden className="h-6 w-6 text-emerald-600" />
                                        </span>
                                        <h3 className="font-sans text-sm font-semibold break-words text-slate-900 sm:text-lg">{item.question}</h3>
                                    </div>
                                    <span className={`text-slate-600 transition ${isOpen ? 'rotate-180 text-slate-900' : ''}`} aria-hidden>
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                                        isOpen ? 'max-h-[240px]' : 'max-h-0'
                                    }`}
                                >
                                    <div className="px-6 pt-3 pb-5 text-left">
                                        <p className="font-sans text-sm text-slate-600 sm:text-lg">{item.answer}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </SectionContainer>
        </section>
    );
}
