import type { Config } from "tailwindcss";

// ✅ Correct monorepo import (IMPORTANT)
import { spacing } from "@repo/design-tokens/spacing";
import { fontSize } from "@repo/design-tokens/typography";
import { radius } from "@repo/design-tokens";
import { shadows } from "@repo/design-tokens/shadows";
import { keyframes, animation } from "@repo/design-tokens/animations";
import { breakpoints } from "@repo/design-tokens/breakpoints";
import { zIndex } from "@repo/design-tokens/z-index";


const config: Config = {
  darkMode: "class",

  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/**/*.{ts,tsx}",
  ],

  theme: {
     screens: breakpoints, // ✅ Breakpoints from design tokens
    extend: {
      // ✅ Spacing tokens
      spacing,

       borderRadius: radius,// ✅ Border radius tokens
       boxShadow: shadows, // ✅ Shadow tokens
       keyframes,// ✅ Keyframe animations
       animation,// ✅ Animation utilities
       zIndex, // ✅ Z-index tokens

      // ✅ Typography tokens
      fontSize: {
        xs: [fontSize.xs.fontSize, { lineHeight: fontSize.xs.lineHeight }],
        sm: [fontSize.sm.fontSize, { lineHeight: fontSize.sm.lineHeight }],
        base: [fontSize.base.fontSize, { lineHeight: fontSize.base.lineHeight }],
        lg: [fontSize.lg.fontSize, { lineHeight: fontSize.lg.lineHeight }],
        xl: [fontSize.xl.fontSize, { lineHeight: fontSize.xl.lineHeight }],
        "2xl": [fontSize["2xl"].fontSize, { lineHeight: fontSize["2xl"].lineHeight }],
        "3xl": [fontSize["3xl"].fontSize, { lineHeight: fontSize["3xl"].lineHeight }],
        "4xl": [fontSize["4xl"].fontSize, { lineHeight: fontSize["4xl"].lineHeight }],
        "5xl": [fontSize["5xl"].fontSize, { lineHeight: fontSize["5xl"].lineHeight }],
        "6xl": [fontSize["6xl"].fontSize, { lineHeight: fontSize["6xl"].lineHeight }],
      },

      // ✅ Font family using CSS variable (Next.js optimized)
      fontFamily: {
        sans: ["var(--font-rajdhani)", "system-ui", "sans-serif"],
      },

      // ✅ CSS Variable Colors (your original preserved)
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",

        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },

        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
      },
    },
  },

  plugins: [],
};

export default config;