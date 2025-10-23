import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_provider/_app/collection/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/_provider/_app/collection/"!</div>
}
