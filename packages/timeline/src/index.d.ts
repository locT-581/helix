/**
 * @twick/timeline - Timeline Package
 *
 * A comprehensive timeline management system for the Twick video platform.
 * Provides track-based video editing capabilities with support for multiple
 * element types, undo/redo functionality, and real-time timeline manipulation.
 *
 * @example
 * ```jsx
 * import {
 *   TimelineProvider,
 *   TimelineEditor,
 *   Track,
 *   VideoElement,
 *   TextElement
 * } from '@twick/timeline';
 *
 * function App() {
 *   return (
 *     <TimelineProvider contextId="my-timeline">
 *       <TimelineEditor />
 *     </TimelineProvider>
 *   );
 * }
 * ```
 */
import { TIMELINE_ELEMENT_TYPE } from "./utils/constants";
import { TimelineEditor } from "./core/editor/timeline.editor";
import { TimelineProvider, type TimelineProviderProps } from "./context/timeline-context";
import { Track } from "./core/track/track";
import { CaptionElement } from "./core/elements/caption.element";
import { RectElement } from "./core/elements/rect.element";
import { TextElement } from "./core/elements/text.element";
import { ImageElement } from "./core/elements/image.element";
import { AudioElement } from "./core/elements/audio.element";
import { CircleElement } from "./core/elements/circle.element";
import { IconElement } from "./core/elements/icon.element";
import { VideoElement } from "./core/elements/video.element";
import { TrackElement } from "./core/elements/base.element";
import { ElementAnimation } from "./core/addOns/animation";
import { ElementFrameEffect } from "./core/addOns/frame-effect";
import { ElementTextEffect } from "./core/addOns/text-effect";
export { TrackElement, Track, CaptionElement, RectElement, TextElement, ImageElement, IconElement, AudioElement, CircleElement, VideoElement, ElementAnimation, ElementFrameEffect, ElementTextEffect };
export { TimelineProvider, TimelineEditor, };
export type { TimelineProviderProps };
export { TIMELINE_ELEMENT_TYPE };
export * from "./types";
export * from "./utils/constants";
export * from "./utils/timeline.utils";
export * from "./utils/easing";
export { applyEasing } from "./utils/easing";
export * from "./context/timeline-context";
export * from "./components";
export * from "./core/track/track";
export * from "./core/elements/base.element";
export * from "./core/visitor/element-visitor";
export * from "./core/visitor/element-serializer";
export * from "./core/visitor/element-deserializer";
export * from "./core/visitor/element-validator";
export * from "./core/visitor/element-adder";
export * from "./core/visitor/element-remover";
export * from "./core/visitor/element-updater";
export * from "./core/visitor/element-splitter";
export * from "./core/visitor/element-cloner";
export * from "./components";
//# sourceMappingURL=index.d.ts.map