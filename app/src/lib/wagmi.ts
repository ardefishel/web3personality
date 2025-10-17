import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "Web3Personality",
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(`https://sepolia.base.org`),
  },
});