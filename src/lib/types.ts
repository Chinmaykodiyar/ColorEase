export type ColorblindnessType = "protanopia" | "deuteranopia" | "tritanopia";

// This interface now reflects an object with specific, optional CSS filter properties
export interface FilterSettings {
  brightness?: number;
  contrast?: number;
  saturate?: number;
  grayscale?: number;
  sepia?: number;
  'hue-rotate'?: number; // CSS property name for hue-rotate
  invert?: number;
  opacity?: number;
  blur?: number;
}

export interface FilterCombination {
  name: string;
  filterSettings: FilterSettings; // Uses the more specific FilterSettings type
  description: string;
}

export type PaletteType = "default" | "protanopia" | "deuteranopia" | "tritanopia";
