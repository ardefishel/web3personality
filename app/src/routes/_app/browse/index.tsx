import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_app/browse/')({
  component: RouteComponent,
})

const featuredCollections = [
  {
    id: 1,
    name: 'Walruz Personality Collection',
    image: 'https://img.tradeport.gg/?url=https%3A%2F%2Fwalrus.tusky.io%2FIYiaBFukGZBwMCBiQ5ya3Updq2onTJOSxqJtiIbT8zU&profile=c94c9db4-efda-42f1-9b6c-5b83d0340acd',
  },
  {
    id: 2,
    name: 'Tally Personality Collection',
    image: 'https://img.tradeport.gg/?url=https%3A%2F%2Ftradeport.mypinata.cloud%2Fipfs%2Fbafybeibpm6pdsabp6zswzcimky6j6kc3m3urh4d34fxt5xh3ubzsvnnxfy%3FpinataGatewayToken%3D5Uc_j2QFWW75kVPmXB6eWCJ0aVZmc4o9QAq5TiuPfMHZQLKa_VNL3uaXj5NKrq0w%26img-width%3D700%26img-height%3D700%26img-fit%3Dcover%26img-quality%3D80%26img-onerror%3Dredirect%26img-fit%3Dpad%26img-format%3Dwebp&profile=39f29b4d-02ca-4157-a034-2686ee4a0e0f&mime-type=io%2Fipfs%2Fbafybeibpm6pdsabp6zswzcimky6j6kc3m3urh4d34fxt5xh3ubzsvnnxfy',
  },
  {
    id: 3,
    name: 'Death Corp Personality Collection',
    image: 'https://img.tradeport.gg/?url=https%3A%2F%2Fwalrus.tusky.io%2FaCAL9atS22PWMs5Bv1C6x49YYTc5vxuDj9cfrd5ZH-8&profile=821b4657-5c30-4941-9b13-2b96b4af61f0',
  },
]

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCollections = featuredCollections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col gap-6 px-4 py-6">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6">Browse Collections</h1>

        {/* Search Field */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search collections..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredCollections.map((collection) => (
            <div key={collection.id} className="card bg-base-100 shadow-xl flex flex-col">
              <figure>
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-32 object-cover"
                />
              </figure>
              <div className="card-body p-3 flex flex-col flex-grow">
                <h2 className="card-title text-sm leading-tight flex-grow">{collection.name}</h2>
                <div className="card-actions mt-2">
                  <button className="btn btn-primary btn-sm w-full">Take Test</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg opacity-70">No collections found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
