import { createFileRoute } from '@tanstack/react-router'
import { Construction } from 'lucide-react'

export const Route = createFileRoute('/(app)/_provider/_general/network')({
  component: ChangeNetworkPage,
})

function ChangeNetworkPage() {
  return <UnderDevelopment />
}

function UnderDevelopment() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center">
        <Construction className="w-12 h-12 text-base-content/60" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Under Development</h2>
        <p className="text-base-content/70 max-w-sm">
          This feature is currently being built. Check back soon for updates!
        </p>
      </div>
    </div>
  )
}
