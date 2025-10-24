import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import { z } from "zod";

export interface CompleteTestRequest {
  quizId: string;
  personalities: string[];
  answers: Answer[];
}

export interface Answer {
  questionIndex: number;
  question: string;
  answer: number;
  answerLabel: string;
}

// Create a dynamic schema based on the available personalities
function createPersonalityAnalysisSchema(personalities: string[]) {
  return z.object({
    personality: z
      .enum(personalities as [string, ...string[]])
      .describe("The selected personality from the provided options"),
    rationale: z
      .string()
      .describe("Short explanation for why this personality was chosen"),
  });
}

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY
  });

export const Route = createFileRoute("/api/ai/complete-test")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { quizId, personalities, answers } =
            (await request.json()) as CompleteTestRequest;

          console.log('Processing quiz completion request:', {
            quizId,
            personalitiesCount: personalities.length,
            personalities,
            answersCount: answers.length,
          });

          const prompt = `You are an agent that decides which personality best matches these quiz answers.

IMPORTANT: You must select ONE of these EXACT personality names:
${personalities.map((p, i) => `${i + 1}. "${p}"`).join('\n')}

- Answer scale: 1 = very agree, 5 = very disagree
- Be consistent with your analysis
- Provide a short rationale for your choice
- You MUST choose from the exact names listed above

The answers:
${JSON.stringify(answers, null, 2)}`;

          const personalityAnalysisSchema = createPersonalityAnalysisSchema(personalities);

          const { object } = await generateObject({
            model: google("gemini-2.5-flash-lite"),
            schema: personalityAnalysisSchema,
            prompt: prompt,
            temperature: 0.3, // Lower temperature for more consistent results
          });

          console.log('AI Analysis Complete:', {
            quizId,
            selectedPersonality: object.personality,
            availableOptions: personalities,
            isValid: personalities.includes(object.personality),
          });

          // Validate that the returned personality exists in the list
          if (!personalities.includes(object.personality)) {
            console.error('AI returned invalid personality:', object.personality);
            console.error('Valid options:', personalities);

            // Find the closest match (fallback)
            const closestMatch = personalities.find(p =>
              p.toLowerCase().includes(object.personality.toLowerCase()) ||
              object.personality.toLowerCase().includes(p.toLowerCase())
            ) || personalities[0];

            console.warn('Using closest match:', closestMatch);

            return json({
              quizId,
              personality: closestMatch,
              rationale: object.rationale,
            });
          }

          return json({
            quizId,
            personality: object.personality,
            rationale: object.rationale,
          });
        } catch (error) {
          console.error("Failed to analyze personality:", error);
          return json(
            {
              error: "Failed to analyze personality",
              details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
