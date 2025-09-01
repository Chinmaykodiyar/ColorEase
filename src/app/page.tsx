
"use client";

import { useRouter } from 'next/navigation';
import { Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground overflow-hidden">
      <div className="text-center p-4">
        <div className="animate-fade-in-up">
          <Eye className="mx-auto h-24 w-24 text-primary animate-pulse" />
          <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            ColorEase
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Building a more accessible web, one color at a time.
          </p>
          <Button 
            size="lg" 
            className="mt-12 animate-fade-in-up" 
            style={{ animationDelay: '0.3s' }}
            onClick={() => router.push('/preview')}
          >
            Let's Start
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
