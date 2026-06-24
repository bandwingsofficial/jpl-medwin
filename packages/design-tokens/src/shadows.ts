// packages/design-tokens/src/shadows.ts

export type ShadowScale = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
  none: string;
};

export const shadows: ShadowScale = {
  none: "none",

  xs: "0 1px 2px rgba(0, 0, 0, 0.05)",

  sm: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",

  md: "0 4px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",

  lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",

  xl: "0 20px 25px rgba(0, 0, 0, 0.12), 0 10px 10px rgba(0, 0, 0, 0.06)",

  inner: "inset 0 2px 4px rgba(0,0,0,0.06)",
};