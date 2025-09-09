
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

// A custom SVG illustration for the welcome page.
const WelcomeIllustration = () => (
  <svg
    viewBox="0 0 500 300"
    className="w-full max-w-lg mx-auto float"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'rgba(142, 197, 252, 0.8)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'rgba(224, 195, 252, 0.8)', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="4" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Main Blob Shape */}
    <path
      d="M 450,150 C 450,232 382,300 300,300 C 218,300 150,232 150,150 C 150,68 218,0 300,0 C 382,0 450,68 450,150 Z"
      transform="translate(-100, -50) rotate(15, 300, 150)"
      fill="url(#grad1)"
      filter="url(#drop-shadow)"
    />

    {/* Abstract overlapping circle */}
     <circle cx="120" cy="180" r="70" fill="rgba(255,255,255,0.5)" />
    
    {/* Floating smaller shapes */}
    <circle cx="380" cy="80" r="25" fill="rgba(252, 227, 138, 0.9)" />
    <path d="M 80 80 L 120 80 L 100 120 Z" fill="rgba(243, 129, 129, 0.9)" transform="rotate(-10)" />

    {/* Palette Icon in the center */}
    <g transform="translate(240, 140) scale(2.5)">
       <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
    </g>
  </svg>
);


export default function WelcomePage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/preview');
    }, 500); // Match this duration with the fade-out animation
  };
  
  useEffect(() => {
    return () => {
      setIsExiting(false);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-800 gradient-bg px-4">
      <div
        className={cn(
          'text-center p-8 max-w-3xl mx-auto transition-opacity duration-500 ease-in-out z-10',
          isExiting ? 'animate-fade-out' : 'animate-fade-in-up'
        )}
      >
        <WelcomeIllustration />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-8 mb-4 text-slate-900">
          ColorEase
        </h1>
        <p className="text-md md:text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
          Making every shade accessible, so everyone can experience the world in full clarity and comfort.
        </p>
        <Button
          size="lg"
          className="bg-white/80 text-slate-800 rounded-full shadow-lg backdrop-blur-sm transform transition-transform hover:scale-105 hover:bg-white text-lg font-semibold px-10 py-6"
          onClick={handleStart}
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
