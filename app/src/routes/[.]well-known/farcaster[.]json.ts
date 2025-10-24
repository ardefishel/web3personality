import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/.well-known/farcaster.json")({
  server: {
    handlers: {
      GET: () => {
        const brandName = process.env.VITE_BRAND_NAME || "Web3Personality";
        const brandSubtitle = process.env.VITE_BRAND_SUBTITLE || "On-chain personality tests";
        const publicUrl = process.env.VITE_PUBLIC_URL || "https://web3personality.vercel.app";
        // Description max 170 chars for Farcaster compliance
        const brandDescription = process.env.VITE_BRAND_DESCRIPTION?.substring(0, 170) || "Take personality quizzes and mint your results as NFT credentials on Base blockchain. Build your verifiable Web3 identity on-chain.";
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
            iconUrl: `${publicUrl}/android-chrome-512x512.png`, // Using 512x512 as closest to 1024x1024 requirement
            splashImageUrl: `${publicUrl}/typ3-logo.png`,
            splashBackgroundColor: "#0f172a",
            subtitle: brandSubtitle.substring(0, 30), // Max 30 chars for Farcaster compliance
            description: brandDescription, // Max 170 chars enforced above
            screenshotUrls: [],
            primaryCategory: "social",
            tags: ["personality", "web3", "nft", "base", "onchain"],
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
