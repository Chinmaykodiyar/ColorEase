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
  appliedFilter: string;
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
    localStorage.setItem('selectedPalette', currentPalette);

    if (isColorblindModeEnabled) {
      applyPalette(currentPalette);
    } else {
      applyPalette('default'); 
    }
  }, [isColorblindModeEnabled, currentPalette, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('appliedFilter', appliedFilter);
    if (activeFilterName) {
      localStorage.setItem('activeFilterName', activeFilterName);
    } else {
      localStorage.removeItem('activeFilterName');
    }

    const contentElement = document.querySelector('.content-wrapper') as HTMLElement;
    if (contentElement) {
      if (isColorblindModeEnabled && currentPalette === 'default') {
        contentElement.style.filter = appliedFilter;
      } else {
        // Clear CSS filters if mode is off OR if a simulation palette is active
        contentElement.style.filter = '';
      }
    }
  }, [isColorblindModeEnabled, appliedFilter, activeFilterName, isMounted, currentPalette]);


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
      .filter(([, value]) => typeof value === 'number') 
      .map(([key, value]) => {
        const numericValue = value as number; 
        if (key === 'hue-rotate') {
          return `${key}(${numericValue}deg)`;
        }
        if (key === 'blur') {
          return `${key}(${numericValue}px)`;
        }
        // For properties like brightness, contrast, etc., the value is unitless
        return `${key}(${numericValue})`;
      })
      .join(' ');
    setAppliedFilter(filterString);
    setActiveFilterName(filterName);
  }, []);

  const bodyClassName = isMounted && isColorblindModeEnabled ? `simulate-${currentPalette}` : '';

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
      <div className={bodyClassName}>
        <div className="content-wrapper">
          {children}
        </div>
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
