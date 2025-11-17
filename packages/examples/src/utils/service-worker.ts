/**
 * Service Worker Registration Utility
 * 
 * Registers service worker for PWA functionality.
 * Handles updates, errors, and offline detection.
 */

/**
 * Register service worker
 * 
 * @returns Promise resolving to ServiceWorkerRegistration or void
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | void> => {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported in this browser');
    return;
  }

  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registered:', registration.scope);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          console.log('New Service Worker available');
          
          // Notify user about update
          if (confirm('A new version is available. Reload to update?')) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        }
      });
    });

    // Listen for controlling service worker changes
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

/**
 * Unregister service worker
 * 
 * @returns Promise resolving to boolean
 */
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const success = await registration.unregister();
      console.log('Service Worker unregistered:', success);
      return success;
    }
    return false;
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
    return false;
  }
};

/**
 * Check if app is running offline
 * 
 * @returns boolean indicating offline status
 */
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

/**
 * Add offline/online event listeners
 * 
 * @param onOffline - Callback when app goes offline
 * @param onOnline - Callback when app comes back online
 * @returns Cleanup function
 */
export const addNetworkListeners = (
  onOffline: () => void,
  onOnline: () => void
): (() => void) => {
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);

  return () => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  };
};

/**
 * Check service worker status
 * 
 * @returns Object with registration status and state
 */
export const getServiceWorkerStatus = async (): Promise<{
  registered: boolean;
  state: ServiceWorkerState | 'none';
  scope?: string;
}> => {
  if (!('serviceWorker' in navigator)) {
    return { registered: false, state: 'none' };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
      return { registered: false, state: 'none' };
    }

    const worker = registration.active || registration.waiting || registration.installing;
    
    return {
      registered: true,
      state: worker?.state || 'none',
      scope: registration.scope,
    };
  } catch (error) {
    console.error('Failed to get service worker status:', error);
    return { registered: false, state: 'none' };
  }
};
