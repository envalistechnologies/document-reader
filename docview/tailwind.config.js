/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--color-bg-base)',
          paper: 'var(--color-bg-paper)',
          surface: 'var(--color-bg-surface)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        accent: {
          primary: 'var(--color-accent-primary)',
          primaryPressed: 'var(--color-accent-primaryPressed)',
        },
        danger: 'var(--color-danger)',
      }
    },
  },
  plugins: [],
}
