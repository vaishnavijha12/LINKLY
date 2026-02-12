/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Dark Gradient Background
                background: "#0B0F1A",
                'background-secondary': "#111827",
                'background-tertiary': "#0F172A",

                // Glass & Surface
                surface: "#121212",
                'glass-bg': "rgba(255, 255, 255, 0.05)",
                'glass-border': "rgba(255, 255, 255, 0.1)",

                // Text Colors
                primary: "#FFFFFF",
                secondary: "rgba(255, 255, 255, 0.65)",
                tertiary: "rgba(255, 255, 255, 0.4)",

                // Purple Accent System
                accent: "#8B5CF6",
                'accent-light': "#A78BFA",
                'accent-dark': "#7C3AED",

                // Dividers
                divider: "rgba(255, 255, 255, 0.08)",
            },
            fontFamily: {
                sans: ['Inter', 'Manrope', 'sans-serif'],
            },
            fontSize: {
                'hero': ['64px', { lineHeight: '1.1', fontWeight: '700' }],
                'hero-lg': ['72px', { lineHeight: '1.1', fontWeight: '800' }],
                'section': ['30px', { lineHeight: '1.2', fontWeight: '600' }],
                'section-lg': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
            },
            backdropBlur: {
                'xs': '2px',
                'glass': '12px',
                'glass-lg': '16px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glass-white': '0 4px 16px 0 rgba(255, 255, 255, 0.1)',
                'glow-purple': '0 0 80px rgba(139, 92, 246, 0.25)',
                'glow-purple-sm': '0 0 40px rgba(139, 92, 246, 0.2)',
                'glow-purple-lg': '0 0 120px rgba(139, 92, 246, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'gradient-x': 'gradient-x 15s ease infinite',
                'gradient-y': 'gradient-y 15s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'gradient-x': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'gradient-y': {
                    '0%, 100%': { backgroundPosition: '50% 0%' },
                    '50%': { backgroundPosition: '50% 100%' },
                },
            },
            transitionDuration: {
                '200': '200ms',
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [],
}
