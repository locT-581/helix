// Components
export { MobileAppShell } from './components/MobileAppShell';
export type { MobileAppShellProps } from './components/MobileAppShell';

export { BottomSheet } from './components/BottomSheet';
export type { BottomSheetProps } from './components/BottomSheet';

export { VideoPreview } from './components/VideoPreview';
export type { VideoPreviewProps } from './components/VideoPreview';

// Export Components
export { ExportBottomSheet } from './components/export';
export type { ExportBottomSheetProps } from './components/export';

// Timeline Components
export {
  TimelineContainer,
  TimelineRuler,
  Playhead,
  TimelineTrack,
  TimelineElement,
  ZoomControls,
} from './components/timeline';
export type {
  TimelineContainerProps,
  TimelineRulerProps,
  PlayheadLineProps,
  TimelineTrackProps,
  TimelineElementProps,
  ZoomControlsProps,
} from './components/timeline';

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

// Hooks - Export
export { useExportManager } from './hooks/use-export-manager';
export type { UseExportManagerOptions, UseExportManagerReturn } from './hooks/use-export-manager';

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

// Export Services
export {
  VideoRenderer,
  AudioMixer,
  ExportEngine,
  MP4Muxer,
  WebMMuxer,
  createMuxer,
  isWebCodecsAvailable,
  getSupportedVideoCodecs,
  getSupportedAudioCodecs,
} from './services';
export type {
  FrameData,
  AudioSegment,
  MuxerConfig,
  TimelineData,
  VideoTrack,
  VideoElement,
  AudioTrack,
  AudioElement,
  TextOverlay,
} from './services';

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
