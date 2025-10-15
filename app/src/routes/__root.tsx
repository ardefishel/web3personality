import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { useEffect, useState } from "react";

import Header from "../components/Header";

import appCss from "../styles.css?url";
import ockCss from "@coinbase/onchainkit/styles.css?url";
import { RootProvider } from "@/components/RootProvider";

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

// function ClientProvider({ children }: { children: React.ReactNode }) {
//   const [RootProvider, setRootProvider] = useState<any>(null);

//   useEffect(() => {
//     // Dynamically import RootProvider only on client side
//     import("@/components/RootProvider").then((mod) => {
//       setRootProvider(() => mod.RootProvider);
//     });
//   }, []);

//   // Return children without provider during SSR and initial render
//   if (!RootProvider) {
//     return <>{children}</>;
//   }

//   return <RootProvider>{children}</RootProvider>;
// }

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
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
        <Scripts />
      </body>
    </html>
  );
}
