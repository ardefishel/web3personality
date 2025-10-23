import { Search } from "lucide-react";
import { useState } from "react";
import { QuizDetailDrawer } from "./quiz-detail-drawer";
import { useQuizzes } from "@/lib";

export interface QuizData {
  id: string;
  title: string;
  category: string;
  description: string;
  featuredImage: string;
  personalityTypes: Array<{
    id: string;
    imageUrl: string;
    name: string;
  }>;
  questions: string[];
}

const MOCK_QUIZZES: QuizData[] = [
  {
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
    questions: [
      "I prefer to wander through strange galaxies rather than stick to a single star system.",
      "I recharge best when floating alone in my spaceship, far from the cosmic buzz.",
      "When chaos erupts on the space station, I’m the first to keep calm and fix things.",
      "I believe intuition is more reliable than star charts and data logs.",
      "I often take the pilot’s seat, even if I’ve never flown that type of ship before.",
    ],
  },
  {
    id: "0002",
    title: "Love Language",
    category: "Relationships",
    description:
      "Learn how you express and receive love. Understanding your love language helps build stronger, more meaningful connections with those who matter most.",
    featuredImage:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    personalityTypes: [
      {
        id: "words",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Words of Affirmation",
      },
      {
        id: "quality",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Quality Time",
      },
      {
        id: "gifts",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Receiving Gifts",
      },
      {
        id: "service",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Acts of Service",
      },
      {
        id: "touch",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Physical Touch",
      },
    ],
    questions: [
      "I prefer to wander through strange galaxies rather than stick to a single star system.",
      "I recharge best when floating alone in my spaceship, far from the cosmic buzz.",
      "When chaos erupts on the space station, I’m the first to keep calm and fix things.",
      "I believe intuition is more reliable than star charts and data logs.",
      "I often take the pilot’s seat, even if I’ve never flown that type of ship before.",
    ],
  },
  {
    id: "0003",
    title: "Creative Spirit",
    category: "Arts & Culture",
    description:
      "Uncover your unique creative expression. Whether you're an artist, musician, or creative thinker, discover what drives your imagination.",
    featuredImage:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    personalityTypes: [
      {
        id: "visionary",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "The Visionary",
      },
      {
        id: "craftsman",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "The Craftsman",
      },
      {
        id: "storyteller",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "The Storyteller",
      },
      {
        id: "performer",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "The Performer",
      },
    ],
    questions: [
      "I prefer to wander through strange galaxies rather than stick to a single star system.",
      "I recharge best when floating alone in my spaceship, far from the cosmic buzz.",
      "When chaos erupts on the space station, I’m the first to keep calm and fix things.",
      "I believe intuition is more reliable than star charts and data logs.",
      "I often take the pilot’s seat, even if I’ve never flown that type of ship before.",
    ],
  },
  {
    id: "0004",
    title: "Leadership Style",
    category: "Professional",
    description:
      "Identify your natural leadership approach. Understand how you motivate, influence, and inspire others to achieve collective goals.",
    featuredImage:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    personalityTypes: [
      {
        id: "visionary-leader",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Visionary Leader",
      },
      {
        id: "coach",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "The Coach",
      },
      {
        id: "democratic",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Democratic Leader",
      },
      {
        id: "pacesetter",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "The Pacesetter",
      },
    ],
    questions: [
      "I prefer to wander through strange galaxies rather than stick to a single star system.",
      "I recharge best when floating alone in my spaceship, far from the cosmic buzz.",
      "When chaos erupts on the space station, I’m the first to keep calm and fix things.",
      "I believe intuition is more reliable than star charts and data logs.",
      "I often take the pilot’s seat, even if I’ve never flown that type of ship before.",
    ],
  },
  {
    id: "0005",
    title: "Travel Persona",
    category: "Lifestyle",
    description:
      "Find your travel style and dream destinations. Are you an adventurer, a culture seeker, or a relaxation enthusiast? Let's find out!",
    featuredImage:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    personalityTypes: [
      {
        id: "adventurer",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "The Adventurer",
      },
      {
        id: "explorer",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Culture Explorer",
      },
      {
        id: "relaxer",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Beach Relaxer",
      },
      {
        id: "foodie",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "The Foodie",
      },
      {
        id: "photographer",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Photo Hunter",
      },
    ],
    questions: [
      "I prefer to wander through strange galaxies rather than stick to a single star system.",
      "I recharge best when floating alone in my spaceship, far from the cosmic buzz.",
      "When chaos erupts on the space station, I’m the first to keep calm and fix things.",
      "I believe intuition is more reliable than star charts and data logs.",
      "I often take the pilot’s seat, even if I’ve never flown that type of ship before.",
    ],
  },
  {
    id: "0006",
    title: "Communication Type",
    category: "Social",
    description:
      "Understand how you connect with others. Learn your communication strengths and how to build better relationships through effective dialogue.",
    featuredImage:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    personalityTypes: [
      {
        id: "direct",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Direct Communicator",
      },
      {
        id: "empathetic",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Empathetic Listener",
      },
      {
        id: "analytical",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Analytical Thinker",
      },
      {
        id: "expressive",
        imageUrl:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        name: "Expressive Speaker",
      },
    ],
    questions: [
      "I prefer to wander through strange galaxies rather than stick to a single star system.",
      "I recharge best when floating alone in my spaceship, far from the cosmic buzz.",
      "When chaos erupts on the space station, I’m the first to keep calm and fix things.",
      "I believe intuition is more reliable than star charts and data logs.",
      "I often take the pilot’s seat, even if I’ve never flown that type of ship before.",
    ],
  },
];

export function QuizBrowser() {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: quizzes, isLoading } = useQuizzes();

  const handleQuizClick = (quiz: QuizData) => {
    setSelectedQuiz(quiz);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <section className="space-y-4">
        <SectionHeader
          title="Explore All Quizzes"
          subtitle="Find the perfect personality test for you"
        />
        <QuizSearchBar />
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-48 lg:h-56 rounded-3xl" />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base-content/70">No quizzes available yet</p>
          </div>
        ) : (
          <QuizGrid quizzes={quizzes} onQuizClick={handleQuizClick} />
        )}
      </section>

      <QuizDetailDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        quiz={selectedQuiz}
      />
    </>
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

function QuizSearchBar() {
  return (
    <label className="input input-bordered w-full rounded-full flex items-center gap-2">
      <Search className="w-4 h-4 opacity-70" />
      <input type="search" placeholder="Search quizzes..." className="grow" />
    </label>
  );
}

interface QuizGridProps {
  quizzes: QuizData[];
  onQuizClick: (quiz: QuizData) => void;
}

function QuizGrid({ quizzes, onQuizClick }: QuizGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {quizzes.map((quiz) => (
        <QuizGridCard
          key={quiz.id}
          quiz={quiz}
          onClick={() => onQuizClick(quiz)}
        />
      ))}
    </div>
  );
}

interface QuizGridCardProps {
  quiz: QuizData;
  onClick: () => void;
}

function QuizGridCard({ quiz, onClick }: QuizGridCardProps) {
  return (
    <article
      onClick={onClick}
      className="card bg-gradient-to-br from-accent to-accent/80 h-48 lg:h-56 relative overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95"
    >
      <div className="absolute inset-0 bg-[url('https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp')] bg-cover bg-center opacity-20" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="relative h-full p-4 lg:p-6 flex flex-col justify-between">
        <div>
          <span className="badge badge-sm badge-ghost">{quiz.category}</span>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-white/70">#{quiz.id}</div>
          <h4 className="text-lg lg:text-xl font-bold text-white leading-tight line-clamp-2">
            {quiz.title}
          </h4>
        </div>
      </div>
    </article>
  );
}
