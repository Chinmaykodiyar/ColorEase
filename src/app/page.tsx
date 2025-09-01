
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <div className="text-center p-8">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
            Welcome
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12">
            We’re glad you’re here!
          </p>
          <Button 
            size="lg" 
            className="rounded-full shadow-lg transform transition-transform hover:scale-105"
            onClick={() => router.push('/preview')}
          >
            Let’s Start
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
