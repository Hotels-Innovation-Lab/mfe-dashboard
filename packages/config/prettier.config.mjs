/** @type {import('prettier').Config} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cn', 'cva'],
  // Lets the class sorter know about the design-system tokens (bg-primary, text-muted-foreground…).
  tailwindStylesheet: new URL('../ui/src/styles/globals.css', import.meta.url).pathname,
};
