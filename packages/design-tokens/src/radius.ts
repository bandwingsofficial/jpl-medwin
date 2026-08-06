// packages/design-tokens/src/radius.ts

export type RadiusScale = {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  full: string;
};

export const radius: RadiusScale = {
  none: "0px",

  xs: "2px",   // micro elements (badges, pills)
  sm: "4px",   // inputs, small buttons
  md: "6px",   // default UI elements
  lg: "8px",   // cards (your UI uses this mostly)
  xl: "12px",  // modals, panels
  "2xl": "16px", // special sections

  full: "9999px", // avatars, chips
};