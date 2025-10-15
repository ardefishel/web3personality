import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";


import appCss from "../styles.css?url";
import ockCss from "@coinbase/onchainkit/styles.css?url";
import AppLayout from "@/components/AppLayout";

// Lazy load RootProvider to prevent server-side imports of Web3 packages
const RootProvider = lazy(() => import("@/components/RootProvider").then(m => ({ default: m.RootProvider })));

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
        title: "TanStack Start Starter",
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
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Suspense fallback={null}>
          <RootProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </RootProvider>
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
