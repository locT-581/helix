/**
 * @helix/timeline - Core Exports
 *
 * REUSED from @twick/timeline core package.
 * All classes and logic copied from Twick, adapted for mobile usage.
 */

// Elements (100% REUSED from Twick)
export { TrackElement } from './elements/base.element';
export { VideoElement } from './elements/video.element';
export { AudioElement } from './elements/audio.element';
export { ImageElement } from './elements/image.element';
export { TextElement } from './elements/text.element';
export { CaptionElement } from './elements/caption.element';
export { RectElement } from './elements/rect.element';
export { CircleElement } from './elements/circle.element';
export { IconElement } from './elements/icon.element';

// Track (100% REUSED from Twick)
export { Track } from './track/track';

// Editor (100% REUSED from Twick)
export { TimelineEditor } from './editor/timeline.editor';

// Visitor Pattern (100% REUSED from Twick)
export type { ElementVisitor } from './visitor/element-visitor';
export { ElementAdder } from './visitor/element-adder';
export { ElementUpdater } from './visitor/element-updater';
export { ElementRemover } from './visitor/element-remover';
export { ElementSplitter } from './visitor/element-splitter';
export { ElementSerializer } from './visitor/element-serializer';
export { ElementDeserializer } from './visitor/element-deserializer';
export { ElementValidator } from './visitor/element-validator';
