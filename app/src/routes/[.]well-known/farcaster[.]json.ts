import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/.well-known/farcaster.json")({
  server: {
    handlers: {
      GET: () => {
        return json({
          accountAssociation: {
            header: process.env.ACCOUNT_ASSOCIATION_HEADER,
            payload: process.env.ACCOUNT_ASSOCIATION_PAYLOAD,
            signature: process.env.ACCOUNT_ASSOCIATION_SIGNATURE,
            
          },
          baseBuilder: {
            allowedAddresses: [""], // add your Base Account address here
          },
          miniapp: {
            version: "1",
            name: import.meta.env.VITE_APP_NAME,
            homeUrl: import.meta.env.VITE_PUBLIC_URL,
            iconUrl: `${import.meta.env.VITE_PUBLIC_URL}/w3p-logo.png`,
            splashImageUrl: `${import.meta.env.VITE_PUBLIC_URL}/w3p-logo.png`,
            splashBackgroundColor: "#1DEFDB",
            webhookUrl: `${import.meta.env.VITE_PUBLIC_URL}/webhook`,
            subtitle: "Get your personality NFT on chain",
            description: "An on-chain dApp inspired by 16personalities.com.",
            screenshotUrls: [
            ],
            primaryCategory: "social",
            tags: ["example", "miniapp", "baseapp"],
            heroImageUrl: `${import.meta.env.VITE_PUBLIC_URL}/w3p-logo.png`,
            tagline: "Personality on Chain",
            ogTitle: import.meta.env.VITE_APP_NAME,
            ogDescription: "Find your personality on chain",
            ogImageUrl: `${import.meta.env.VITE_PUBLIC_URL}/w3p-logo.png`,
            noindex: true,
          },
        });
      },
    },
  },
});
