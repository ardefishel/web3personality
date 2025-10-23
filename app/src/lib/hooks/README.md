# Quiz Hooks

React hooks for querying quiz data from the QuizManager smart contract and IPFS.

## Available Hooks

### `useQuiz(quizId)`
Get a single quiz with complete data from contract and IPFS, including collection-level metadata.

```tsx
import { useQuiz } from '@/lib'

function QuizDetail({ quizId }: { quizId: number }) {
  const { data: quiz, collectionData, isActive, isLoading, error } = useQuiz(quizId)
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading quiz</div>
  if (!quiz) return <div>Quiz not found</div>
  
  return (
    <div>
      <h2>{quiz.title}</h2>
      {isActive ? <span>Active</span> : <span>Inactive</span>}
      <p>{quiz.description}</p>
      
      {/* Access collection-level data */}
      {collectionData && (
        <div>
          <p>Total Personalities: {collectionData.totalPersonalities}</p>
          <p>Attributes: {collectionData.attributes.join(', ')}</p>
        </div>
      )}
      
      <div>
        {quiz.personalityTypes.map(type => (
          <img key={type.id} src={type.imageUrl} alt={type.name} />
        ))}
      </div>
    </div>
  )
}
```

### `useQuizzes()`
Get all quizzes with complete data from contract and IPFS.

```tsx
import { useQuizzes } from '@/lib'

function QuizList() {
  const { data: quizzes, isLoading } = useQuizzes()
  
  if (isLoading) return <div>Loading quizzes...</div>
  
  return (
    <div>
      {quizzes.map(quiz => (
        <div key={quiz.id}>
          <h3>{quiz.title}</h3>
          <span>{quiz.category}</span>
          {quiz.isActive && <span>Active</span>}
          {quiz.collectionData && (
            <p>{quiz.collectionData.totalPersonalities} personalities</p>
          )}
        </div>
      ))}
    </div>
  )
}
```

### `useFeaturedQuiz(quizId?)`
Get featured quiz - either by specific ID or auto-select first active quiz.

```tsx
import { useFeaturedQuiz } from '@/lib'

// Auto-select first active quiz
function AutoFeaturedQuiz() {
  const { data: quiz, collectionData, isActive, isLoading } = useFeaturedQuiz()
  
  if (isLoading) return <div>Loading...</div>
  if (!quiz) return <div>No quiz available</div>
  
  return (
    <div>
      <QuizCard quiz={quiz} />
      {collectionData && (
        <p>Questions: {collectionData.questions.length}</p>
      )}
    </div>
  )
}

// Show specific quiz as featured
function SpecificFeaturedQuiz() {
  const { data: quiz, collectionData, isActive, isLoading } = useFeaturedQuiz(1)
  
  if (isLoading) return <div>Loading...</div>
  if (!quiz) return <div>Quiz not found</div>
  
  return <QuizCard quiz={quiz} isActive={isActive} />
}
```

### `useActiveQuizzes()`
Get only active quizzes.

```tsx
import { useActiveQuizzes } from '@/lib'

function ActiveQuizList() {
  const { data: activeQuizzes, isLoading } = useActiveQuizzes()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h2>Active Quizzes ({activeQuizzes.length})</h2>
      {activeQuizzes.map(quiz => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  )
}
```

## Data Structure

### QuizData Interface

Simplified quiz data interface used throughout the app:

```typescript
interface QuizData {
  id: string
  title: string
  category: string
  description: string
  featuredImage: string
  personalityTypes: Array<{
    id: string
    imageUrl: string
    name: string
  }>
  questions: string[]
}
```

### IPFSCollectionMetadata Interface

Full collection-level metadata from IPFS (available via `collectionData` property):

```typescript
interface IPFSCollectionMetadata {
  name: string
  description: string
  quizId: number
  totalPersonalities: number
  questions: string[]
  attributes: string[]           // Trait types used in quiz
  category?: string
  featuredImage?: string
  personalities: Array<{
    name: string
    tokenId: number
    image: string
    attributes: Array<{ 
      trait_type: string
      value: string 
    }>
  }>
}
```

## How It Works

1. **Contract Query** (wagmi)
   - Uses `useReadContract` to query QuizManager
   - Gets: quizId, quizCid (IPFS hash), isActive status

2. **IPFS Fetch** (React Query)
   - Fetches metadata from `https://ipfs.io/ipfs/{quizCid}/`
   - **Priority 1**: Tries `collection.json` first (recommended format with full data)
   - **Priority 2**: Falls back to `index.json` for backward compatibility
   - **Priority 3**: Falls back to individual `{tokenId}.json` files for personalities

3. **Data Transform**
   - Converts IPFS collection data to `QuizData` interface
   - Maps personality metadata to personalityTypes array
   - Extracts questions, description, category, attributes
   - Provides both simplified `QuizData` and full `collectionData`

4. **Caching**
   - React Query with 5-minute stale time
   - Reduces redundant IPFS requests

## IPFS Data Format

### Collection Metadata (Recommended)
`{quizCid}/collection.json`

This is the **recommended format** created by the `new-quiz.ts` script:

```json
{
  "name": "Career Compass",
  "description": "Discover your ideal career path",
  "quizId": 1,
  "totalPersonalities": 5,
  "questions": [
    "I prefer to wander through strange galaxies...",
    "I recharge best when floating alone..."
  ],
  "attributes": ["Energy", "Decision Making", "Work Style"],
  "category": "Professional",
  "featuredImage": "https://...",
  "personalities": [
    {
      "name": "The Leader",
      "tokenId": 1000,
      "image": "https://ipfs.io/ipfs/{imageCid}/1000.png",
      "attributes": [
        { "trait_type": "Energy", "value": "Extroverted" },
        { "trait_type": "Decision Making", "value": "Logical" }
      ]
    }
  ]
}
```

### Individual Personality Files (Fallback)
`{quizCid}/{tokenId}.json`

Used as fallback if `collection.json` doesn't exist:

```json
{
  "tokenId": 1000,
  "name": "The Leader",
  "image": "https://ipfs.io/ipfs/{imageCid}/1000.png",
  "attributes": [
    {
      "trait_type": "Energy",
      "value": "Extroverted"
    }
  ]
}
```

### Legacy Index File (Fallback)
`{quizCid}/index.json`

Supported for backward compatibility:

```json
{
  "name": "Career Compass",
  "description": "Discover your ideal career path",
  "category": "Professional",
  "questions": ["Question 1", "Question 2"],
  "featuredImage": "https://...",
  "personalities": [...]
}
```

## Contract Integration

The hooks work with QuizManager contract structure:
- `quizIdCounter` - Total number of quizzes created
- `getQuizInfo(quizId)` - Returns (quizId, quizCid, isActive)
- Quiz CID points to IPFS metadata folder
- Personality token IDs = quizId * 1000 + index

## Collection-Level Data Features

The `collectionData` provides additional metadata beyond the basic `QuizData`:

- **totalPersonalities**: Total count of personality types
- **attributes**: List of trait types (e.g., "Energy", "Decision Making")
- **Full personality data**: Complete attributes for each personality type
- **Quiz metadata**: Original quiz configuration from IPFS

### Example: Using Collection Data

```tsx
function QuizStats({ quizId }: { quizId: number }) {
  const { collectionData } = useQuiz(quizId)
  
  if (!collectionData) return null
  
  return (
    <div>
      <h3>Quiz Statistics</h3>
      <p>Total Personalities: {collectionData.totalPersonalities}</p>
      <p>Questions: {collectionData.questions.length}</p>
      <p>Trait Types: {collectionData.attributes.join(', ')}</p>
      
      <h4>Personalities:</h4>
      {collectionData.personalities.map(p => (
        <div key={p.tokenId}>
          <h5>{p.name}</h5>
          <ul>
            {p.attributes.map((attr, i) => (
              <li key={i}>{attr.trait_type}: {attr.value}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

## Performance

- Contract queries are cached by wagmi
- IPFS fetches are cached by React Query (5-minute stale time)
- `collection.json` provides all data in single fetch (optimal)
- Multiple quizzes fetched in parallel with `Promise.allSettled`
- Failed IPFS fetches don't block other quizzes
