
"use client";

import { useRouter } from 'next/navigation';
import { Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center p-4">
        <div>
          <Eye className="mx-auto h-24 w-24 text-primary" />
          <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight text-primary">
            ColorEase
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Building a more accessible web, one color at a time.
          </p>
          <Button 
            size="lg" 
            className="mt-12"
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
