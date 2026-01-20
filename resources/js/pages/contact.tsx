import { Head } from '@inertiajs/react';

import heroBackgroundImage from '../../images/first_section.png';
import Layout from '../components/layout/Layout';
import ContactSection from '../components/services/ContactSection';
import LocationSection from '../components/services/LocationSection';
import OurServicesSection from '../components/services/OurServicesSection';

export default function Contact() {
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
            <Head title="Contact" />

            <div className="space-y-0 bg-[#f5f5f5]">
                <OurServicesSection
                    title="Contact us"
                    description="Have questions about our services, scheduling, or your vehicle? Send us a message and our team will respond quickly with the details you need to get back on the road."
                    showButton={false}
                />
                <ContactSection />
                <LocationSection />
            </div>
        </Layout>
    );
}
