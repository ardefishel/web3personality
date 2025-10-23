import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(deprecated)/legacy/_app/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/"!</div>
}
