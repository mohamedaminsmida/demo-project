const en = {
    code: 'EN',
    name: 'English',
    flag: '🇬🇧',
    nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        contact: 'Contact us',
    },
    cta: {
        serviceButton: 'Explore more',
    },
    services: {
        newTires: {
            title: 'New Tires',
            description: 'High-quality new tires from trusted brands, installed and balanced on-site.',
            includesTitle: 'Includes',
            includes: ['Wide selection of brands & sizes', 'Professional mounting & balancing', 'Safety inspection'],
            ratesTitle: 'Standard services rates',
            rates: [
                'Balance',
                '$25 per tire — tape weights',
                '$22 per tire — clip-on weights',
                'TPMS Sensors',
                '$85 per sensor (installation & programming included)',
            ],
            ctaLabel: 'Call for availability',
        },
        alignments: {
            title: 'Alignments',
            description: 'Precision wheel alignment to improve safety, handling, and tire lifespan.',
            includesTitle: 'Includes',
            includes: ['Front or four-wheel alignment', 'Steering & suspension check', 'Tire wear analysis'],
            ratesTitle: 'Standard services rates',
            rates: ['Four-wheel alignment', '$120 — four-way alignment'],
            ctaLabel: 'Book alignment',
        },
    },
} as const;

export default en;
