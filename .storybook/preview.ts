import type { Preview } from '@storybook/react';
import { globalStyles } from '../packages/ui/src/stitches.config';

// Apply global styles
globalStyles();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Mobile-first viewport presets
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (375px)',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        mobileLarge: {
          name: 'Mobile Large (428px)',
          styles: {
            width: '428px',
            height: '926px',
          },
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop (905px+)',
          styles: {
            width: '905px',
            height: '1080px',
          },
        },
      },
      defaultViewport: 'mobile',
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'dark',
          value: '#0A0A0A',
        },
      ],
    },
  },
};

export default preview;
