/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  important: true, // This ensures Tailwind styles take precedence
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#1967d2',
          light: '#4285f4',
          dark: '#1557b0',
        },
        secondary: {
          main: '#5f6368',
          light: '#757575',
          dark: '#3c4043',
        },
        background: {
          default: '#f8f9fa',
          paper: '#ffffff',
        },
        border: {
          main: '#dadce0',
        },
      },
    },
  },
  corePlugins: {
    // Disable Preflight as it can conflict with MUI
    preflight: false,
  },
  plugins: [],
}