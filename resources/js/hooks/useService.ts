import { useEffect, useState } from 'react';
import type { ServiceConfig } from '../config/services';

interface UseServiceReturn {
    service: ServiceConfig | null;
    loading: boolean;
    error: string | null;
}

export function useService(slug: string): UseServiceReturn {
    const [service, setService] = useState<ServiceConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        async function fetchService() {
            try {
                const response = await fetch(`/api/services/${slug}`);
                
                if (!response.ok) {
                    throw new Error('Service not found');
                }

                const data = await response.json();
                setService(data.service);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching service:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchService();
    }, [slug]);

    return { service, loading, error };
}
