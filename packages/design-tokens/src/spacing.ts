// packages/design-tokens/src/spacing.ts

export type SpacingScale = Record<string, string>;

/**
 * Base spacing unit = 4px
 * Using rem for scalability (1rem = 16px)
 */
export const spacing: SpacingScale = {
  "0": "0rem",
  "0.5": "0.125rem", // 2px
  "1": "0.25rem",    // 4px
  "1.5": "0.375rem",
  "2": "0.5rem",     // 8px
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",       // 16px
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",       // 32px
  "9": "2.25rem",
  "10": "2.5rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",      // 64px
  "20": "5rem",
  "24": "6rem",
  "28": "7rem",
  "32": "8rem",
  "36": "9rem",
  "40": "10rem",
  "44": "11rem",
  "48": "12rem",
  "52": "13rem",
  "56": "14rem",
  "60": "15rem",
  "64": "16rem",
  "72": "18rem",
  "80": "20rem",
  "96": "24rem",
};

/**
 * Fluid spacing for responsive layouts
 */
export const fluidSpacing = {
  xs: "clamp(0.5rem, 1vw, 0.75rem)",
  sm: "clamp(0.75rem, 1.5vw, 1rem)",
  md: "clamp(1rem, 2vw, 1.5rem)",
  lg: "clamp(1.5rem, 3vw, 2rem)",
  xl: "clamp(2rem, 4vw, 3rem)",
};