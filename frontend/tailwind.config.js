/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'stripe-purple':       '#533afd',
        'stripe-purple-hover': '#4434d4',
        'stripe-purple-deep':  '#2e2b8c',
        'stripe-purple-light': '#b9b9f9',
        'stripe-navy':         '#061b31',
        'stripe-brand-dark':   '#1c1e54',
        'stripe-label':        '#273951',
        'stripe-body':         '#64748d',
        'stripe-ruby':         '#ea2261',
        'stripe-magenta':      '#f96bee',
        'stripe-border':       '#e5edf5',
        'stripe-success':      '#15be53',
        'stripe-success-text': '#108c3d',
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          'primary-foreground': "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          'accent-foreground': "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Source Code Pro', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'stripe-ambient':  '0px 3px 6px rgba(23,23,23,0.06)',
        'stripe-card':     '0px 15px 35px rgba(23,23,23,0.08)',
        'stripe-elevated': '0px 30px 45px -30px rgba(50,50,93,0.25), 0px 18px 36px -18px rgba(0,0,0,0.10)',
        'stripe-deep':     '0px 14px 21px -14px rgba(3,3,39,0.25), 0px 8px 17px -8px rgba(0,0,0,0.10)',
        'stripe-focus':    '0 0 0 2px #533afd',
      },
      borderRadius: {
        'stripe-sm': '4px',
        'stripe':    '5px',
        'stripe-md': '6px',
        'stripe-lg': '8px',
      },
      maxWidth: {
        'stripe-content': '1080px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}
