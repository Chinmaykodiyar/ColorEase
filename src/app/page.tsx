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
import { PanelLeft } from 'lucide-react';

export default function Home() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <SidebarTitle className="font-headline text-2xl">Chromatic Harmony</SidebarTitle>
          </SidebarHeader>
          <SidebarContent>
            <SettingsPanel />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
             <SidebarTrigger className="md:hidden" asChild>
              <Button size="icon" variant="outline">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SidebarTrigger>
            <h1 className="font-headline text-xl md:text-2xl grow text-center md:text-left">
              Accessibility Preview
            </h1>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <PreviewArea />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
