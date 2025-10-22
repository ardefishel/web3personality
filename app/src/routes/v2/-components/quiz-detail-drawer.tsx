import { Drawer } from "vaul";

interface PersonalityType {
  id: string;
  imageUrl: string;
  name: string;
}

interface QuizDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: {
    id: string;
    title: string;
    category: string;
    description: string;
    featuredImage: string;
    personalityTypes: PersonalityType[];
  } | null;
}

export function QuizDetailDrawer({
  open,
  onOpenChange,
  quiz,
}: QuizDetailDrawerProps) {
  if (!quiz) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-base-100 flex flex-col fixed bottom-0 left-0 right-0 min-h-[80vh] lg:min-h-[75vh] rounded-t-3xl lg:rounded-t-2xl z-50 max-w-md lg:max-w-none mx-auto">
          <div className="flex-1 overflow-y-auto">
            <DrawerHandle />
            <div className="lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="lg:grid lg:grid-cols-5 lg:gap-8 lg:py-8">
                <div className="lg:col-span-2">
                  <QuizFeaturedImage src={quiz.featuredImage} alt={quiz.title} />
                </div>
                <div className="px-6 lg:px-0 pb-8 lg:pb-0 space-y-6 flex flex-col lg:col-span-3">
                  <QuizInfo
                    title={quiz.title}
                    category={quiz.category}
                    description={quiz.description}
                  />
                  <PersonalityTypesCarousel types={quiz.personalityTypes} />
                  <StartQuizButton quizId={quiz.id} />
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function DrawerHandle() {
  return (
    <div className="sticky top-0 z-10 bg-base-100 pt-4 pb-2">
      <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-base-300" />
    </div>
  );
}

interface QuizFeaturedImageProps {
  src: string;
  alt: string;
}

function QuizFeaturedImage({ src, alt }: QuizFeaturedImageProps) {
  return (
    <div className="w-full aspect-video lg:aspect-[4/5] overflow-hidden mb-6 lg:mb-0 lg:rounded-2xl lg:sticky lg:top-8">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

interface PersonalityTypesCarouselProps {
  types: PersonalityType[];
}

function PersonalityTypesCarousel({ types }: PersonalityTypesCarouselProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-base-content/70 mb-3">
        Possible Personalities
      </h3>
      <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
        <div className="flex lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {types.map((type) => (
            <PersonalityTypeCard key={type.id} {...type} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PersonalityTypeCardProps {
  imageUrl: string;
  name: string;
}

function PersonalityTypeCard({ imageUrl, name }: PersonalityTypeCardProps) {
  return (
    <div className="flex-shrink-0 w-24 lg:w-auto">
      <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-base-200">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <p className="text-xs text-center text-base-content/80 line-clamp-2 font-medium">
        {name}
      </p>
    </div>
  );
}

interface QuizInfoProps {
  title: string;
  category: string;
  description: string;
}

function QuizInfo({ title, category, description }: QuizInfoProps) {
  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="flex items-center gap-2">
        <span className="badge badge-accent badge-sm badge-outline lg:badge-md">{category}</span>
      </div>
      <h2 className="text-3xl lg:text-4xl font-bold leading-tight">{title}</h2>
      <p className="text-base-content/70 leading-relaxed lg:text-lg">{description}</p>
    </div>
  );
}

interface StartQuizButtonProps {
  quizId: string;
}

function StartQuizButton({ quizId }: StartQuizButtonProps) {
  const handleStartQuiz = () => {
    console.log("Starting quiz:", quizId);
  };

  return (
    <button
      onClick={handleStartQuiz}
      className="btn btn-accent w-full lg:self-start rounded-full btn-lg lg:px-12"
    >
      Start Quiz
    </button>
  );
}
