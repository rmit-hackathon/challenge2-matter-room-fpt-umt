/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legal Tech Core Surfaces & Text
        surface: '#FFFFFF',
        'surface-dim': '#F1F5F9',
        'surface-bright': '#FFFFFF',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F8FAFC',
        'surface-container': '#F1F5F9',
        'surface-container-high': '#E2E8F0',
        'surface-container-highest': '#CBD5E1',
        'on-surface': '#0F172A',
        'on-surface-variant': '#475569',
        'inverse-surface': '#0F172A',
        'inverse-on-surface': '#F8FAFC',
        outline: '#94A3B8',
        'outline-variant': '#E2E8F0',
        'surface-tint': '#1E3A8A',
        
        // Primary Brand Accent: Deep Navy / Classic Legal Blue
        primary: '#1E3A8A',
        'on-primary': '#FFFFFF',
        'primary-container': '#EFF6FF',
        'on-primary-container': '#1E3A8A',
        'inverse-primary': '#BFDBFE',
        'primary-fixed': '#DBEAFE',
        'primary-fixed-dim': '#BFDBFE',
        'on-primary-fixed': '#1E3A8A',
        'on-primary-fixed-variant': '#172554',

        // Secondary / Slate Neutral
        secondary: '#475569',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#F1F5F9',
        'on-secondary-container': '#334155',

        // Tertiary / Subtle Teal (Witness Protection)
        tertiary: '#0F766E',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#F0FDFA',
        'on-tertiary-container': '#0F766E',

        // Error / Subtle Rose (Breach & Denial)
        error: '#991B1B',
        'on-error': '#FFFFFF',
        'error-container': '#FEF2F2',
        'on-error-container': '#991B1B',

        // Legal Tech Semantic Design Tokens
        legal: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          text: '#0F172A',
          muted: '#475569',
          border: '#E2E8F0',
          navy: '#1E3A8A',
          'navy-light': '#EFF6FF',
          'navy-border': '#BFDBFE',
          // Neutral Slate (Pending, Metadata, File size, Case ID, Level 1)
          slate: {
            text: '#475569',
            bg: '#F1F5F9',
            border: '#E2E8F0',
          },
          // Subtle Teal (Survivor & Witness Protection, Sealed Identity, Level 4)
          teal: {
            text: '#0F766E',
            bg: '#F0FDFA',
            border: '#CCFBF1',
          },
          // Muted Legal Amber (Procedures, Discovery, Quorum, Level 3)
          amber: {
            text: '#B45309',
            bg: '#FFFBEB',
            border: '#FEF3C7',
          },
          // Subtle Security Rose (Tamper, Access Denied)
          rose: {
            text: '#991B1B',
            bg: '#FEF2F2',
            border: '#FECACA',
          },
          // Legacy mappings redirected to Legal Tech standards
          dark: '#0F172A',
          card: '#FFFFFF',
          borderDefault: '#E2E8F0',
          accent: '#1E3A8A',
          gold: '#B45309',
          crimson: '#991B1B',
          emerald: '#0F766E',
        }
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        gutter: '1.5rem',
        'gutter-sm': '1rem',
        'gutter-lg': '2rem',
        'margin-desktop': '2.5rem',
      },
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
};
