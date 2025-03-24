import type { Config } from "tailwindcss";

/**
 * Tailwind CSS Configuration
 * 
 * Defines the styling framework for the Triathlon Training Platform.
 * Key features:
 * - Content paths for component scanning
 * - Custom theme extensions for colors
 * - No additional plugins for simplicity
 * 
 * This configuration enables the dark mode design system used
 * throughout the application and provides CSS variable integration.
 */
export default {
  // Content paths to scan for classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // Theme customization
  theme: {
    extend: {
      // Custom color definitions using CSS variables
      // Allows for dynamic theme switching if implemented
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  
  // No additional plugins
  plugins: [],
} satisfies Config;