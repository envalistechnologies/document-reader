import { Platform } from 'react-native';

export const typography = {
  // Use system default for UI/Headlines with Semibold weight where appropriate
  ui: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
  // Mono for metadata, sizes, dates
  mono: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  // We will configure Serif/Sans separately in Phase 4 for reader, but these are placeholders
  reader: {
    serif: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    sans: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
  },
};
