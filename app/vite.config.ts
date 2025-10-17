import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'

const config = defineConfig({
  plugins: [
    nitroV2Plugin(
      {
        rollupConfig: {
          external: [
            '@farcaster/miniapp-sdk',
            '@farcaster/miniapp-core',
            '@farcaster/miniapp-wagmi-connector',
            '@coinbase/wallet-sdk',
            'wagmi',
            '@wagmi/core',
            '@wagmi/connectors',
          ],
        },
      }
    ),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
