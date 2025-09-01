
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/preview');
    }, 4000); // Redirect after 4 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
      <div className="text-center">
        <div className="animate-fade-in-up">
          <Eye className="mx-auto h-24 w-24 text-blue-400 animate-pulse" />
          <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            Chromatic Harmony
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            Building a more accessible web, one color at a time.
          </p>
        </div>
      </div>
    </div>
  );
}
