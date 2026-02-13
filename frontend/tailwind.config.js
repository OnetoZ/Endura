/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#050505',
                foreground: '#ffffff',
                primary: {
                    DEFAULT: '#6d28d9',
                    light: '#a78bfa',
                },
                accent: {
                    DEFAULT: '#fbbf24',
                    dark: '#d97706',
                },
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                oswald: ['Oswald', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
