import { createFileRoute } from "@tanstack/react-router";
import { generateOgImage } from "../../lib/og-image";

export const Route = createFileRoute("/api/og-image/png")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const title = url.searchParams.get("title") || undefined;
          const description = url.searchParams.get("description") || undefined;
          const personalityType = url.searchParams.get("personality") || undefined;
          const userAddress = url.searchParams.get("address") || undefined;

          const pngBuffer = await generateOgImage({
            title,
            description,
            personalityType,
            userAddress,
          });

          return new Response(pngBuffer, {
            status: 200,
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (error) {
          console.error("Failed to generate OG image:", error);
          return new Response("Failed to generate image", { status: 500 });
        }
      },
    },
  },
});
