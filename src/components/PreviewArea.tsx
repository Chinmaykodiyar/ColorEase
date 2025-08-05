"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Square, Triangle, Circle, Info, CheckCircle, XCircle, AlertTriangle as LucideAlertTriangle, Upload } from 'lucide-react';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import Image from 'next/image';
import { Input } from '@/components/ui/input';


const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
};


export function PreviewArea() {
  const [progress, setProgress] = React.useState(0); // Initialize with a static value
  const [imageSrc, setImageSrc] = React.useState<string | null>("https://placehold.co/600x400.png");
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);


  React.useEffect(() => {
    // Set initial random progress on client mount
    setProgress(Math.random() * 80 + 20);

    // Set up the interval to update progress
    const timer = setInterval(() => {
      setProgress(Math.random() * 80 + 20);
    }, 2000); // Update every 2 seconds for a smoother effect

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Text & Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">This is a sample paragraph showing default text rendering. <span className="text-primary">This text is primary color.</span> <span className="text-accent">This text is accent color.</span></p>
          <h2 className="text-2xl font-headline text-secondary-foreground">Secondary Heading Example</h2>
          <p className="text-sm text-muted-foreground">This is muted text, often used for less important information or captions.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Interactive Elements</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
          
          <Button><Square className="mr-2 h-4 w-4" /> Button with Square</Button>
          <Button><Triangle className="mr-2 h-4 w-4" /> Button with Triangle</Button>
          <Button><Circle className="mr-2 h-4 w-4" /> Button with Circle</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Alerts & Badges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle className="font-headline">Information</AlertTitle>
            <AlertDescription>This is an informational alert.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <LucideAlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-headline">Error</AlertTitle>
            <AlertDescription>This is a destructive/error alert.</AlertDescription>
          </Alert>
          <div className="space-x-2">
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Progress Indicator</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
           <p className="text-sm text-muted-foreground mt-2 text-center">Current progress: {Math.round(progress)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Sample Chart</CardTitle>
          <CardDescription>
            Charts use distinct colors. For enhanced accessibility, patterns or textures can be applied to chart elements (e.g., SVG patterns for bars).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted))', radius: 'var(--radius)' }} 
                  content={<ChartTooltipContent />} 
                />
                <Legend />
                <Bar dataKey="desktop" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mobile" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Image with Textures/Patterns</CardTitle>
        </CardHeader>
        <CardContent 
          className="flex flex-col items-center space-y-4"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
            <p className="text-sm text-muted-foreground">
                Using patterns in images helps differentiate elements without relying on color. Drag and drop an image below.
            </p>
            <div 
              className={`w-full max-w-2xl h-80 border-2 border-dashed rounded-lg flex items-center justify-center text-center transition-colors
                ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}`}
              onClick={handleFileSelectClick}
            >
              {imageSrc ? (
                  <Image 
                      src={imageSrc} 
                      alt="Uploaded or placeholder image"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-md max-h-full w-auto object-contain"
                  />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-10 w-10" />
                  <span>Drag & Drop your image here, or click to select</span>
                </div>
              )}
            </div>
             <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
             <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                <div className="h-20 bg-primary rounded flex items-center justify-center text-primary-foreground">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <div 
                    className="h-20 bg-secondary rounded flex items-center justify-center text-secondary-foreground"
                    style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-1 1l2-2M0 10l10-10M9 11l2-2' stroke='%23${'888888'}' stroke-width='1'/%3E%3C/svg%3E")`}}
                >
                    <XCircle className="h-8 w-8" />
                </div>
                 <div 
                    className="h-20 bg-accent rounded flex items-center justify-center text-accent-foreground"
                    style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${'555555'}' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H0L6 0z'/%3E%3C/g%3E%3C/svg%3E")`}}
                >
                    <LucideAlertTriangle className="h-8 w-8" />
                </div>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
