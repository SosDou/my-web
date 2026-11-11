import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        'ds-page': 'var(--ds-padding-page)',
        'ds-card': 'var(--ds-padding-card)',
        'ds-section': 'var(--ds-gap-sections)',
        'ds-stack': 'var(--ds-gap-stack)',
      },
      borderRadius: {
        sm: 'var(--ds-radius-sm)',
        md: 'var(--ds-radius-md)',
        lg: 'var(--ds-radius-lg)',
        xl: 'var(--ds-radius-lg)',
      },
      fontSize: {
        'ds-caption': ['var(--ds-text-caption-size)', { lineHeight: 'var(--ds-text-caption-line)' }],
        'ds-body-sm': ['var(--ds-text-body-sm-size)', { lineHeight: 'var(--ds-text-body-sm-line)' }],
        'ds-body': ['var(--ds-text-body-size)', { lineHeight: 'var(--ds-text-body-line)' }],
        'ds-title-sm': ['var(--ds-text-title-sm-size)', { lineHeight: 'var(--ds-text-title-sm-line)' }],
        'ds-title-md': ['var(--ds-text-title-md-size)', { lineHeight: 'var(--ds-text-title-md-line)' }],
        'ds-title-lg': ['var(--ds-text-title-lg-size)', { lineHeight: 'var(--ds-text-title-lg-line)' }],
        'ds-code': ['var(--ds-text-code-size)', { lineHeight: 'var(--ds-text-code-line)' }],
      },
      boxShadow: {
        'ds-card': 'var(--ds-shadow-card)',
        'ds-popover': 'var(--ds-shadow-popover)',
        'ds-dialog': 'var(--ds-shadow-dialog)',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        surface: 'var(--ds-color-surface)',
        'surface-muted': 'var(--ds-color-surface-muted)',
        link: 'var(--ds-color-link)',
        success: 'var(--ds-color-success)',
        warning: 'var(--ds-color-warning)',
        info: 'var(--ds-color-info)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [forms],
};

export default config;
