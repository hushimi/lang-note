/** @type {import('tailwindcss').Config} */
export default {
  // In Tailwind v4, configuration is minimal
  // Most customization is done in CSS using @theme and CSS variables

  // Content paths are still needed for class detection
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.ts',
    './resources/**/*.tsx',
    './resources/**/*.vue',
  ],

  // Plugins can still be used
  plugins: [],
};
