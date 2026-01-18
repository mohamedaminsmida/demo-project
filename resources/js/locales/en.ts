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
        ourServices: {
            title: 'Our Services',
            description:
                'At Luque Tires, we provide complete tire care, essential maintenance, and expert repairs — all with honest pricing, fast turnaround, and bilingual service. Choose a category below to explore what we offer.',
        },
        tiresWheels: {
            title: 'Tires & Wheels',
            usedTires: {
                title: 'Used Tires',
                description: 'Budget-friendly, safety-checked used tires that deliver performance and value.',
                includesTitle: 'Includes',
                includes: ['Inspection before sale', 'Mounting & balancing', 'Warranty options'],
                ratesTitle: 'Standard services rates',
                rates: [
                    'Flat Repairs',
                    '$30 + tax (13"–18")',
                    '$35 + tax (19"–22")',
                    'Tire Rotation',
                    '$45 (when tires are not purchased in-store)',
                ],
                ctaLabel: 'Book Now',
            },
            wheels: {
                title: 'Wheels',
                description: 'Wheel installation, replacement, and upgrades for aesthetics and performance.',
                includesTitle: 'Includes',
                includes: ['Wheel mounting', 'Balancing', 'Fitment assistance'],
                ratesTitle: 'Standard services rates',
                rates: ['Tire Dismount + Disposal', '$35 per tire (13"–17")', '$45 per tire (18"–20")'],
                ctaLabel: 'Book Now',
            },
        },
        maintenance: {
            title: 'Maintenance',
            subtitle: 'Keep your vehicle running at its best.',
            items: {
                'oil-changes': {
                    title: 'Oil Changes',
                    description: 'Quick, clean oil changes to protect your engine and improve performance.',
                    bullets: ['Conventional / synthetic options', 'Filter replacement', 'Multi-point check'],
                    ctaLabel: 'Book Now',
                },
                brakes: {
                    title: 'Brakes',
                    description: 'Reliable brake inspections and repairs to keep you safe on the road.',
                    bullets: ['Pad and rotor replacements', 'Caliper diagnostics', 'Fluid bleed or flush'],
                    ctaLabel: 'Book Now',
                },
            },
        },
        repairs: {
            title: 'Repairs',
            items: {
                transmissions: {
                    title: 'Transmissions',
                    description:
                        'Professional transmission diagnostics, service, and replacement. Reliable brake inspections and repairs to keep you safe on the road.',
                    bullets: ['Fluid service', 'Transmission repair', 'Full rebuild or replacement'],
                    ctaLabel: 'Book Now',
                },
                'engine-replacement': {
                    title: 'Engine Replacement',
                    description: 'Complete engine replacement performed with precision and high-quality parts.',
                    bullets: ['Engine sourcing', 'Installation', 'Final testing & tune'],
                    ctaLabel: 'Book Now',
                },
                'lift-kits': {
                    title: 'Lift Kits',
                    description: 'Upgrade height and suspension with professional lift kit installation.',
                    bullets: ['Lift kit fitting', 'Alignment after installation', 'Safety inspection'],
                    ctaLabel: 'Book Now',
                },
            },
        },
        quote: {
            lineOne: 'From everyday upkeep to major repairs',
            lineTwo: "We've got you covered.",
        },
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
