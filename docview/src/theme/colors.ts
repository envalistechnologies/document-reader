export const colors = {
  light: {
    bg: {
      base: '#FFFFFF',
      paper: '#FAF9F6',
      surface: '#F5F5F4',
    },
    border: {
      subtle: '#E5E4E0',
    },
    text: {
      primary: '#1C1C1E',
      secondary: '#6E6E73',
    },
    accent: {
      primary: '#3454D1',
      primaryPressed: '#28409E',
    },
    danger: '#D6483F',
  },
  dark: {
    bg: {
      base: '#18181B',
      paper: '#1F1F23',
      surface: '#242428',
    },
    border: {
      subtle: '#38383D',
    },
    text: {
      primary: '#F2F2F3',
      secondary: '#9A9AA0',
    },
    accent: {
      primary: '#5B7CFA',
      primaryPressed: '#4666E3', // Derived slightly darker for pressed
    },
    danger: '#E8635A',
  },
  sepia: {
    bg: {
      base: '#F4ECD8', // Same as paper for base to have a uniform sepia experience outside reader if applied globally
      paper: '#F4ECD8',
      surface: '#EAE1CB', // Slightly darker for cards
    },
    border: {
      subtle: '#D7CDB7',
    },
    text: {
      primary: '#3B2F1E',
      secondary: '#6E5C46',
    },
    accent: {
      primary: '#3454D1', // Keeping indigo or adjusting? Stick to spec, but spec didn't specify accent for sepia. We'll use the light accent.
      primaryPressed: '#28409E',
    },
    danger: '#D6483F',
  },
};

export type ThemeMode = 'light' | 'dark' | 'sepia';
export type Colors = typeof colors.light;
