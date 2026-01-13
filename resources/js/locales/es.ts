const es = {
    code: 'ES',
    name: 'Español',
    flag: '🇪🇸',
    nav: {
        home: 'Inicio',
        about: 'Acerca de',
        services: 'Servicios',
        contact: 'Contacto',
    },
    cta: {
        serviceButton: 'Explorar servicios de llantas',
    },
    services: {
        newTires: {
            title: 'Llantas nuevas',
            description: 'Llantas nuevas de alta calidad de marcas confiables, instaladas y balanceadas en el acto.',
            includesTitle: 'Incluye',
            includes: ['Amplia selección de marcas y tamaños', 'Montaje y balanceo profesional', 'Inspección de seguridad'],
            ratesTitle: 'Tarifas estándar',
            rates: [
                'Balanceo',
                '$25 por llanta — pesos adhesivos',
                '$22 por llanta — pesos con clip',
                'Sensores TPMS',
                '$85 por sensor (instalación y programación incluidas)',
            ],
            ctaLabel: 'Consulta disponibilidad',
        },
        alignments: {
            title: 'Alineaciones',
            description: 'Alineación precisa para mejorar la seguridad, el manejo y la vida útil de las llantas.',
            includesTitle: 'Incluye',
            includes: ['Alineación delantera o de cuatro ruedas', 'Revisión de dirección y suspensión', 'Análisis del desgaste de llantas'],
            ratesTitle: 'Tarifas estándar',
            rates: ['Alineación de cuatro ruedas', '$120 — alineación de cuatro vías'],
            ctaLabel: 'Reservar alineación',
        },
    },
} as const;

export default es;
