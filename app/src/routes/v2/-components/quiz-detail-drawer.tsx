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
        <Drawer.Content className="bg-base-100 flex flex-col fixed bottom-0 left-0 right-0 min-h-[80vh] rounded-t-3xl z-50 mx-auto max-w-md">
          <div className="flex-1 overflow-y-auto">
            <DrawerHandle />
            <QuizFeaturedImage src={quiz.featuredImage} alt={quiz.title} />
            <div className="px-6 pb-8 space-y-6 flex flex-col ">
              <PersonalityTypesCarousel types={quiz.personalityTypes} />
              <QuizInfo
                title={quiz.title}
                category={quiz.category}
                description={quiz.description}
              />
              <StartQuizButton quizId={quiz.id} />
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
    <div className="w-full aspect-video overflow-hidden mb-6">
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
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="flex gap-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
    <div className="flex-shrink-0 w-24">
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
    <div className="space-y-3 flex-1">
      <div className="flex items-center gap-2">
        <span className="badge badge-accent badge-sm">{category}</span>
      </div>
      <h2 className="text-3xl font-bold leading-tight">{title}</h2>
      <p className="text-base-content/70 leading-relaxed">{description}</p>
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
      className="btn btn-accent w-full rounded-full btn-lg "
    >
      Start Quiz
    </button>
  );
}
