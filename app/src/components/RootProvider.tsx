import { ReactNode, useEffect } from "react";
import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { ClientOnly } from "@tanstack/react-router";

export function RootProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  useEffect(() => {
    // Initialize Farcaster SDK on client side only
    import("@farcaster/miniapp-sdk")
      .then(({ sdk }) => {
        sdk.actions.ready();
      })
      .catch((error) => {
        console.error("Failed to initialize Farcaster SDK:", error);
      });
  }, []);

  return (
    <ClientOnly>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY}
            chain={baseSepolia}
            config={{
              appearance: {
                mode: "auto",
                theme: "cyberpunk",
              },
              wallet: {
                display: "modal",
                preference: "all",
              },
            }}
            miniKit={{
              enabled: true,
              autoConnect: true,
              notificationProxyUrl: undefined,
            }}
          >
            {children}
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClientOnly>
  );
}
