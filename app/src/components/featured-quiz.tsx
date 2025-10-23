import { useState } from "react";
import { QuizDetailDrawer } from "./quiz-detail-drawer";
import { useFeaturedQuiz } from "@/lib";

interface FeaturedQuizHighlightProps {
  quizId?: number;
}

export function FeaturedQuizHighlight({ quizId }: FeaturedQuizHighlightProps = {}) {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Discover Your Type"
        subtitle="Take our featured personality quiz"
      />
      <FeaturedQuizCard quizId={quizId} />
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

interface FeaturedQuizCardProps {
  quizId?: number;
}

function FeaturedQuizCard({ quizId }: FeaturedQuizCardProps = {}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: featuredQuiz, isLoading } = useFeaturedQuiz(quizId);

  const handleQuizClick = () => {
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <article className="card bg-base-300 rounded-4xl overflow-hidden">
        <div className="p-6 lg:p-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="skeleton h-6 w-20"></div>
            <div className="skeleton h-4 w-24"></div>
          </div>
          <div className="skeleton h-8 w-3/4"></div>
          <div className="skeleton h-20 w-full"></div>
        </div>
      </article>
    );
  }

  if (!featuredQuiz) {
    return (
      <article className="card bg-base-300 rounded-4xl overflow-hidden">
        <div className="p-6 lg:p-8 text-center">
          <p className="text-base-content/70">No featured quiz available</p>
        </div>
      </article>
    );
  }

  return (
    <article className="card bg-base-300 rounded-4xl overflow-hidden">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:p-8">
        <div className="p-6 lg:p-0 space-y-4 lg:space-y-6 lg:flex lg:flex-col lg:justify-center">
          <div className="flex items-center justify-between lg:justify-start lg:gap-4">
            <span className="badge badge-soft badge-accent">Featured</span>
            <span className="text-xs text-base-content/60">
              {featuredQuiz.personalityTypes.length} personalities
            </span>
          </div>

          <h3 className="text-2xl lg:text-3xl font-bold leading-tight">
            {featuredQuiz.title}
          </h3>

          <p className="text-sm lg:text-base text-base-content/70">
            {featuredQuiz.description}
          </p>
        </div>

        <QuestionPreviewCarousel items={featuredQuiz.personalityTypes} />
      </div>

      <div className="p-6 lg:p-8 pt-4 lg:pt-0">
        <button
          onClick={handleQuizClick}
          className="btn btn-accent rounded-full w-full lg:btn-lg"
        >
          Start Quiz
        </button>
      </div>

      <QuizDetailDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        quiz={featuredQuiz}
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
    <div className="overflow-x-auto px-6 pb-4 lg:px-0 lg:pb-0 lg:flex lg:items-center">
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
