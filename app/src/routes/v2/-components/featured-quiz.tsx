import { useState } from "react";
import { QuizData } from "./list-quiz";
import { QuizDetailDrawer } from "./quiz-detail-drawer";

export function FeaturedQuizHighlight() {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Discover Your Type"
        subtitle="Take our featured personality quiz"
      />
      <FeaturedQuizCard />
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-3xl font-bold">{title}</h2>
      {subtitle && <p className="text-base-content/70 text-sm">{subtitle}</p>}
    </div>
  );
}

const MOCK_FEATURED_QUIZ: QuizData = {
  id: "0001",
  title: "Career Compass",
  category: "Professional",
  description:
    "Discover your ideal career path and work style. This comprehensive assessment analyzes your strengths, preferences, and natural talents to guide you toward fulfilling professional opportunities.",
  featuredImage:
    "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
  personalityTypes: [
    {
      id: "leader",
      imageUrl:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      name: "The Leader",
    },
    {
      id: "innovator",
      imageUrl:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      name: "The Innovator",
    },
    {
      id: "supporter",
      imageUrl:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      name: "The Supporter",
    },
    {
      id: "analyst",
      imageUrl:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      name: "The Analyst",
    },
    {
      id: "creator",
      imageUrl:
        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      name: "The Creator",
    },
  ],
};

function FeaturedQuizCard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleQuizClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <article className="card bg-base-300 rounded-4xl overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="badge badge-soft badge-accent">Featured</span>
          <span className="text-xs text-base-content/60">12 questions</span>
        </div>

        <h3 className="text-2xl font-bold leading-tight">
          What's Your Cosmic Personality?
        </h3>

        <p className="text-sm text-base-content/70">
          Explore the universe within you and discover your celestial archetype
        </p>
      </div>
      <QuestionPreviewCarousel items={MOCK_FEATURED_QUIZ.personalityTypes} />
      <div className="p-6 pt-4">
        <button
          onClick={handleQuizClick}
          className="btn btn-accent rounded-full w-full"
        >
          Start Quiz
        </button>
      </div>
      <QuizDetailDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        quiz={MOCK_FEATURED_QUIZ}
      />

    </article>
  );
}

interface PersonalityPreview {
  imageUrl: string;
  name: string;
}

interface QuestionPreviewCarouselProps {
  items: PersonalityPreview[];
}

function QuestionPreviewCarousel({ items }: QuestionPreviewCarouselProps) {
  return (
    <div className="overflow-x-auto px-6 pb-4">
      <div className="flex gap-4 scroll-smooth snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => (
          <PersonalityPreviewCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

interface QuestionPreviewCardProps {
  imageUrl: string;
  name: string;
}

function PersonalityPreviewCard({ imageUrl, name }: QuestionPreviewCardProps) {
  return (
    <div className="snap-start rounded-xl w-40 h-56 overflow-hidden relative shrink-0 group cursor-pointer transition-transform hover:scale-105">
      <figure className="h-full">
        <img className="object-cover h-full w-full" src={imageUrl} alt={name} />
      </figure>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent from-20% p-3">
        <span className="text-white font-semibold text-sm line-clamp-2">
          {name}
        </span>
      </div>
    </div>
  );
}
