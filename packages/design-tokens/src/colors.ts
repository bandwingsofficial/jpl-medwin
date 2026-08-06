// packages/design-tokens/src/colors.ts

export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type SemanticColors = {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;

  background: string;
  surface: string;
  border: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
};

export type ThemeColors = {
  brand: ColorScale;
  neutral: ColorScale;
  semantic: SemanticColors;
};

export const brand: ColorScale = {
  50: "#eef2ff",
  100: "#e0e7ff",
  200: "#c7d2fe",
  300: "#a5b4fc",
  400: "#818cf8",
  500: "#6366f1", // PRIMARY
  600: "#4f46e5",
  700: "#4338ca",
  800: "#3730a3",
  900: "#312e81",
};

export const neutral: ColorScale = {
  50: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827",
};

export const lightTheme: ThemeColors = {
  brand,
  neutral,
  semantic: {
    primary: brand[500],
    secondary: neutral[700],
    success: "#16a34a",
    warning: "#f59e0b",
    error: "#dc2626",
    info: "#0ea5e9",

    background: "#ffffff",
    surface: "#f9fafb",
    border: neutral[200],

    textPrimary: neutral[900],
    textSecondary: neutral[600],
    textMuted: neutral[400],
  },
};

export const darkTheme: ThemeColors = {
  brand,
  neutral,
  semantic: {
    primary: brand[400],
    secondary: neutral[300],
    success: "#22c55e",
    warning: "#fbbf24",
    error: "#ef4444",
    info: "#38bdf8",

    background: "#0b0f19",
    surface: "#111827",
    border: neutral[700],

    textPrimary: "#ffffff",
    textSecondary: neutral[300],
    textMuted: neutral[500],
  },
};

// 🔥 Runtime-safe theme getter
export const getTheme = (mode: "light" | "dark"): ThemeColors => {
  return mode === "dark" ? darkTheme : lightTheme;
};