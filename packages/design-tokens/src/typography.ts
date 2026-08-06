// packages/design-tokens/src/typography.ts

export type FontFamily = {
  sans: string;
  heading: string;
  mono: string;
};

export type FontSize = {
  fontSize: string;
  lineHeight: string;
  letterSpacing?: string;
  fontWeight?: number;
};

export type TypographyScale = {
  xs: FontSize;
  sm: FontSize;
  base: FontSize;
  lg: FontSize;
  xl: FontSize;
  "2xl": FontSize;
  "3xl": FontSize;
  "4xl": FontSize;
  "5xl": FontSize;
  "6xl": FontSize;
};

export type Typography = {
  fontFamily: FontFamily;
  fontSize: TypographyScale;
};

export const fontFamily: FontFamily = {
  sans: `"Rajdhani", system-ui, -apple-system, sans-serif`,
  heading: `"Rajdhani", system-ui, sans-serif`,
  mono: `"JetBrains Mono", monospace`,
};

export const fontSize: TypographyScale = {
  xs: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1rem",
    letterSpacing: "0.02em",
  },
  sm: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.25rem",
    letterSpacing: "0.015em",
  },
  base: {
    fontSize: "1rem", // 16px
    lineHeight: "1.5rem",
    letterSpacing: "0.01em",
  },
  lg: {
    fontSize: "1.125rem", // 18px
    lineHeight: "1.75rem",
  },
  xl: {
    fontSize: "1.25rem", // 20px
    lineHeight: "1.75rem",
  },
  "2xl": {
    fontSize: "1.5rem", // 24px
    lineHeight: "2rem",
    fontWeight: 600,
  },
  "3xl": {
    fontSize: "1.875rem", // 30px
    lineHeight: "2.25rem",
    fontWeight: 600,
  },
  "4xl": {
    fontSize: "2.25rem", // 36px
    lineHeight: "2.5rem",
    fontWeight: 700,
  },
  "5xl": {
    fontSize: "3rem", // 48px
    lineHeight: "1",
    fontWeight: 700,
  },
  "6xl": {
    fontSize: "3.75rem", // 60px
    lineHeight: "1",
    fontWeight: 700,
  },
};

export const typography: Typography = {
  fontFamily,
  fontSize,
};