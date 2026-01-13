import { Head } from '@inertiajs/react';

import Layout from '../components/layout/Layout';
import MaintenanceSection from '../components/services/MaintenanceSection';
import OurServicesSection from '../components/services/OurServicesSection';
import TiresWheelsSection from '../components/services/TiresWheelsSection';

export default function Services() {
    return (
        <Layout boxed={false}>
            <Head title="Services" />

            <div className="space-y-0">
                <OurServicesSection />
                <TiresWheelsSection />
                <MaintenanceSection />
            </div>
        </Layout>
    );
}
