import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B675A',
        secondary: '#D6C9B0',
        surface: '#F9F6F1',
        highlight: '#D66D52',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(91, 103, 90, 0.1), 0 2px 10px -2px rgba(91, 103, 90, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
