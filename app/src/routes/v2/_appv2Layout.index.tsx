import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/v2/_appv2Layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/v2/_appv2Layout/"!</div>
}
