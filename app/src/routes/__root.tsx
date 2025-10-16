import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";


import appCss from "../styles.css?url";
import ockCss from "@coinbase/onchainkit/styles.css?url";

// Lazy load components to prevent server-side imports of Web3 packages

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
        {/* <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <RootProvider>
            <Suspense fallback={null}>
              <AppLayout>
                {children}
              </AppLayout>
            </Suspense>
          </RootProvider>
        </Suspense> */}
        {children}
        <Scripts />
      </body>
    </html>
  );
}
