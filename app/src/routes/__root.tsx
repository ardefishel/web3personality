import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import ockCss from "@coinbase/onchainkit/styles.css?url";

export const Route = createRootRoute({
  head: () => {
    const brandName = import.meta.env.VITE_BRAND_NAME || "Web3Personality";
    const brandTitle = import.meta.env.VITE_BRAND_TITLE || "Web3Personality - Discover Your On-Chain Personality | Built on Base";
    const brandDescription = import.meta.env.VITE_BRAND_DESCRIPTION || "Unlock your Web3 identity! Take engaging personality quizzes and mint your results as permanent NFT credentials on Base blockchain. Join the on-chain personality revolution.";
    const brandOgTitle = import.meta.env.VITE_BRAND_OG_TITLE || "Web3Personality - Discover Your On-Chain Personality";
    const brandOgDescription = import.meta.env.VITE_BRAND_OG_DESCRIPTION || "Take interactive personality quizzes and immortalize your results on-chain. Build your verifiable Web3 identity with NFT-backed personality credentials on Base.";
    const brandTwitterTitle = import.meta.env.VITE_BRAND_TWITTER_TITLE || "Web3Personality - Your On-Chain Personality Awaits";
    const brandTwitterDescription = import.meta.env.VITE_BRAND_TWITTER_DESCRIPTION || "Discover who you are in Web3! Take personality quizzes, mint NFT credentials, and build your verifiable on-chain identity on Base. ⛓️✨";
    const publicUrl = import.meta.env.VITE_PUBLIC_URL || "https://web3personality.vercel.app";

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: brandTitle,
        },
        {
          name: "description",
          content: brandDescription,
        },
        // Open Graph tags
        {
          property: "og:title",
          content: brandOgTitle,
        },
        {
          property: "og:description",
          content: brandOgDescription,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:url",
          content: publicUrl,
        },
        {
          property: "og:image",
          content: `${publicUrl}/api/og-image/png`,
        },
        {
          property: "og:image:width",
          content: "1200",
        },
        {
          property: "og:image:height",
          content: "630",
        },
        // Twitter Card tags
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: brandTwitterTitle,
        },
        {
          name: "twitter:description",
          content: brandTwitterDescription,
        },
        {
          name: "twitter:image",
          content: `${publicUrl}/api/og-image/png`,
        },
        // Farcaster Frame tags
        {
          property: "fc:frame",
          content: "vNext",
        },
        {
          property: "fc:frame:image",
          content: `${publicUrl}/api/og-image/png`,
        },
        {
          property: "fc:frame:button:1",
          content: "Take Test",
        },
        {
          property: "fc:frame:button:1:action",
          content: "link",
        },
        {
          property: "fc:frame:button:1:target",
          content: publicUrl,
        },
        // Farcaster Mini App metadata
        {
          name: "fc:miniapp",
          content: JSON.stringify({
            version: "next",
            imageUrl: `${publicUrl}/api/og-image/png`,
            button: {
              title: "Take Test",
              action: {
                type: "launch_miniapp",
                name: brandName,
                url: publicUrl,
                splashImageUrl: `${publicUrl}/api/og-image/png`,
                splashBackgroundColor: "#0f172a",
              },
            },
          }),
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "stylesheet",
          href: ockCss,
        },
      ],
    };
  },
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div>
      404 Page Not Found...
    </div>
  )
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
