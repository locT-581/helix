import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Navigation Store
 * 
 * Zustand store for mobile navigation state management.
 * Persists navigation state to localStorage for deep linking support.
 */

export type NavigationTab = 'editor' | 'timeline' | 'elements' | 'settings';

export interface NavigationState {
  /** Current active tab */
  currentTab: NavigationTab;
  
  /** Navigation history stack */
  history: NavigationTab[];
  
  /** Set current tab */
  setCurrentTab: (tab: NavigationTab) => void;
  
  /** Go back to previous tab */
  goBack: () => void;
  
  /** Clear navigation history */
  clearHistory: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      currentTab: 'editor',
      history: [],
      
      setCurrentTab: (tab) =>
        set((state) => ({
          currentTab: tab,
          history: [...state.history, state.currentTab],
        })),
      
      goBack: () =>
        set((state) => {
          const newHistory = [...state.history];
          const previousTab = newHistory.pop();
          
          return {
            currentTab: previousTab ?? 'editor',
            history: newHistory,
          };
        }),
      
      clearHistory: () =>
        set({
          history: [],
        }),
    }),
    {
      name: 'helix-navigation', // localStorage key
      partialize: (state) => ({
        currentTab: state.currentTab,
        // Don't persist history to avoid stale state on app restart
      }),
    }
  )
);

/**
 * Editor Store
 * 
 * Global editor state management (timeline, selected elements, playback).
 */

export interface EditorState {
  /** Current playback time (seconds) */
  currentTime: number;
  
  /** Is video playing */
  isPlaying: boolean;
  
  /** Selected element IDs */
  selectedElementIds: string[];
  
  /** Playback volume (0-1) */
  volume: number;
  
  /** Zoom level (timeline) */
  zoom: number;
  
  /** Set current time */
  setCurrentTime: (time: number) => void;
  
  /** Toggle play/pause */
  togglePlayPause: () => void;
  
  /** Set selected elements */
  setSelectedElements: (ids: string[]) => void;
  
  /** Set volume */
  setVolume: (volume: number) => void;
  
  /** Set zoom level */
  setZoom: (zoom: number) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      currentTime: 0,
      isPlaying: false,
      selectedElementIds: [],
      volume: 1,
      zoom: 1,
      
      setCurrentTime: (time) =>
        set({
          currentTime: time,
        }),
      
      togglePlayPause: () =>
        set((state) => ({
          isPlaying: !state.isPlaying,
        })),
      
      setSelectedElements: (ids) =>
        set({
          selectedElementIds: ids,
        }),
      
      setVolume: (volume) =>
        set({
          volume,
        }),
      
      setZoom: (zoom) =>
        set({
          zoom,
        }),
    }),
    {
      name: 'helix-editor',
      partialize: (state) => ({
        volume: state.volume,
        zoom: state.zoom,
        // Don't persist playback state
      }),
    }
  )
);
