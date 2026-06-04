/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Extended breakpoints for better responsive support
      screens: {
        'xs': '375px',    // Small mobile devices
        'sm': '640px',    // Standard mobile
        'md': '768px',    // Tablet
        'lg': '1024px',   // Large tablet
        'xl': '1280px',   // Desktop
        '2xl': '1536px',  // Large desktop
        // Touch device specific breakpoints
        'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
        'no-touch': { 'raw': '(hover: hover) and (pointer: fine)' },
      },
      // Responsive spacing utilities
      spacing: {
        'touch': 'clamp(0.5rem, 2vw, 1rem)',
        'touch-md': 'clamp(1rem, 3vw, 1.5rem)',
        'touch-lg': 'clamp(1.5rem, 4vw, 2rem)',
      },
      // Responsive font sizes
      fontSize: {
        'responsive-sm': 'clamp(0.75rem, 2vw, 0.875rem)',
        'responsive-base': 'clamp(0.875rem, 2.5vw, 1rem)',
        'responsive-lg': 'clamp(1rem, 3vw, 1.125rem)',
        'responsive-xl': 'clamp(1.125rem, 3.5vw, 1.25rem)',
        'responsive-2xl': 'clamp(1.5rem, 4vw, 1.875rem)',
      },
      // Min height for touch targets (44px minimum)
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      // Min width for touch targets (44px minimum)
      minWidth: {
        'touch': '44px',
        'touch-lg': '48px',
      },
    },
  },
  plugins: [],
}
