# @helix/canvas

Mobile-first canvas engine for timeline-based video editing. Built with **Konva.js** for lightweight, performant rendering on mobile devices.

## 📦 Features

- ✅ **Element Rendering**: Video, image, text, shapes (rect, circle)
- ✅ **Layer Management**: Z-index, reordering, grouping
- ✅ **Touch Controls**: Pan, pinch-zoom, drag, resize
- ✅ **Transform**: Rotate, scale, position with mobile-friendly handles
- ✅ **Mobile-Optimized**: 44px min touch targets, gesture-based UI
- 🦀 **Performance**: Konva.js (93kb) vs Fabric.js (229kb) - 59% smaller

## 🚀 Installation

```bash
pnpm add @helix/canvas
```

## 📖 Usage

```typescript
import { useHelixCanvas, addImageElement, addTextElement } from '@helix/canvas';

const CanvasEditor = () => {
  const { stageRef, addElement } = useHelixCanvas({
    width: 1920,
    height: 1080,
    onCanvasReady: (stage) => console.log('Canvas ready'),
  });

  const handleAddImage = () => {
    addElement({
      type: 'image',
      src: 'image.jpg',
      x: 100,
      y: 100,
      width: 400,
      height: 300,
    });
  };

  return (
    <div>
      <Stage ref={stageRef} width={1920} height={1080} />
      <button onClick={handleAddImage}>Add Image</button>
    </div>
  );
};
```

## 🔄 Code Reuse from Twick

- ✅ **80% copied** from `@twick/canvas`:
  - Canvas operations logic (add, update, remove, layer management)
  - Element rendering patterns
  - Coordinate conversion utilities
  - Selection logic
- 🔧 **20% adapted** for mobile:
  - Fabric.js → Konva.js API migration
  - Mouse events → Touch gestures
  - Desktop transform controls → Mobile-friendly (44px targets)

## 📐 API Reference

See [Architecture Documentation](../../MOBILE_VIDEO_EDITOR_PLAN.md#week-7-8-canvas--media-handling) for detailed API.

## 🎯 Design Principles

1. **Mobile-First**: Touch-optimized UI, 44px min targets
2. **Code Reuse**: Copy 80% from Twick, adapt 20% for mobile
3. **Performance**: Konva.js for lighter bundle, 60fps target
4. **Zero Dependencies**: Only React, Konva, @helix/core, @helix/media

## 📄 License

See LICENSE.md in the root directory.
