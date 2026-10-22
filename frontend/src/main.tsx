import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/common/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Manage service worker: NEVER enable caching SW in Vite DEV mode as it causes blank white screens
if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    // Proactively clean up any previously registered service workers on localhost
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then(() => {
          console.log('[Wellora Dev] Unregistered stale service worker:', registration.scope);
        });
      }
    });
    // Purge caches on dev
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) caches.delete(key);
      });
    }
  } else {
    // Only register service worker for installable PWA app in production build
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('[Wellora PWA] Service Worker registered:', reg.scope);
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[Wellora PWA] New version available — reload to update.');
                }
              });
            }
          });
        })
        .catch(err => console.warn('[Wellora PWA] Service Worker registration failed:', err));
    });
  }
}

// Capture the PWA install prompt event so we can trigger it from UI
let deferredInstallPrompt: any = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  window.dispatchEvent(new CustomEvent('wellora-pwa-installable'));
  console.log('[Wellora PWA] App is installable!');
});

// Export for use in components
(window as any).__wellora_pwa_install = async () => {
  if (!deferredInstallPrompt) return false;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  return outcome === 'accepted';
};

window.addEventListener('appinstalled', () => {
  console.log('[Wellora PWA] App installed successfully!');
  deferredInstallPrompt = null;
});
