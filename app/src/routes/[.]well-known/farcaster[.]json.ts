import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/.well-known/farcaster.json")({
  server: {
    handlers: {
      GET: () => {
        const brandName = process.env.VITE_BRAND_NAME || "Web3Personality";
        const publicUrl = process.env.VITE_PUBLIC_URL || "https://web3personality.vercel.app";
        const brandDescription = process.env.VITE_BRAND_DESCRIPTION || "Unlock your Web3 identity! Take engaging personality quizzes and mint your results as permanent NFT credentials on Base blockchain.";
        const brandOgTitle = process.env.VITE_BRAND_OG_TITLE || "Web3Personality - Discover Your On-Chain Personality";
        const brandOgDescription = process.env.VITE_BRAND_OG_DESCRIPTION || "Take interactive personality quizzes and immortalize your results on-chain. Build your verifiable Web3 identity with NFT-backed personality credentials on Base.";

        return json({
          accountAssociation: {
            header: process.env.ACCOUNT_ASSOCIATION_HEADER,
            payload: process.env.ACCOUNT_ASSOCIATION_PAYLOAD,
            signature: process.env.ACCOUNT_ASSOCIATION_SIGNATURE,
          },
          baseBuilder: {
            allowedAddresses: [process.env.BASE_ACCOUNT_ADDRESS],
          },
          miniapp: {
            version: "1",
            name: brandName,
            homeUrl: publicUrl,
            iconUrl: `${publicUrl}/typ3-logo.png`,
            splashImageUrl: `${publicUrl}/api/og-image/png`,
            splashBackgroundColor: "#0f172a",
            webhookUrl: "",
            subtitle: "Discover your on-chain identity",
            description: brandDescription,
            screenshotUrls: [],
            primaryCategory: "social",
            tags: ["personality", "web3", "nft", "base", "onchain", "identity"],
            heroImageUrl: `${publicUrl}/api/og-image/png`,
            tagline: "Unlock your Web3 personality",
            ogTitle: brandOgTitle,
            ogDescription: brandOgDescription,
            ogImageUrl: `${publicUrl}/api/og-image/png`,
            noindex: false,
          },
        });
      },
    },
  },
});
