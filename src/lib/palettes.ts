import type { PaletteType } from './types';

// This function is no longer needed as the simulation classes are applied directly
// in the AccessibilityContext. However, to prevent breaking imports, we'll
// keep the function but it will not have any effect.
export function applyPalette(paletteName: PaletteType): void {
  // The logic has been moved to AccessibilityContext.tsx to handle the wrapper div
  // and prevent hydration errors. This function is now a no-op.
  return;
}
