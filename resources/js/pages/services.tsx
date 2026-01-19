import { Head } from '@inertiajs/react';

import heroBackgroundImage from '../../images/first_section.png';
import Layout from '../components/layout/Layout';
import FaqSection from '../components/services/FaqSection';
import MaintenanceSection from '../components/services/MaintenanceSection';
import OurServicesSection from '../components/services/OurServicesSection';
import QuoteSection from '../components/services/QuoteSection';
import RepairsSection from '../components/services/RepairsSection';
import TestimonialsSection from '../components/services/TestimonialsSection';
import TiresWheelsSection from '../components/services/TiresWheelsSection';

export default function Services() {
    const heroBackground = (
        <div
            className="h-full min-h-[320px] w-full bg-cover bg-center bg-no-repeat opacity-95"
            style={{
                backgroundImage: `linear-gradient(180deg, rgba(5,5,5,0.95), rgba(5,5,5,0.88)), url(${heroBackgroundImage})`,
            }}
        />
    );

    return (
        <Layout boxed={false} backgroundColorClass="bg-[#f5f5f5f5]" background={heroBackground}>
            <Head title="Services" />

            <div className="space-y-0 bg-[#f5f5f5]">
                <OurServicesSection />
                <TiresWheelsSection />
                <MaintenanceSection />
                <QuoteSection />
                <RepairsSection />
                <TestimonialsSection />
                <FaqSection />
            </div>
        </Layout>
    );
}
