
"use client";

import { SettingsPanel } from '@/components/SettingsPanel';
import { PreviewArea } from '@/components/PreviewArea';
import { Button } from '@/components/ui/button';
import { PanelLeft, Eye } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PreviewPage() {
  const { isColorblindModeEnabled, toggleColorblindMode } = useAccessibility();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
        <h1 className="font-headline text-2xl tracking-tight grow font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-accent">
          Clarity
        </h1>
        <div className="flex items-center space-x-3">
          <Switch
            id="global-colorblind-mode-toggle"
            checked={isColorblindModeEnabled}
            onCheckedChange={toggleColorblindMode}
            aria-label="Toggle Accessibility Mode"
          />
          <Label htmlFor="global-colorblind-mode-toggle" className="text-sm font-medium flex items-center cursor-pointer">
            <Eye className="mr-2 h-5 w-5 text-muted-foreground" />
            Accessibility Mode
          </Label>
        </div>
      </header>
      
      <div className="flex flex-row">
        <aside className="w-[340px] border-r bg-card p-4 hidden md:block">
          <div className="flex items-center gap-3 mb-5">
            <div className="font-headline text-2xl tracking-tight font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-accent">
              Clarity
            </div>
          </div>
          <SettingsPanel />
        </aside>
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <PreviewArea />
          </div>
        </main>
      </div>
    </div>
  );
}
