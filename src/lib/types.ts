export type ColorblindnessType = "protanopia" | "deuteranopia" | "tritanopia";

export interface FilterSettings {
  [key: string]: number; // e.g., { brightness: 1.2, contrast: 0.9 }
}

export interface FilterCombination {
  name: string;
  filterSettings: FilterSettings;
  description: string;
}

export type PaletteType = "default" | "protanopia" | "deuteranopia" | "tritanopia";
