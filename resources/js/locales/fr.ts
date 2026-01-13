const fr = {
    code: 'FR',
    name: 'Français',
    flag: '🇫🇷',
    nav: {
        home: 'Accueil',
        about: 'À propos',
        services: 'Services',
        contact: 'Contact',
    },
    cta: {
        serviceButton: 'Nos services',
    },
    services: {
        newTires: {
            title: 'Pneus neufs',
            description: 'Pneus neufs de qualité installés et équilibrés sur place avec des marques de confiance.',
            includesTitle: 'Comprend',
            includes: ['Large choix de marques et tailles', 'Montage et équilibrage professionnels', 'Inspection de sécurité'],
            ratesTitle: 'Tarifs standards',
            rates: [
                'Équilibrage',
                '25 $ par pneu — poids adhésifs',
                '22 $ par pneu — poids clipsés',
                'Capteurs TPMS',
                '85 $ par capteur (installation et programmation incluses)',
            ],
            ctaLabel: 'Appelez pour disponibilité',
        },
        alignments: {
            title: 'Alignements',
            description: 'Alignement de précision pour améliorer la sécurité, la tenue de route et la durée de vie des pneus.',
            includesTitle: 'Comprend',
            includes: ['Alignement avant ou quatre roues', 'Vérification direction et suspension', 'Analyse de l’usure des pneus'],
            ratesTitle: 'Tarifs standards',
            rates: ['Alignement quatre roues', '120 $ — alignement quatre points'],
            ctaLabel: 'Réserver un alignement',
        },
    },
} as const;

export default fr;
