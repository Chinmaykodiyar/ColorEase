
"use client"; // Required for SidebarProvider and other client components

import { SettingsPanel } from '@/components/SettingsPanel';
import { PreviewArea } from '@/components/PreviewArea';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTitle,
  SidebarTrigger,
} from '@/components/ui/sidebar-custom'; // Using custom sidebar from example
import { Button } from '@/components/ui/button';
import { PanelLeft, Eye } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PreviewPage() {
  const { isColorblindModeEnabled, toggleColorblindMode } = useAccessibility();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <SidebarTitle className="font-headline text-2xl tracking-tight">Chromatic Harmony</SidebarTitle>
          </SidebarHeader>
          <SidebarContent>
            <SettingsPanel />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
             <SidebarTrigger className="md:hidden" asChild>
              <Button size="icon" variant="outline">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SidebarTrigger>
            <h1 className="font-headline text-xl md:text-2xl grow font-bold text-foreground">
              Accessibility Preview
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
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <PreviewArea />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
