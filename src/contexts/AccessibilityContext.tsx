"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { FilterSettings, PaletteType } from '@/lib/types';
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

  const setPaletteCb = useCallback((palette: PaletteType) => { // Renamed to avoid conflict with existing setPalette in scope
    setCurrentPalette(palette);
  }, []);

  const applyCssFilterCb = useCallback((filterName: string, settings: FilterSettings | null) => { // Renamed to avoid conflict
    if (!settings) {
      setAppliedFilter('');
      setActiveFilterName(null);
      return;
    }
    
    const filterString = Object.entries(settings)
      .map(([key, value]) => {
        if (key === 'hue-rotate') {
          return `${key}(${value}deg)`;
        }
        // Assuming other values are percentages or unitless based on common CSS filters
        // For example, brightness(1.2) or contrast(150%)
        // Here we assume unitless for simplicity, can be expanded
        return `${key}(${value})`;
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
        setPalette: setPaletteCb, // Use renamed callback
        appliedFilter,
        applyCssFilter: applyCssFilterCb, // Use renamed callback
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
