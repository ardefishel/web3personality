import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import ockCss from "@coinbase/onchainkit/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Web3Personality - On-Chain Personality Test",
      },
      {
        name: "description",
        content: "An on-chain personality test built on Base blockchain. Take personality tests and mint your results as verifiable on-chain credentials.",
      },
      // Open Graph tags
      {
        property: "og:title",
        content: "Web3Personality - On-Chain Personality Test",
      },
      {
        property: "og:description",
        content: "An on-chain personality test built on Base blockchain. Take personality tests and mint your results as verifiable on-chain credentials.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://web3personality.vercel.app",
      },
      {
        property: "og:image",
        content: "https://web3personality.vercel.app/api/og-image/png",
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
        content: "Web3Personality - On-Chain Personality Test",
      },
      {
        name: "twitter:description",
        content: "An on-chain personality test built on Base blockchain. Take personality tests and mint your results as verifiable on-chain credentials.",
      },
      {
        name: "twitter:image",
        content: "https://web3personality.vercel.app/api/og-image/png",
      },
      // Farcaster Frame tags
      {
        property: "fc:frame",
        content: "vNext",
      },
      {
        property: "fc:frame:image",
        content: "https://web3personality.vercel.app/api/og-image/png",
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
        content: "https://web3personality.vercel.app",
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
  }),
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
