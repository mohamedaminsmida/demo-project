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
        ourServices: {
            title: 'Nos services',
            description:
                'Chez Luque Tires, nous proposons des pneus complets, un entretien essentiel et des réparations expertes — le tout avec des tarifs honnêtes, un service rapide et un accueil bilingue. Choisissez une catégorie ci-dessous pour découvrir nos services.',
        },
        tiresWheels: {
            title: 'Pneus & roues',
            usedTires: {
                title: 'Pneus usagés',
                description: 'Des pneus usagés économiques, vérifiés pour la sécurité et la performance.',
                includesTitle: 'Comprend',
                includes: ['Inspection avant vente', 'Montage et équilibrage', 'Options de garantie'],
                ratesTitle: 'Tarifs standards',
                rates: [
                    'Réparations de crevaison',
                    '30 $ + taxes (13"–18")',
                    '35 $ + taxes (19"–22")',
                    'Rotation des pneus',
                    '45 $ (si les pneus ne sont pas achetés sur place)',
                ],
                ctaLabel: 'Réserver',
            },
            wheels: {
                title: 'Roues',
                description: 'Installation, remplacement et amélioration des roues pour le style et la performance.',
                includesTitle: 'Comprend',
                includes: ['Montage des roues', 'Équilibrage', 'Assistance au fitment'],
                ratesTitle: 'Tarifs standards',
                rates: ['Démontage + mise au rebut', '35 $ par pneu (13"–17")', '45 $ par pneu (18"–20")'],
                ctaLabel: 'Réserver',
            },
        },
        maintenance: {
            title: 'Entretien',
            subtitle: 'Gardez votre véhicule au meilleur de sa forme.',
            items: {
                'oil-changes': {
                    title: 'Changements d’huile',
                    description: 'Changements d’huile rapides et propres pour protéger votre moteur et améliorer les performances.',
                    bullets: ['Options conventionnelle / synthétique', 'Remplacement du filtre', 'Contrôle multi-points'],
                    ctaLabel: 'Réserver',
                },
                brakes: {
                    title: 'Freins',
                    description: 'Inspections et réparations fiables des freins pour votre sécurité sur la route.',
                    bullets: ['Remplacement des plaquettes et disques', 'Diagnostic des étriers', 'Purge ou remplacement du liquide'],
                    ctaLabel: 'Réserver',
                },
            },
        },
        repairs: {
            title: 'Réparations',
            items: {
                transmissions: {
                    title: 'Transmissions',
                    description:
                        'Diagnostic, entretien et remplacement de transmission par des professionnels. Inspections et réparations fiables des freins pour votre sécurité sur la route.',
                    bullets: ['Service du fluide', 'Réparation de transmission', 'Reconstruction complète ou remplacement'],
                    ctaLabel: 'Réserver',
                },
                'engine-replacement': {
                    title: 'Remplacement du moteur',
                    description: 'Remplacement complet du moteur avec précision et pièces de qualité.',
                    bullets: ['Approvisionnement moteur', 'Installation', 'Tests finaux et réglages'],
                    ctaLabel: 'Réserver',
                },
                'lift-kits': {
                    title: 'Kits de rehausse',
                    description: 'Augmentez la hauteur et la suspension avec une installation professionnelle.',
                    bullets: ['Pose du kit', 'Alignement après installation', 'Inspection de sécurité'],
                    ctaLabel: 'Réserver',
                },
            },
        },
        quote: {
            lineOne: 'De l’entretien quotidien aux grosses réparations',
            lineTwo: 'Nous sommes là pour vous.',
        },
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
    contactSection: {
        title: 'Contactez-nous',
        description:
            'Des questions ou besoin d’un service de pneus aujourd’hui ? Nous sommes là pour vous aider ! Que vous cherchiez des pneus neufs, une réparation rapide ou un service le jour même, notre équipe est à un appel ou un message près. Passez en magasin pendant les heures d’ouverture, appelez-nous ou remplissez le formulaire ci-dessous et nous vous répondrons rapidement.',
        panelTitle: 'Envoyer un message',
        info: {
            location: 'Adresse',
            phone: 'Téléphone',
            email: 'Email',
        },
        hours: {
            title: "Heures d'ouverture",
            closedLabel: 'Fermé',
            dayAbbrev: {
                monday: 'Lun',
                tuesday: 'Mar',
                wednesday: 'Mer',
                thursday: 'Jeu',
                friday: 'Ven',
                saturday: 'Sam',
                sunday: 'Dim',
            },
        },
        form: {
            nameLabel: 'Nom',
            namePlaceholder: 'Nom complet',
            emailLabel: 'Email',
            emailPlaceholder: 'vous@exemple.com',
            phoneLabel: 'Téléphone',
            phonePlaceholder: '(555) 123-4567',
            serviceLabel: 'Service souhaité',
            servicePlaceholder: 'Sélectionnez un service',
            serviceOptions: [
                { value: 'new-used-tires', label: 'Pneus neufs et usagés' },
                { value: 'mounting-balancing', label: 'Montage et équilibrage' },
                { value: 'repairs-valve', label: 'Réparations et valve' },
                { value: 'same-day', label: 'Service le jour même' },
                { value: 'not-sure', label: 'Je ne sais pas — conseillez-moi' },
            ],
            vehicleLabel: 'Type de véhicule',
            vehiclePlaceholder: 'Sélectionnez le type de véhicule',
            vehicleOptions: [
                { value: 'car', label: 'Voitures' },
                { value: 'light-truck', label: 'Camionnettes / VUS' },
                { value: 'truck', label: 'Camions' },
                { value: 'motorcycle', label: 'Motos et scooters' },
                { value: 'van', label: 'Vans et minivans' },
                { value: 'other', label: 'Autre' },
            ],
            messageLabel: 'Message',
            messagePlaceholder: 'Dites-nous comment nous pouvons aider',
            submitLabel: 'Envoyer la demande',
        },
    },
    footer: {
        about:
            'Luque Tires a commencé comme un petit atelier familial avec un objectif simple : garder nos voisins en sécurité sur la route. Fondée sur la confiance, l’honnêteté et le travail acharné, l’entreprise est vite devenue plus qu’un simple magasin de pneus : nous sommes devenus une partie de la communauté.',
        contact: {
            title: 'Informations de contact',
            phone: '+1 360-736-8313',
            email: 'info@luquetires.com',
            address: '332 Fair St, Centralia, WA 98531',
        },
        languageToggle: '(EN/ES)',
        quickLinks: {
            title: 'Liens rapides',
            items: {
                home: 'Accueil',
                about: 'À propos',
                services: 'Services',
                contact: 'Contact',
            },
        },
        workingHours: {
            title: "Heures d'ouverture",
            items: [
                { label: 'Lun–Ven', value: '9:00 AM – 6:00 PM' },
                { label: 'Sam', value: '9:00 AM – 5:00 PM' },
                { label: 'Dim', value: 'Fermé' },
            ],
        },
        privacy: {
            line: 'Politique de confidentialité © {year} Luque Tires',
            link: 'Politique de confidentialité',
        },
    },
} as const;

export default fr;
