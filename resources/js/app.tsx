import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import { LocaleProvider } from './locales/LocaleProvider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        if (name !== 'BookService') {
            name = 'BookService';
        }

        return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/BookService.tsx'));
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <LocaleProvider>
                <App {...props} />
            </LocaleProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
