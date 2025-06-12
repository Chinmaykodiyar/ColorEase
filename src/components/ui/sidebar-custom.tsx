// Copied and adapted from shadcn-ui examples/documentation for a stable sidebar implementation.
// This custom version helps ensure compatibility and specific layout needs for Chromatic Harmony.
"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarContextProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = false }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isMobile, setIsMobile] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
  
  React.useEffect(() => {
    if (!isMounted) return;
    if (!isMobile) {
        setIsOpen(defaultOpen);
    } else {
        setIsOpen(false); // Ensure sidebar is closed by default on mobile
    }
  }, [isMobile, defaultOpen, isMounted]);

  if (!isMounted) {
    return null; 
  }


  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode } 
>(({ className, children, ...props }, ref) => {
  const { isOpen, isMobile, setIsOpen } = useSidebar()

  if (isMobile) {
    // On mobile, the Sidebar content is rendered inside a Sheet.
    // The trigger for this Sheet is handled by SidebarTrigger.
    // The actual <Sidebar> component itself doesn't render its usual desktop structure.
    // Instead, its children (Header, Content, Footer) are expected to be placed inside
    // the SheetContent rendered by SidebarTrigger.
    // This logic feels a bit duplicated with OriginalSidebar, so let's simplify
    // For mobile, SidebarTrigger handles showing the Sheet with Sidebar's children
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {/* The SidebarTrigger is expected to be in the main layout, not here */}
            <SheetContent side="left" className="w-72 p-0 flex flex-col bg-sidebar text-sidebar-foreground">
                {/* This is where SidebarHeader, SidebarContent, etc., will be rendered */}
                {children}
            </SheetContent>
        </Sheet>
    );
  }

  // Desktop: Regular fixed/sticky sidebar
  return (
    <aside
      ref={ref}
      className={cn(
        "fixed top-0 left-0 z-30 h-screen shrink-0 transition-all duration-300 ease-in-out md:sticky bg-sidebar text-sidebar-foreground",
        isOpen ? "w-72" : "w-0 md:w-16", 
        "overflow-hidden", 
        className
      )}
      {...props}
    >
        {/* Conditionally render children based on isOpen for desktop to handle collapse */}
        {/* For icon-only collapsed state, specific styling will apply to children like SidebarHeader */}
        <div className={cn("flex h-full flex-col", isOpen ? "opacity-100" : "opacity-0 md:opacity-100")}>
            {children}
        </div>
    </aside>
  )
})
Sidebar.displayName = "Sidebar"


export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen, isMobile } = useSidebar()
  
  // This trigger is primarily for mobile to open the Sheet.
  // On desktop, the sidebar is either always there or toggled by its own internal logic (e.g. a button inside its header)
  // The current `page.tsx` uses this trigger for mobile.
  if (!isMobile) {
    // On desktop, this specific trigger might not be needed if the sidebar has its own toggle
    // or if it's controlled by hover/click on a collapsed icon bar.
    // For Chromatic Harmony's current setup, this trigger is hidden on desktop via `md:hidden` in page.tsx
    // and a different mechanism would control the desktop open/closed state if it were more complex than defaultOpen.
    // Since `defaultOpen` and the `SidebarProvider` control the state, this specific button isn't
    // the sole controller for desktop. Let's assume it's mainly for mobile.
     return null; // Or a desktop-specific toggle if needed
  }
  
  // Mobile: Sheet trigger
  return (
    // The Sheet component is now part of the Sidebar component itself when isMobile is true.
    // So, SidebarTrigger just needs to toggle the `isOpen` state.
    <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={cn("md:hidden", className)} // Visible only on mobile
        onClick={() => setIsOpen(!isOpen)}
        {...props}
    >
        {children || <PanelLeft />}
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "p-4 transition-opacity duration-300",
        !isOpen && !isMobile && "opacity-0 md:opacity-100 md:p-2 md:flex md:flex-col md:items-center", // Show icons when collapsed on desktop
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

export const SidebarTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar()
  return (
    <h2
      ref={ref}
      className={cn(
        "text-lg font-semibold tracking-tight",
        !isOpen && !isMobile && "md:hidden", // Hide title text when collapsed on desktop
        className
      )}
      {...props}
    />
  )
})
SidebarTitle.displayName = "SidebarTitle"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden", // Allow scrolling
        "transition-opacity duration-300",
        (!isOpen && !isMobile) && "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto", // Content hidden if fully collapsed, but allow if icon-only
        isOpen && "opacity-100",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "p-4 mt-auto border-t transition-opacity duration-300 border-sidebar-border",
        !isOpen && !isMobile && "opacity-0 md:opacity-100 md:p-2",
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen, isMobile } = useSidebar()
  return (
    <main
      ref={ref}
      className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isOpen && !isMobile ? "md:ml-72" : "md:ml-0", 
        !isOpen && !isMobile ? "md:ml-16" : "", 
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"
