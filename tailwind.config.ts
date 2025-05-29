import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
      },
      colors: {
        customize: 'var(--customize)',
        'customize-hover': 'var(--customize-hover)',
        'customize-border': 'var(--customize-border)',
        'customize-border-hover': 'var(--customize-border-hover)',
      },
      boxShadow: {
        'customize-btn-shadow': 'var(--customize-btn-shadow)',
        'customize-btn-shadow-hover': 'var(--customize-btn-shadow-hover)',
      },
    },
  },
  plugins: [],
};

export default config;
