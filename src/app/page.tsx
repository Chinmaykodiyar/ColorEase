
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
          'text-center p-8 transition-opacity duration-500 ease-in-out',
          isExiting ? 'animate-fade-out' : 'animate-fade-in-up'
        )}
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-white/80">
          Welcome
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-12">
          We’re glad you’re here!
        </p>
        <Button
          size="lg"
          className="bg-white/90 text-slate-800 rounded-full shadow-2xl transform transition-transform hover:scale-110 hover:bg-white text-base font-semibold"
          onClick={handleStart}
        >
          Let’s Start
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
