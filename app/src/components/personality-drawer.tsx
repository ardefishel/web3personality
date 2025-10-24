import { Drawer } from 'vaul'
import type { PersonalityNFT } from '@/lib'
import { X } from 'lucide-react'

interface PersonalityDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nft: PersonalityNFT | null
}

export function PersonalityDrawer({ open, onOpenChange, nft }: PersonalityDrawerProps) {
  if (!nft) return null

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" onClick={() => onOpenChange(false)} />
        <Drawer.Content className="bg-base-100 flex flex-col fixed bottom-0 left-0 right-0 min-h-[70vh] max-h-[90vh] lg:min-h-[75vh] rounded-t-3xl lg:rounded-t-2xl z-50 max-w-md lg:max-w-none mx-auto">
          <div className="flex-1 overflow-y-auto">
            <DrawerHandle onClose={() => onOpenChange(false)} />
            <div className="lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="lg:grid lg:grid-cols-5 lg:gap-8 lg:py-8">
                {/* Personality Image */}
                <div className="lg:col-span-2">
                  <PersonalityImage src={nft.personalityImage} alt={nft.personalityName} />
                </div>

                {/* Personality Details */}
                <div className="px-6 lg:px-0 pb-8 lg:pb-0 space-y-6 flex flex-col lg:col-span-3">
                  <PersonalityInfo
                    name={nft.personalityName}
                    quizName={nft.quizName}
                    category={nft.quizCategory}
                  />

                  {nft.attributes && nft.attributes.length > 0 && (
                    <AttributesSection attributes={nft.attributes} />
                  )}

                  <TokenInfo tokenId={nft.tokenId} quizId={nft.quizId} />
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

function DrawerHandle({ onClose }: { onClose: () => void }) {
  return (
    <div className="sticky top-0 z-10 bg-base-100 pt-4 pb-2 border-b border-base-200">
      <div className="flex items-center justify-between px-4">
        <div className="flex-1 flex justify-center">
          <div className="w-12 h-1.5 flex-shrink-0 rounded-full bg-base-300" />
        </div>
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost flex-shrink-0"
          aria-label="Close drawer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

interface PersonalityImageProps {
  src: string
  alt: string
}

function PersonalityImage({ src, alt }: PersonalityImageProps) {
  return (
    <div className="w-full aspect-video lg:aspect-[4/5] overflow-hidden mb-6 lg:mb-0 lg:rounded-2xl lg:sticky lg:top-8">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  )
}

interface PersonalityInfoProps {
  name: string
  quizName: string
  category: string
}

function PersonalityInfo({ name, quizName, category }: PersonalityInfoProps) {
  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="flex items-center gap-2">
        <span className="badge badge-accent badge-sm badge-outline lg:badge-md">{category}</span>
      </div>
      <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-accent">{name}</h2>
      <p className="text-base-content/70 leading-relaxed lg:text-lg">
        From the <span className="font-semibold">{quizName}</span> quiz
      </p>
    </div>
  )
}

interface AttributesSectionProps {
  attributes: Array<{ trait_type: string; value: string }>
}

function AttributesSection({ attributes }: AttributesSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-base-content/70 mb-3">Personality Traits</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {attributes.map((attr, index) => (
          <div key={index} className="bg-base-200 rounded-lg p-3">
            <div className="text-xs opacity-70 mb-1">{attr.trait_type}</div>
            <div className="font-semibold text-sm">{attr.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface TokenInfoProps {
  tokenId: number
  quizId: number
}

function TokenInfo({ tokenId, quizId }: TokenInfoProps) {
  return (
    <div className="bg-base-200 rounded-xl p-4">
      <h3 className="text-xs font-semibold text-base-content/70 mb-2 uppercase tracking-wide">
        NFT Details
      </h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="opacity-70">Token ID:</span>
          <span className="font-mono font-semibold">#{tokenId}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Quiz ID:</span>
          <span className="font-mono font-semibold">#{quizId}</span>
        </div>
      </div>
    </div>
  )
}
