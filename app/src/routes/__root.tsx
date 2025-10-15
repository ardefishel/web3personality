import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { lazy, Suspense } from "react";

import Header from "../components/Header";

import appCss from "../styles.css?url";
import ockCss from "@coinbase/onchainkit/styles.css?url";

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
            <Header />
            {children}
            <TanStackDevtools
              config={{
                position: "bottom-right",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </RootProvider>
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
