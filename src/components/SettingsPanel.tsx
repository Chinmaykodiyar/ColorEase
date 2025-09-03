
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
import { Loader2, Square, Triangle, Circle, Palette, Sparkles, SlidersHorizontal } from 'lucide-react';

const simulationTypes: { value: PaletteType; label: string, icon: React.ElementType }[] = [
  { value: 'default', label: 'Normal Vision', icon: Palette },
  { value: 'protanopia', label: 'Protanopia Simulation', icon: Square },
  { value: 'deuteranopia', label: 'Deuteranopia Simulation', icon: Triangle },
  { value: 'tritanopia', label: 'Tritanopia Simulation', icon: Circle },
];

export function SettingsPanel() {
  const {
    isColorblindModeEnabled,
    currentPalette,
    setPalette,
    applyCssFilter,
    activeFilterName,
  } = useAccessibility();

  const [selectedColorblindnessType, setSelectedColorblindnessType] = useState<ColorblindnessType>('protanopia');
  const [generatedFilters, setGeneratedFilters] = useState<FilterCombination[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [userPreferences, setUserPreferences] = useState('');


  const handleGenerateFilters = async () => {
    setIsLoadingFilters(true);
    // setGeneratedFilters([]); // This line is causing the glitch, so we'll remove it.
    try {
      const result = await generateSafeFilterCombinations({
        colorblindnessType: selectedColorblindnessType,
        userPreferences: userPreferences || undefined,
      });
      if (result && result.filterCombinations) {
        setGeneratedFilters(result.filterCombinations);
        toast({ title: "Filters Generated", description: `${result.filterCombinations.length} corrective filter combinations ready.` });
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
      toast({ title: "Mode Disabled", description: "Enable Accessibility Mode from the header to apply filters.", variant: "default" });
      return;
    }
    applyCssFilter(filterName, settings);
    toast({ title: "Filter Applied", description: `${filterName} is now active.` });
  };
  
  // When a simulation is active, we should clear any corrective CSS filters.
  const handleSetPalette = (palette: PaletteType) => {
    setPalette(palette);
    if (palette !== 'default' && activeFilterName) {
        applyCssFilter("None", null);
        toast({ title: "Simulation Applied", description: "Corrective CSS filters cleared to show accurate simulation." });
    }
  }


  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4 text-center">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-center text-lg"><Palette className="mr-2 h-5 w-5" />Vision Simulation</CardTitle>
            <CardDescription>Simulate how different users see your UI.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <Select
              value={currentPalette}
              onValueChange={(value) => handleSetPalette(value as PaletteType)}
              disabled={!isColorblindModeEnabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a simulation" />
              </SelectTrigger>
              <SelectContent>
                {simulationTypes.map((palette) => (
                  <SelectItem key={palette.value} value={palette.value}>
                    <div className="flex items-center">
                      <palette.icon className="mr-2 h-4 w-4" />
                      {palette.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isColorblindModeEnabled && <p className="text-xs text-muted-foreground mt-2">Enable Accessibility Mode to change simulation.</p>}
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-center text-lg"><Sparkles className="mr-2 h-5 w-5" />AI Corrective Filters</CardTitle>
            <CardDescription>Generate filters to improve color distinction.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col items-center justify-center">
            <div className="w-full">
              <Label htmlFor="colorblindness-type-select" className="inline-block text-center w-full mb-1">Target Condition</Label>
              <Select
                value={selectedColorblindnessType}
                onValueChange={(value) => setSelectedColorblindnessType(value as ColorblindnessType)}
                 disabled={!isColorblindModeEnabled || currentPalette !== 'default'}
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
            
            <Button onClick={handleGenerateFilters} disabled={isLoadingFilters || !isColorblindModeEnabled || currentPalette !== 'default'} className="w-full">
              {isLoadingFilters && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Filters
            </Button>
            {isColorblindModeEnabled && currentPalette !== 'default' && <p className="text-xs text-muted-foreground mt-2 text-center">Disable simulation to generate corrective filters.</p>}


            {generatedFilters.length > 0 && (
              <div className="space-y-2 pt-4 w-full">
                <Label className="inline-block text-center w-full">Generated Filter Combinations</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                  {generatedFilters.map((filter) => (
                    <Button
                      key={filter.name}
                      variant={activeFilterName === filter.name ? "secondary" : "outline"}
                      size="sm"
                      className="w-full justify-start mb-2 text-left h-auto py-2"
                      onClick={() => handleApplyFilter(filter.name, filter.filterSettings)}
                      disabled={!isColorblindModeEnabled || currentPalette !== 'default'}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{filter.name}</span>
                        <span className="text-xs text-muted-foreground font-normal">{filter.description}</span>
                      </div>
                    </Button>
                  ))}
                </ScrollArea>
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
        
      </div>
    </ScrollArea>
  );
}

const colorblindnessTypes: { value: ColorblindnessType; label: string, icon: React.ElementType }[] = [
  { value: 'protanopia', label: 'Protanopia (Red-Blind)', icon: Square },
  { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)', icon: Triangle },
  { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)', icon: Circle },
];
