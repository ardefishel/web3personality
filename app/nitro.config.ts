export default {
  rollupConfig: {
    external: [
      '@farcaster/miniapp-sdk',
      '@farcaster/miniapp-core',
      '@farcaster/miniapp-wagmi-connector',
      '@coinbase/onchainkit',
      '@coinbase/wallet-sdk',
      'wagmi',
      '@wagmi/core',
      '@wagmi/connectors',
    ],
  },
}
