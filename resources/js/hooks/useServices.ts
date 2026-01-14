import { useEffect, useState } from 'react';
import type { ServiceConfig } from '../config/services';

interface UseServicesReturn {
    services: ServiceConfig[];
    loading: boolean;
    error: string | null;
}

export function useServices(): UseServicesReturn {
    const [services, setServices] = useState<ServiceConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchServices() {
            try {
                const response = await fetch('/api/services');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }

                const data = await response.json();
                setServices(data.services);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching services:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, []);

    return { services, loading, error };
}
