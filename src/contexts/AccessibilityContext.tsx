"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { FilterSettings, PaletteType } from '@/lib/types'; // FilterSettings type is updated
import { applyPalette } from '@/lib/palettes';

interface AccessibilityContextProps {
  isColorblindModeEnabled: boolean;
  toggleColorblindMode: () => void;
  currentPalette: PaletteType;
  setPalette: (palette: PaletteType) => void;
  appliedFilter: string; // CSS filter string
  applyCssFilter: (filterName: string, settings: FilterSettings | null) => void;
  activeFilterName: string | null;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [isColorblindModeEnabled, setIsColorblindModeEnabled] = useState(false);
  const [currentPalette, setCurrentPalette] = useState<PaletteType>('default');
  const [appliedFilter, setAppliedFilter] = useState<string>('');
  const [activeFilterName, setActiveFilterName] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedMode = localStorage.getItem('colorblindModeEnabled');
    if (storedMode) {
      setIsColorblindModeEnabled(JSON.parse(storedMode));
    }
    const storedPalette = localStorage.getItem('selectedPalette') as PaletteType;
    if (storedPalette) {
      setCurrentPalette(storedPalette);
    }
    const storedFilter = localStorage.getItem('appliedFilter');
    if (storedFilter) {
      setAppliedFilter(storedFilter);
    }
    const storedFilterName = localStorage.getItem('activeFilterName');
    if (storedFilterName) {
      setActiveFilterName(storedFilterName);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('colorblindModeEnabled', JSON.stringify(isColorblindModeEnabled));
    if (isColorblindModeEnabled) {
      applyPalette(currentPalette);
      document.body.style.filter = appliedFilter;
    } else {
      applyPalette('default'); // Reset to default palette
      document.body.style.filter = ''; // Clear filters
    }
  }, [isColorblindModeEnabled, currentPalette, appliedFilter, isMounted]);
  
  useEffect(() => {
    if (!isMounted) return;
    if (isColorblindModeEnabled) {
      applyPalette(currentPalette);
    } else {
      applyPalette('default');
    }
    localStorage.setItem('selectedPalette', currentPalette);
  }, [currentPalette, isColorblindModeEnabled, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (isColorblindModeEnabled) {
      document.body.style.filter = appliedFilter;
    } else {
      document.body.style.filter = '';
    }
    localStorage.setItem('appliedFilter', appliedFilter);
    if (activeFilterName) {
      localStorage.setItem('activeFilterName', activeFilterName);
    } else {
      localStorage.removeItem('activeFilterName');
    }
  }, [appliedFilter, activeFilterName, isColorblindModeEnabled, isMounted]);


  const toggleColorblindMode = useCallback(() => {
    setIsColorblindModeEnabled(prev => !prev);
  }, []);

  const setPaletteCb = useCallback((palette: PaletteType) => {
    setCurrentPalette(palette);
  }, []);

  const applyCssFilterCb = useCallback((filterName: string, settings: FilterSettings | null) => {
    if (!settings) {
      setAppliedFilter('');
      setActiveFilterName(null);
      return;
    }
    
    const filterString = Object.entries(settings)
      // Ensure only entries where value is a number are processed (it should be with the new schema)
      .filter(([, value]) => typeof value === 'number') 
      .map(([key, value]) => {
        // value is now asserted as number due to the filter above, but TypeScript might still need explicit checks or assertions
        const numericValue = value as number; 
        if (key === 'hue-rotate') {
          return `${key}(${numericValue}deg)`;
        }
        if (key === 'blur') {
          return `${key}(${numericValue}px)`; // Add px for blur
        }
        // For other filters like brightness, contrast, saturate (0-1 or higher), grayscale (0-1), sepia (0-1), invert (0-1), opacity (0-1)
        // these are typically unitless or represent a factor/percentage (where 1 = 100%).
        // The schema descriptions guide the LLM for appropriate numeric ranges.
        return `${key}(${numericValue})`;
      })
      .join(' ');
    setAppliedFilter(filterString);
    setActiveFilterName(filterName);
  }, []);

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <AccessibilityContext.Provider
      value={{
        isColorblindModeEnabled,
        toggleColorblindMode,
        currentPalette,
        setPalette: setPaletteCb,
        appliedFilter,
        applyCssFilter: applyCssFilterCb,
        activeFilterName,
      }}
    >
      <div className={`content-wrapper ${isColorblindModeEnabled ? currentPalette !== 'default' ? `theme-${currentPalette}` : '' : ''}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
