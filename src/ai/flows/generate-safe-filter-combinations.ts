// src/ai/flows/generate-safe-filter-combinations.ts
'use server';
/**
 * @fileOverview Generates colorblind-safe filter combinations using Genkit.
 *
 * This file defines a Genkit flow that leverages an LLM to produce an array of colorblind-safe filter combinations.
 * These combinations are intended to help users with colorblindness optimize the application's visuals for their specific needs.
 *
 * @interface GenerateSafeFilterCombinationsInput - Defines the input schema for the generateSafeFilterCombinations function, including the type of colorblindness and optional user preferences.
 * @interface GenerateSafeFilterCombinationsOutput - Defines the output schema, which includes an array of colorblind-safe filter combinations.
 * @function generateSafeFilterCombinations - The main function that triggers the flow to generate the filter combinations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const GenerateSafeFilterCombinationsInputSchema = z.object({
  colorblindnessType: z
    .enum(['protanopia', 'deuteranopia', 'tritanopia'])
    .describe('The type of colorblindness to generate filters for.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional user preferences for color adjustments.'),
});
export type GenerateSafeFilterCombinationsInput = z.infer<typeof GenerateSafeFilterCombinationsInputSchema>;

// Define the schema for individual filter settings with known CSS properties
const PossibleFilterPropertiesSchema = z.object({
  brightness: z.number().optional().describe('Adjusts brightness. e.g., 1 for normal, 1.2 for 20% brighter, 0.8 for 20% dimmer.'),
  contrast: z.number().optional().describe('Adjusts contrast. e.g., 1 for normal, 1.5 for 50% more contrast, 0.7 for 30% less.'),
  saturate: z.number().optional().describe('Adjusts saturation. e.g., 1 for normal, 0.5 for 50% less saturation, 1.5 for 50% more.'),
  grayscale: z.number().optional().describe('Converts to grayscale. Value from 0 (no effect) to 1 (full grayscale). e.g., 0.8 for 80% grayscale.'),
  sepia: z.number().optional().describe('Converts to sepia. Value from 0 (no effect) to 1 (full sepia). e.g., 0.6 for 60% sepia.'),
  'hue-rotate': z.number().optional().describe('Rotates hues. Value in degrees (0-360). e.g., 90 for a 90-degree hue rotation.'),
  invert: z.number().optional().describe('Inverts colors. Value from 0 (no effect) to 1 (full inversion). e.g., 0.2 for 20% inversion.'),
  opacity: z.number().optional().describe('Adjusts opacity. Value from 0 (fully transparent) to 1 (fully opaque). e.g., 0.9 for 90% opacity.'),
  blur: z.number().optional().describe('Applies blur. Value in pixels (non-negative). e.g., 2 for a 2px blur.'),
}).describe('The specific CSS filter settings for this combination. Only include properties that are being actively set. All values are numbers.');
export type FilterSettings = z.infer<typeof PossibleFilterPropertiesSchema>;


// Define the output schema for the flow
const FilterCombinationSchema = z.object({
  name: z.string().describe('A descriptive name for the filter combination.'),
  filterSettings: PossibleFilterPropertiesSchema,
  description: z
    .string()
    .describe('A short description of what this filter combination achieves.'),
});

const GenerateSafeFilterCombinationsOutputSchema = z.object({
  filterCombinations: z
    .array(FilterCombinationSchema)
    .describe('An array of colorblind-safe filter combinations.'),
});
export type GenerateSafeFilterCombinationsOutput = z.infer<typeof GenerateSafeFilterCombinationsOutputSchema>;

// Define the main function that will be called
export async function generateSafeFilterCombinations(
  input: GenerateSafeFilterCombinationsInput
): Promise<GenerateSafeFilterCombinationsOutput> {
  return generateSafeFilterCombinationsFlow(input);
}

// Define the prompt
const generateSafeFilterCombinationsPrompt = ai.definePrompt({
  name: 'generateSafeFilterCombinationsPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: GenerateSafeFilterCombinationsInputSchema},
  output: {schema: GenerateSafeFilterCombinationsOutputSchema},
  prompt: `You are an accessibility expert specializing in creating colorblind-safe filter combinations.

  Given the type of colorblindness: {{{colorblindnessType}}}
  And the following user preferences (if any): {{{userPreferences}}}

  Generate an array of diverse filter combinations that address the specific challenges of this colorblindness type.
  Each combination should have:
  1. A descriptive 'name'.
  2. 'filterSettings': An object containing CSS filter properties and their numeric values. Only include properties you want to apply from this allowed list: 'brightness', 'contrast', 'saturate', 'grayscale', 'sepia', 'hue-rotate', 'invert', 'opacity', 'blur'. For example: { "brightness": 1.2, "contrast": 0.9, "hue-rotate": 15 }.
  3. A short 'description' of what this filter combination achieves.

  The goal is to provide a range of options for the user to find the settings that optimize the app's visuals for their specific needs.
  Ensure that the filter combinations offer a variety of approaches to color correction and enhancement.
  Provide 3 to 5 filter combinations.
  `,
});

// Define the flow
const generateSafeFilterCombinationsFlow = ai.defineFlow(
  {
    name: 'generateSafeFilterCombinationsFlow',
    inputSchema: GenerateSafeFilterCombinationsInputSchema,
    outputSchema: GenerateSafeFilterCombinationsOutputSchema,
  },
  async input => {
    const {output} = await generateSafeFilterCombinationsPrompt(input);
    return output!;
  }
);
