import { Search } from "lucide-react";
import { useState } from "react";
import { QuizDetailDrawer } from "./quiz-detail-drawer";
import { useQuizzes } from "@/lib";
import { useAccount, useReadContracts } from "wagmi";
import { quizManagerContract } from "@/lib/contracts";

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
  const [searchQuery, setSearchQuery] = useState("");
  const { address } = useAccount();
  const { data: quizzes, isLoading } = useQuizzes();

  // Get participation status for all quizzes if user is connected
  const { data: participationData } = useReadContracts({
    contracts: address
      ? quizzes.map((quiz) => ({
          ...quizManagerContract,
          functionName: "hasParticipated",
          args: [address, BigInt(quiz.id)],
        }))
      : [],
  });

  const handleQuizClick = (quiz: QuizData) => {
    setSelectedQuiz(quiz);
    setIsDrawerOpen(true);
  };

  // Filter quizzes:
  // 1. Only show active quizzes
  // 2. Filter by search query (case-insensitive, title only)
  const filteredQuizzes = quizzes.filter((quiz, index) => {
    // Filter out inactive quizzes
    if (!(quiz as any).isActive) return false;

    // Filter by search query
    if (!quiz.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Map participation status to filtered quizzes
  const quizzesWithStatus = filteredQuizzes.map((quiz) => {
    const originalIndex = quizzes.findIndex((q) => q.id === quiz.id);
    const hasParticipated = address && participationData
      ? participationData[originalIndex]?.result === true
      : false;

    return {
      ...quiz,
      hasParticipated,
    };
  });

  return (
    <>
      <section className="space-y-4">
        <SectionHeader
          title="Explore All Quizzes"
          subtitle="Find the perfect personality test for you"
        />
        <QuizSearchBar value={searchQuery} onChange={setSearchQuery} />
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-48 lg:h-56 rounded-3xl" />
            ))}
          </div>
        ) : quizzesWithStatus.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base-content/70">
              {searchQuery
                ? `No quizzes found matching "${searchQuery}"`
                : "No quizzes available yet"}
            </p>
          </div>
        ) : (
          <QuizGrid quizzes={quizzesWithStatus} onQuizClick={handleQuizClick} />
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

interface QuizSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function QuizSearchBar({ value, onChange }: QuizSearchBarProps) {
  return (
    <label className="input input-bordered w-full rounded-full flex items-center gap-2">
      <Search className="w-4 h-4 opacity-70" />
      <input
        type="search"
        placeholder="Search quizzes by title..."
        className="grow"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

interface QuizGridProps {
  quizzes: (QuizData & { hasParticipated: boolean })[];
  onQuizClick: (quiz: QuizData) => void;
}

function QuizGrid({ quizzes, onQuizClick }: QuizGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {quizzes.map((quiz) => (
        <QuizGridCard
          key={quiz.id}
          quiz={quiz}
          hasParticipated={quiz.hasParticipated}
          onClick={() => onQuizClick(quiz)}
        />
      ))}
    </div>
  );
}

interface QuizGridCardProps {
  quiz: QuizData;
  hasParticipated: boolean;
  onClick: () => void;
}

function QuizGridCard({ quiz, hasParticipated, onClick }: QuizGridCardProps) {
  const imageUrl = quiz.featuredImage || quiz.personalityTypes[0]?.imageUrl || 'https://via.placeholder.com/400x300?text=Quiz'

  return (
    <article
      onClick={onClick}
      className="group card h-56 lg:h-64 relative overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-95 rounded-2xl"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* Gradient Overlay - Only bottom half */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative h-full p-4 flex flex-col justify-between">
        {/* Top Section - Badges */}
        <div className="flex items-start justify-between gap-2">
          <span className="badge badge-sm bg-black/70 text-white border-0 backdrop-blur-sm shadow-lg">
            {quiz.category}
          </span>
          {hasParticipated && (
            <div className="badge badge-success badge-sm gap-1 shadow-lg">
              <span>✓</span>
              <span className="hidden sm:inline">Done</span>
            </div>
          )}
        </div>

        {/* Bottom Section - Title & Info */}
        <div className="space-y-2">
          <h4 className="text-lg lg:text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
            {quiz.title}
          </h4>
          <div className="flex items-center justify-between text-white/80 text-xs">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {quiz.personalityTypes.length} types
            </span>
            <span className="text-white/60">#{quiz.id}</span>
          </div>
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </article>
  );
}
