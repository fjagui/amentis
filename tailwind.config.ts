import type { Config } from 'tailwindcss' with { 'resolution-mode': 'import' };

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',],
  theme: {
    extend: {},
  },
};

export default config;