import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'ColorEase',
  description: 'Enhanced accessibility for colorblind users.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AccessibilityProvider>
          {children}
          <Toaster />
        </AccessibilityProvider>
        {/* SVG filters for color blindness simulation, hidden from view */}
        <div className="filters-container">
          <svg>
            <filter id="protanopia-filter">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.567, 0.433, 0,     0, 0
                        0.558, 0.442, 0,     0, 0
                        0,     0.242, 0.758, 0, 0
                        0,     0,     0,     1, 0"
              />
            </filter>
            <filter id="deuteranopia-filter">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.625, 0.375, 0,   0, 0
                        0.7,   0.3,   0,   0, 0
                        0,     0.3,   0.7, 0, 0
                        0,     0,     0,   1, 0"
              />
            </filter>
            <filter id="tritanopia-filter">
               <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.95, 0.05,  0,     0, 0
                        0,    0.433, 0.567, 0, 0
                        0,    0.475, 0.525, 0, 0
                        0,    0,     0,     1, 0"
              />
            </filter>
          </svg>
        </div>
      </body>
    </html>
  );
}
