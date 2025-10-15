import { Wallet } from '@coinbase/onchainkit/wallet'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/minikit/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Wallet/>
  </div>
}
