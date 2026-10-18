
export const colors = {
  // Brand colors
  primary: "#087F8C",
  secondary: "#DDF5F0",
  accent: "#E7A23B",

  // Backgrounds
  background: "#F7FAFA",
  surface: "#FFFFFF",

  // Text
  textPrimary: "#173B3F",
  textSecondary: "#637779",
  textInverse: "#FFFFFF",

  // Status colors
  success: "#21865B",
  error: "#C43D45",
  warning: "#A96112",

  // UI elements
  border: "#DCE5E5",
  disabled: "#E7ECEC",
} as const;

export type ColorToken = keyof typeof colors;