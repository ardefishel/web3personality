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

// Define the expected response schema
const personalityAnalysisSchema = z.object({
  personality: z
    .string()
    .describe("The selected personality from the provided options"),
  rationale: z
    .string()
    .describe("Short explanation for why this personality was chosen"),
});

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

          const prompt = `You are an agent that decides which personality best matches these quiz answers.

- Answer scale: 1 = very agree, 5 = very disagree
- Personality options: ${personalities.join(", ")}
- Be consistent with your analysis
- Provide a short rationale for your choice

The answers:
${JSON.stringify(answers, null, 2)}`;

          const { object } = await generateObject({
            model: google("gemini-2.5-flash-lite"),
            schema: personalityAnalysisSchema,
            prompt: prompt,
          });

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
