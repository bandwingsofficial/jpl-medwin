// packages/design-tokens/src/animations.ts

export const durations = {
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
};

export const easings = {
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
};

export const transitions = {
  default: `all ${durations.normal} ${easings.easeInOut}`,
  fast: `all ${durations.fast} ${easings.easeOut}`,
  slow: `all ${durations.slow} ${easings.easeInOut}`,
};

// Keyframe animations
export const keyframes = {
  fadeIn: {
    "0%": { opacity: "0" },
    "100%": { opacity: "1" },
  },

  slideUp: {
    "0%": { transform: "translateY(10px)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" },
  },

  scaleIn: {
    "0%": { transform: "scale(0.95)", opacity: "0" },
    "100%": { transform: "scale(1)", opacity: "1" },
  },

  shimmer: {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
};

export const animation = {
  fadeIn: "fadeIn 0.3s ease-out",
  slideUp: "slideUp 0.3s ease-out",
  scaleIn: "scaleIn 0.2s ease-out",
  shimmer: "shimmer 1.5s infinite linear",
};