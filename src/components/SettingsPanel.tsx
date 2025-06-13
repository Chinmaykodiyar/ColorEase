
"use client";

import React, { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import type { ColorblindnessType, FilterCombination, FilterSettings, PaletteType } from '@/lib/types';
import { generateSafeFilterCombinations } from '@/ai/flows/generate-safe-filter-combinations';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/hooks/use-toast";
import { Loader2, Square, Triangle, Circle, Palette, Sparkles } from 'lucide-react';

const colorblindnessTypes: { value: ColorblindnessType; label: string, icon: React.ElementType }[] = [
  { value: 'protanopia', label: 'Protanopia (Red-Blind)', icon: Square },
  { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)', icon: Triangle },
  { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)', icon: Circle },
];

const predefinedPalettes: { value: PaletteType; label: string, icon: React.ElementType }[] = [
  { value: 'default', label: 'Default Palette', icon: Palette },
  { value: 'protanopia', label: 'Protanopia Optimized', icon: Square },
  { value: 'deuteranopia', label: 'Deuteranopia Optimized', icon: Triangle },
  { value: 'tritanopia', label: 'Tritanopia Optimized', icon: Circle },
];


export function SettingsPanel() {
  const {
    isColorblindModeEnabled,
    // toggleColorblindMode, // Removed as the toggle is now global
    currentPalette,
    setPalette,
    applyCssFilter,
    activeFilterName,
  } = useAccessibility();

  const [selectedColorblindnessType, setSelectedColorblindnessType] = useState<ColorblindnessType>('protanopia');
  const [generatedFilters, setGeneratedFilters] = useState<FilterCombination[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [userPreferences, setUserPreferences] = useState(''); // Not used in UI yet, for future enhancement


  const handleGenerateFilters = async () => {
    setIsLoadingFilters(true);
    setGeneratedFilters([]);
    try {
      const result = await generateSafeFilterCombinations({
        colorblindnessType: selectedColorblindnessType,
        userPreferences: userPreferences || undefined,
      });
      if (result && result.filterCombinations) {
        setGeneratedFilters(result.filterCombinations);
        toast({ title: "Filters Generated", description: `${result.filterCombinations.length} filter combinations ready.` });
      } else {
        toast({ title: "Filter Generation Failed", description: "Could not generate filters.", variant: "destructive" });
      }
    } catch (error) {
      console.error('Error generating filters:', error);
      toast({ title: "Error", description: "An error occurred while generating filters.", variant: "destructive" });
    }
    setIsLoadingFilters(false);
  };

  const handleApplyFilter = (filterName: string, settings: FilterSettings | null) => {
    if (!isColorblindModeEnabled) {
      toast({ title: "Mode Disabled", description: "Enable Colorblind Mode from the header to apply filters.", variant: "default" });
      return;
    }
    applyCssFilter(filterName, settings);
     toast({ title: "Filter Applied", description: `${filterName} is now active.` });
  };

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Palette className="mr-2 h-5 w-5" />Color Palettes</CardTitle>
            <CardDescription>Choose a palette. Active when Colorblind Mode is enabled in the header.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={currentPalette}
              onValueChange={(value) => setPalette(value as PaletteType)}
              disabled={!isColorblindModeEnabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a palette" />
              </SelectTrigger>
              <SelectContent>
                {predefinedPalettes.map((palette) => (
                  <SelectItem key={palette.value} value={palette.value}>
                    <div className="flex items-center">
                      <palette.icon className="mr-2 h-4 w-4" />
                      {palette.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isColorblindModeEnabled && <p className="text-xs text-muted-foreground mt-2">Enable Colorblind Mode in the header to change palettes.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Sparkles className="mr-2 h-5 w-5" />AI-Powered Filters</CardTitle>
            <CardDescription>Generate and apply CSS filters. Active when Colorblind Mode is enabled.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="colorblindness-type-select">Target Colorblindness Type</Label>
              <Select
                value={selectedColorblindnessType}
                onValueChange={(value) => setSelectedColorblindnessType(value as ColorblindnessType)}
              >
                <SelectTrigger id="colorblindness-type-select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {colorblindnessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                     <div className="flex items-center">
                        <type.icon className="mr-2 h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleGenerateFilters} disabled={isLoadingFilters || !isColorblindModeEnabled} className="w-full">
              {isLoadingFilters && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Safe Filters
            </Button>
             {!isColorblindModeEnabled && <p className="text-xs text-muted-foreground mt-2">Enable Colorblind Mode in the header to generate filters.</p>}


            {generatedFilters.length > 0 && (
              <div className="space-y-2 pt-4">
                <Label>Generated Filter Combinations:</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                  {generatedFilters.map((filter) => (
                    <Button
                      key={filter.name}
                      variant={activeFilterName === filter.name ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start mb-2 text-left"
                      onClick={() => handleApplyFilter(filter.name, filter.filterSettings)}
                      disabled={!isColorblindModeEnabled}
                      title={filter.description}
                    >
                      {filter.name}
                    </Button>
                  ))}
                </ScrollArea>
                 {!isColorblindModeEnabled && <p className="text-xs text-muted-foreground mt-2">Enable Colorblind Mode in the header to apply filters.</p>}
                 {isColorblindModeEnabled && activeFilterName && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleApplyFilter("None", null)}
                    >
                        Clear Applied Filter
                    </Button>
                 )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">System Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chromatic Harmony allows runtime adjustments within this preview. For system-wide colorblind settings, please check your operating system or browser accessibility options.
            </p>
          </CardContent>
        </Card>

      </div>
    </ScrollArea>
  );
}
