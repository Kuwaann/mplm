import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/ThemeProvider';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
        const page = pages[`./pages/${name}.jsx`];
        if (!page) {
            console.error(`Page [${name}] not found in ./pages/`);
            return;
        }
        const component = page.default || page;
        // Support persistent layouts via .layout property
        if (component.layout === undefined) {
            // No default layout override here — pages define their own
        }
        return component;
    },

    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
    },
});