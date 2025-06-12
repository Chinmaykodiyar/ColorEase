import type { PaletteType } from './types';

interface CssVariables {
  [key: string]: string;
}

// It's often better to define full palettes rather than sparse overrides
// For simplicity, we'll use the theme classes defined in globals.css
// This function will primarily add/remove the theme class from the body.

export const palettes: Record<PaletteType, CssVariables | null> = {
  default: null, // No specific overrides, relies on base theme or class removal
  protanopia: { /* CSS variables will be handled by .theme-protanopia class */ },
  deuteranopia: { /* CSS variables will be handled by .theme-deuteranopia class */ },
  tritanopia: { /* CSS variables will be handled by .theme-tritanopia class */ },
};

export function applyPalette(paletteName: PaletteType): void {
  if (typeof window === 'undefined') return;

  const bodyClassList = document.body.classList;
  
  // Remove any existing theme classes
  Object.keys(palettes).forEach(pName => {
    if (pName !== 'default') {
      bodyClassList.remove(`theme-${pName}`);
    }
  });

  // Apply the new theme class if it's not default
  if (paletteName !== 'default') {
    bodyClassList.add(`theme-${paletteName}`);
  }

  // The actual CSS variable changes are now handled by the classes in globals.css
}
