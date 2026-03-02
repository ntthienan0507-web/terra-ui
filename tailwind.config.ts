import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    hover: 'hsl(var(--primary-hover))',
                    lighter: 'hsl(var(--primary-lighter))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                    hover: 'hsl(var(--secondary-hover))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                    hover: 'hsl(var(--destructive-hover))',
                    lighter: 'hsl(var(--destructive-lighter))',
                },
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))',
                    hover: 'hsl(var(--success-hover))',
                    lighter: 'hsl(var(--success-lighter))',
                },
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    foreground: 'hsl(var(--warning-foreground))',
                    hover: 'hsl(var(--warning-hover))',
                    lighter: 'hsl(var(--warning-lighter))',
                },
                info: {
                    DEFAULT: 'hsl(var(--info))',
                    foreground: 'hsl(var(--info-foreground))',
                    hover: 'hsl(var(--info-hover))',
                    lighter: 'hsl(var(--info-lighter))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'progress-indeterminate': {
                    '0%': { transform: 'translateX(-100%)', width: '40%' },
                    '50%': { transform: 'translateX(60%)', width: '60%' },
                    '100%': { transform: 'translateX(200%)', width: '40%' },
                },
                'slide-in-left': {
                    from: { opacity: '0', transform: 'translateX(-8px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                'slide-down': {
                    from: { opacity: '0', transform: 'scaleY(0)' },
                    to: { opacity: '1', transform: 'scaleY(1)' },
                },
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'progress-indeterminate': 'progress-indeterminate 1.5s ease-in-out infinite',
                'slide-in-left': 'slide-in-left 0.2s ease-out',
                'slide-down': 'slide-down 0.2s ease-out',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
}

export default config
