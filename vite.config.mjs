import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blogPost: resolve(__dirname, 'blog-post.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        automationPage: resolve(__dirname, 'business-processes-and-automation.html'),
        dashboard: resolve(__dirname, 'client-dashboard.html'),
        specialist: resolve(__dirname, 'specialist-dashboard.html'),
        adCancelled: resolve(__dirname, 'ad-cancelled.html'),
        adSuccess: resolve(__dirname, 'ad-success.html'),
        bookingCancelled: resolve(__dirname, 'booking-cancelled.html'),
        bookingSuccess: resolve(__dirname, 'booking-success.html'),
        notFound: resolve(__dirname, '404.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
      },
    },
  },
});
