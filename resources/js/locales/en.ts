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
    contactSection: {
        title: 'Contact us',
        description:
            'Have questions or need tire service today? We’re here to help! Whether you’re looking for new tires, a quick repair, or same-day service, our team is just a call or message away. Visit our shop during business hours, give us a call, or simply fill out the contact form below and we’ll get back to you as soon as possible.',
        panelTitle: 'Send a Message',
        info: {
            location: 'Location',
            phone: 'Phone',
            email: 'Email',
        },
        hours: {
            title: 'Open Hours',
            closedLabel: 'Closed',
            dayAbbrev: {
                monday: 'Mon',
                tuesday: 'Tue',
                wednesday: 'Wed',
                thursday: 'Thu',
                friday: 'Fri',
                saturday: 'Sat',
                sunday: 'Sun',
            },
        },
        form: {
            nameLabel: 'Name',
            namePlaceholder: 'Full name',
            emailLabel: 'Email',
            emailPlaceholder: 'you@example.com',
            phoneLabel: 'Phone',
            phonePlaceholder: '(555) 123-4567',
            serviceLabel: 'Interested Service',
            servicePlaceholder: 'Select a service',
            serviceOptions: [
                { value: 'new-used-tires', label: 'New & Used Tires' },
                { value: 'mounting-balancing', label: 'Mounting & Balancing' },
                { value: 'repairs-valve', label: 'Repairs & Valve Replacement' },
                { value: 'same-day', label: 'Same-Day Service' },
                { value: 'not-sure', label: 'Not sure – please advise' },
            ],
            vehicleLabel: 'Vehicle Type',
            vehiclePlaceholder: 'Select vehicle type',
            vehicleOptions: [
                { value: 'car', label: 'Cars' },
                { value: 'light-truck', label: 'Light Trucks / SUVs' },
                { value: 'truck', label: 'Trucks' },
                { value: 'motorcycle', label: 'Motorcycles & Scooters' },
                { value: 'van', label: 'Vans & Minivans' },
                { value: 'other', label: 'Other' },
            ],
            messageLabel: 'Message',
            messagePlaceholder: 'Tell us how we can help',
            submitLabel: 'Submit Request',
        },
    },
    footer: {
        about:
            'Luque Tires began as a small, family-run shop with one simple goal: to keep our neighbors safe on the road. Founded on trust, honesty, and hard work, we quickly became more than just a place to buy tires—we became part of the community.',
        contact: {
            title: 'Contact info',
            phone: '+1 360-736-8313',
            email: 'info@luquetires.com',
            address: '332 Fair St, Centralia, WA 98531',
        },
        languageToggle: '(EN/ES)',
        quickLinks: {
            title: 'Quick Links',
            items: {
                home: 'Home',
                about: 'About us',
                services: 'Services',
                contact: 'Contact us',
            },
        },
        workingHours: {
            title: 'Working Hours',
            items: [
                { label: 'Mon–Fri', value: '9:00 AM – 6:00 PM' },
                { label: 'Sat', value: '9:00 AM – 5:00 PM' },
                { label: 'Sun', value: 'Closed' },
            ],
        },
        privacy: {
            line: 'Privacy Policy © {year} Luque Tires',
            link: 'Privacy Policy',
        },
    },
} as const;

export default en;
