// Components
export { MobileAppShell } from './components/MobileAppShell';
export type { MobileAppShellProps } from './components/MobileAppShell';

export { BottomSheet } from './components/BottomSheet';
export type { BottomSheetProps } from './components/BottomSheet';

export { VideoPreview } from './components/VideoPreview';
export type { VideoPreviewProps } from './components/VideoPreview';

// Hooks - Gestures
export {
  useTap,
  useDoubleTap,
  useLongPress,
  useSwipe,
  usePinchZoom,
  useDragElement,
  useCombinedGestures,
} from './hooks/use-gestures';

// Hooks - Haptic Feedback
export {
  isHapticSupported,
  triggerHaptic,
  cancelHaptic,
  HapticPattern,
  useHapticFeedback,
  useTapWithHaptic,
  useSwipeWithHaptic,
} from './hooks/use-haptic';

// Hooks - Deep Linking
export {
  parseDeepLink,
  generateDeepLink,
  useDeepLink,
  useSyncUrlWithState,
  shareEditorState,
} from './hooks/use-deep-link';
export type { DeepLinkParams } from './hooks/use-deep-link';

// Store
export { useNavigationStore, useEditorStore } from './store/navigation';
export type { NavigationState, NavigationTab, EditorState } from './store/navigation';
