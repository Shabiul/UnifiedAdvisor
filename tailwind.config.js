/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0d0d0d', // Pure Black Background
        secondary: '#1a1a1a', // Card Background
        accent: '#e2e2e2', // High Contrast Text
        brand: '#39ff14', // Neon Green/Lime for actions (or maybe a gold/copper) - let's go with a sophisticated copper/gold for CRED vibe or Blue. Actually CRED uses a lot of pink/blue gradients but the core is dark. Let's use a "Neo" Lime/Blue. 
        // Let's stick to a "Premium Dark" palette:
        neo: {
          bg: '#000000',
          card: '#121212',
          card_border: '#2A2A2A',
          text: '#F5F5F7',
          subtext: '#86868b',
          accent: '#ffffff', // White
          brand: '#3B82F6', // Blue like
          danger: '#FF3B30',
          success: '#34C759',
        }
      },
      fontFamily: {
        // We will stick to sans for now as we don't have custom fonts loaded
        sans: ['System', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
