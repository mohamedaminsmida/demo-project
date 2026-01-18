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
        ourServices: {
            title: 'Nuestros servicios',
            description:
                'En Luque Tires ofrecemos cuidado completo de llantas, mantenimiento esencial y reparaciones expertas — con precios honestos, servicio rápido y atención bilingüe. Elige una categoría para conocer lo que ofrecemos.',
        },
        tiresWheels: {
            title: 'Llantas y rines',
            usedTires: {
                title: 'Llantas usadas',
                description: 'Llantas usadas económicas, revisadas para seguridad y buen rendimiento.',
                includesTitle: 'Incluye',
                includes: ['Inspección antes de la venta', 'Montaje y balanceo', 'Opciones de garantía'],
                ratesTitle: 'Tarifas estándar',
                rates: [
                    'Reparaciones de pinchazos',
                    '$30 + impuestos (13"–18")',
                    '$35 + impuestos (19"–22")',
                    'Rotación de llantas',
                    '$45 (cuando las llantas no se compran en la tienda)',
                ],
                ctaLabel: 'Reservar ahora',
            },
            wheels: {
                title: 'Rines',
                description: 'Instalación, reemplazo y mejoras de rines para estética y rendimiento.',
                includesTitle: 'Incluye',
                includes: ['Montaje de rines', 'Balanceo', 'Asistencia de compatibilidad'],
                ratesTitle: 'Tarifas estándar',
                rates: ['Desmontaje + desecho', '$35 por llanta (13"–17")', '$45 por llanta (18"–20")'],
                ctaLabel: 'Reservar ahora',
            },
        },
        maintenance: {
            title: 'Mantenimiento',
            subtitle: 'Mantén tu vehículo funcionando al máximo.',
            items: {
                'oil-changes': {
                    title: 'Cambio de aceite',
                    description: 'Cambios de aceite rápidos y limpios para proteger el motor y mejorar el rendimiento.',
                    bullets: ['Opciones convencional / sintética', 'Cambio de filtro', 'Revisión multipunto'],
                    ctaLabel: 'Reservar ahora',
                },
                brakes: {
                    title: 'Frenos',
                    description: 'Inspecciones y reparaciones confiables de frenos para tu seguridad en el camino.',
                    bullets: ['Reemplazo de pastillas y rotores', 'Diagnóstico de calipers', 'Purgado o cambio de líquido'],
                    ctaLabel: 'Reservar ahora',
                },
            },
        },
        repairs: {
            title: 'Reparaciones',
            items: {
                transmissions: {
                    title: 'Transmisiones',
                    description:
                        'Diagnóstico, servicio y reemplazo de transmisión profesional. Inspecciones y reparaciones confiables de frenos para tu seguridad en el camino.',
                    bullets: ['Servicio de fluido', 'Reparación de transmisión', 'Reconstrucción o reemplazo completo'],
                    ctaLabel: 'Reservar ahora',
                },
                'engine-replacement': {
                    title: 'Reemplazo de motor',
                    description: 'Reemplazo completo de motor con precisión y piezas de alta calidad.',
                    bullets: ['Suministro de motor', 'Instalación', 'Pruebas finales y ajuste'],
                    ctaLabel: 'Reservar ahora',
                },
                'lift-kits': {
                    title: 'Kits de elevación',
                    description: 'Mejora la altura y la suspensión con instalación profesional de kit.',
                    bullets: ['Instalación del kit', 'Alineación después de la instalación', 'Inspección de seguridad'],
                    ctaLabel: 'Reservar ahora',
                },
            },
        },
        quote: {
            lineOne: 'Desde el mantenimiento diario hasta reparaciones mayores',
            lineTwo: 'Estamos listos para ayudarte.',
        },
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
    footer: {
        about:
            'Luque Tires comenzó como un pequeño taller familiar con un objetivo sencillo: mantener a nuestros vecinos seguros en la carretera. Fundado en la confianza, la honestidad y el trabajo duro, pronto nos convertimos en algo más que un lugar para comprar llantas: nos volvimos parte de la comunidad.',
        contact: {
            title: 'Información de contacto',
            phone: '+1 360-736-8313',
            email: 'info@luquetires.com',
            address: '332 Fair St, Centralia, WA 98531',
        },
        languageToggle: '(EN/ES)',
        quickLinks: {
            title: 'Enlaces rápidos',
            items: {
                home: 'Inicio',
                about: 'Acerca de',
                services: 'Servicios',
                contact: 'Contacto',
            },
        },
        workingHours: {
            title: 'Horario de atención',
            items: [
                { label: 'Lun–Vie', value: '9:00 AM – 6:00 PM' },
                { label: 'Sáb', value: '9:00 AM – 5:00 PM' },
                { label: 'Dom', value: 'Cerrado' },
            ],
        },
        privacy: {
            line: 'Política de privacidad – © {year} Luque Tires',
            link: 'Política de privacidad',
        },
    },
} as const;

export default es;
