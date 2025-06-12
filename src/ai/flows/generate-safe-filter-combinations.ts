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

// Define the output schema for the flow
const FilterCombinationSchema = z.object({
  name: z.string().describe('A descriptive name for the filter combination.'),
  filterSettings: z
    .record(z.string(), z.number())
    .describe('The specific filter settings for this combination.'),
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
  input: {schema: GenerateSafeFilterCombinationsInputSchema},
  output: {schema: GenerateSafeFilterCombinationsOutputSchema},
  prompt: `You are an accessibility expert specializing in creating colorblind-safe filter combinations.

  Given the type of colorblindness: {{{colorblindnessType}}}
  And the following user preferences (if any): {{{userPreferences}}}

  Generate an array of diverse filter combinations that address the specific challenges of this colorblindness type.
  Each combination should have a descriptive name, specific filter settings (using key-value pairs where keys are filter names and values are their settings), and a short description.
  The goal is to provide a range of options for the user to find the settings that optimize the app's visuals for their specific needs.

  Ensure that the filter combinations offer a variety of approaches to color correction and enhancement.
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
