
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WelcomePage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/preview');
    }, 500); // Match this duration with the fade-out animation
  };
  
  // This effect will run when the component unmounts, resetting the state
  useEffect(() => {
    return () => {
      setIsExiting(false);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-white gradient-bg">
      <div
        className={cn(
          'text-center p-8 max-w-2xl mx-auto transition-opacity duration-500 ease-in-out z-10',
          isExiting ? 'animate-fade-out' : 'animate-fade-in-up'
        )}
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-white/90">
          Welcome
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-md mx-auto">
          We’re glad you’re here!
        </p>
        <Button
          size="lg"
          className="bg-white/90 text-slate-900 rounded-full shadow-2xl transform transition-transform hover:scale-105 hover:bg-white text-lg font-semibold px-10 py-6"
          onClick={handleStart}
        >
          Let’s Start
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
