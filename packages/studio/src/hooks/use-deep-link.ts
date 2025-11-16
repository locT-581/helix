/**
 * Deep Linking Utilities
 * 
 * URL-based navigation and state restoration.
 * Enables sharing specific editor states via URLs.
 * 
 * @example
 * ```
 * // URL format:
 * /editor?tab=timeline&time=5.5&element=abc123
 * /editor?tab=elements&category=video
 * /editor?tab=settings
 * ```
 */

import { useNavigationStore, type NavigationTab } from '../store/navigation';
import { useEditorStore } from '../store/navigation';
import { useEffect } from 'react';

/**
 * Deep link parameters
 */
export interface DeepLinkParams {
  /** Target tab */
  tab?: NavigationTab;
  
  /** Playback time (seconds) */
  time?: number;
  
  /** Selected element ID */
  element?: string;
  
  /** Media category filter */
  category?: string;
  
  /** Project ID */
  project?: string;
}

/**
 * Parse deep link from URL search params
 * 
 * @example
 * ```tsx
 * const params = parseDeepLink(window.location.search);
 * // { tab: 'timeline', time: 5.5 }
 * ```
 */
export const parseDeepLink = (search: string): DeepLinkParams => {
  const params = new URLSearchParams(search);
  
  const result: DeepLinkParams = {};
  
  const tab = params.get('tab');
  if (tab && isValidTab(tab)) {
    result.tab = tab as NavigationTab;
  }
  
  const time = params.get('time');
  if (time) {
    const parsed = Number.parseFloat(time);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      result.time = parsed;
    }
  }
  
  const element = params.get('element');
  if (element) {
    result.element = element;
  }
  
  const category = params.get('category');
  if (category) {
    result.category = category;
  }
  
  const project = params.get('project');
  if (project) {
    result.project = project;
  }
  
  return result;
};

/**
 * Generate deep link URL from params
 * 
 * @example
 * ```tsx
 * const url = generateDeepLink({ tab: 'timeline', time: 5.5 });
 * // "/editor?tab=timeline&time=5.5"
 * ```
 */
export const generateDeepLink = (params: DeepLinkParams): string => {
  const searchParams = new URLSearchParams();
  
  if (params.tab) {
    searchParams.set('tab', params.tab);
  }
  
  if (params.time !== undefined) {
    searchParams.set('time', params.time.toString());
  }
  
  if (params.element) {
    searchParams.set('element', params.element);
  }
  
  if (params.category) {
    searchParams.set('category', params.category);
  }
  
  if (params.project) {
    searchParams.set('project', params.project);
  }
  
  const query = searchParams.toString();
  return query ? `/editor?${query}` : '/editor';
};

/**
 * Validate tab name
 */
const isValidTab = (tab: string): boolean => {
  return ['editor', 'timeline', 'elements', 'settings'].includes(tab);
};

/**
 * Hook to handle deep link navigation
 * 
 * @example
 * ```tsx
 * const App = () => {
 *   useDeepLink();
 *   // App will automatically navigate based on URL params
 * };
 * ```
 */
export const useDeepLink = () => {
  const { setCurrentTab } = useNavigationStore();
  const { setCurrentTime, setSelectedElements } = useEditorStore();
  
  useEffect(() => {
    // Parse deep link on mount
    const params = parseDeepLink(window.location.search);
    
    // Apply deep link state
    if (params.tab) {
      setCurrentTab(params.tab);
    }
    
    if (params.time !== undefined) {
      setCurrentTime(params.time);
    }
    
    if (params.element) {
      setSelectedElements([params.element]);
    }
    
    // Listen for popstate (browser back/forward)
    const handlePopState = () => {
      const newParams = parseDeepLink(window.location.search);
      
      if (newParams.tab) {
        setCurrentTab(newParams.tab);
      }
      
      if (newParams.time !== undefined) {
        setCurrentTime(newParams.time);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setCurrentTab, setCurrentTime, setSelectedElements]);
};

/**
 * Hook to update URL when state changes
 * 
 * @example
 * ```tsx
 * const App = () => {
 *   useSyncUrlWithState();
 *   // URL will update when tab/time changes
 * };
 * ```
 */
export const useSyncUrlWithState = () => {
  const { currentTab } = useNavigationStore();
  const { currentTime, selectedElementIds } = useEditorStore();
  
  useEffect(() => {
    const params: DeepLinkParams = {
      tab: currentTab,
    };
    
    if (currentTime > 0) {
      params.time = currentTime;
    }
    
    if (selectedElementIds[0]) {
      params.element = selectedElementIds[0];
    }
    
    const url = generateDeepLink(params);
    
    // Update URL without reloading page
    window.history.replaceState({}, '', url);
  }, [currentTab, currentTime, selectedElementIds]);
};

/**
 * Share editor state via deep link
 * 
 * @example
 * ```tsx
 * const handleShare = () => {
 *   const url = shareEditorState({ tab: 'timeline', time: 10.5 });
 *   navigator.share({ url });
 * };
 * ```
 */
export const shareEditorState = (params: DeepLinkParams): string => {
  const url = generateDeepLink(params);
  const fullUrl = `${window.location.origin}${url}`;
  
  // Copy to clipboard if Web Share API not available
  if ('share' in navigator) {
    (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share?.({
      title: 'Helix Editor',
      text: 'Check out my video project',
      url: fullUrl,
    }).catch(() => {
      // Fallback: copy to clipboard if supported
      if ('clipboard' in navigator) {
        (navigator as Navigator & { clipboard?: { writeText: (text: string) => Promise<void> } }).clipboard?.writeText(fullUrl).catch(() => {
          console.warn('Failed to copy to clipboard');
        });
      }
    });
  } else if ('clipboard' in navigator) {
    (navigator as Navigator & { clipboard?: { writeText: (text: string) => Promise<void> } }).clipboard?.writeText(fullUrl).catch(() => {
      console.warn('Failed to copy to clipboard');
    });
  }
  
  return fullUrl;
};
