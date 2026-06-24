// packages/design-tokens/src/z-index.ts

export type ZIndexScale = {
  base: number;
  dropdown: number;
  sticky: number;
  overlay: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
  max: number;
};

export const zIndex: ZIndexScale = {
  base: 0,

  dropdown: 1000,
  sticky: 1100,

  overlay: 1200,   // backdrop
  modal: 1300,     // dialogs

  popover: 1400,   // menus, select
  tooltip: 1500,   // hover tooltips

  toast: 1600,     // notifications

  max: 9999,       // emergency / debug
};