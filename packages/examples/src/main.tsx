import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './global.css';
import { registerServiceWorker } from './utils/service-worker';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker for PWA
if (import.meta.env.PROD) {
  registerServiceWorker().catch((error) => {
    console.error('Service worker registration failed:', error);
  });
}
