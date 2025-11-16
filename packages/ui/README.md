# @helix/ui

Mobile-first React component library for Helix video editor.

## Features

- **Mobile-First Design** - Optimized for touch interfaces with 44px minimum touch targets
- **Stitches CSS-in-JS** - Type-safe styling with near-zero runtime
- **Radix UI Primitives** - Accessible, unstyled components
- **Dark Theme Support** - Built-in light and dark themes
- **React 19 Ready** - Uses latest React features

## Installation

```bash
pnpm add @helix/ui
```

## Usage

```tsx
import { Button } from '@helix/ui';
import { styled, darkTheme } from '@helix/ui/stitches.config';

const App = () => (
  <div className={darkTheme}>
    <Button variant="primary" size="lg">
      Edit Video
    </Button>
  </div>
);
```

## Components

- `Button` - Touch-optimized button with variants
- `Input` - Text input with validation states
- `Select` - Dropdown select (Radix UI)
- `Slider` - Range slider (Radix UI)
- `Switch` - Toggle switch (Radix UI)
- `Dialog` - Modal dialog (Radix UI)
- `Tooltip` - Hover tooltip (Radix UI)

## Theme Tokens

See `stitches.config.ts` for full token reference.

## License

MIT
