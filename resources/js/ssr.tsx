import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

import { LocaleProvider } from './locales/LocaleProvider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) => {
            if (name !== 'BookService') {
                name = 'BookService';
            }

            return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/BookService.tsx'));
        },
        setup: ({ App, props }) => (
            <LocaleProvider>
                <App {...props} />
            </LocaleProvider>
        ),
    }),
);
