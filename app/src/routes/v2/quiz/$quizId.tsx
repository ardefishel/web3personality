import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Frown, FrownIcon, Meh, Smile, SmilePlus } from "lucide-react";
import { Brand } from "../-components/brand";
import { QuizData } from "../-components/list-quiz";

export const Route = createFileRoute("/v2/quiz/$quizId")(
  {
    component: QuizPage,
  },
);

// Scale options for Likert scale (1-5)
const SCALE_OPTIONS = [
  { value: 1, label: "Very Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Very Agree" },
];

function QuizPage() {
  const { quizId } = Route.useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [detailError, setDetailError] = useState(false);
  const [quizDetail, setQuizDetail] = useState<QuizData | null>(null);

  // Mock quiz data - replace with actual API call later
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        // Mock data for UI development
        const mockQuizData: QuizData = {
          id: "0001",
          title: "Career Compass",
          category: "Professional",
          description: "Discover your ideal career path and work style. This comprehensive assessment analyzes your strengths, preferences, and natural talents to guide you toward fulfilling professional opportunities.",
          featuredImage: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
          personalityTypes: [
            {
              id: "leader",
              imageUrl: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
              name: "The Leader",
            },
            {
              id: "innovator",
              imageUrl: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
              name: "The Innovator",
            },
            {
              id: "supporter",
              imageUrl: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
              name: "The Supporter",
            },
            {
              id: "analyst",
              imageUrl: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
              name: "The Analyst",
            },
            {
              id: "creator",
              imageUrl: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
              name: "The Creator",
            },
          ],
          questions: [
            "I enjoy learning about new blockchain technologies",
            "I prefer decentralized solutions over centralized ones",
            "I actively participate in DAO governance",
            "I believe in the future of Web3",
            "I prioritize security in my cryptocurrency transactions",
            "I'm interested in NFTs and digital collectibles",
            "I think DeFi protocols are revolutionary",
            "I prefer self-custody of my digital assets",
          ],
        };
        
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setQuizDetail(mockQuizData);
      } catch (error) {
        console.error("Failed to load quiz:", error);
        setDetailError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionIndex: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!quizDetail) return;

    setIsSubmitting(true);

    // Create answers array with full details
    const answersArray = quizDetail.questions.map((question, index) => ({
      questionIndex: index,
      question: question,
      answer: answers[index],
      answerLabel:
        SCALE_OPTIONS.find((opt) => opt.value === answers[index])?.label || "",
    }));

    // Log the answers to console
    console.log("Quiz Submission:", {
      quizId: quizId,
      quizTitle: quizDetail.title,
      totalQuestions: quizDetail.questions.length,
      answers: answersArray,
      timestamp: new Date().toISOString(),
    });

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);

    // Navigate back after submission
    navigate({ to: "/v2" });
  };

  const allQuestionsAnswered =
    quizDetail?.questions.every((_, index) => answers[index] !== undefined) ||
    false;

  const answeredCount = Object.keys(answers).length;
  const totalCount = quizDetail?.questions.length || 0;
  const progressPercent =
    totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  if (isLoading) {
    return <QuizLoadingState />;
  }

  if (detailError || !quizDetail) {
    return <QuizErrorState onBackClick={() => navigate({ to: "/v2" })} />;
  }

  return (
    <div className="min-h-dvh bg-base-100 flex flex-col">
        {/* Header */}
        <QuizHeader onBackClick={() => navigate({ to: "/v2" })} />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-28 lg:pb-8">
          <div className="max-w-2xl mx-auto w-full px-4 lg:px-6 py-6">
            {/* Quiz Title Section */}
            <div className="mb-6">
              <div className="mb-4">
                <p className="text-xs text-base-content/50 uppercase tracking-wider mb-2">Quiz</p>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                  {quizDetail.title}
                </h1>
                <p className="text-base-content/70 text-sm lg:text-base">
                  {quizDetail.description}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-base-content/60">
                  {answeredCount}/{totalCount}
                </span>
              </div>
              <progress
                className="progress progress-accent w-full"
                value={answeredCount}
                max={totalCount}
              ></progress>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {quizDetail.questions.map((question, index) => (
                <QuestionCard
                  key={index}
                  questionNumber={index + 1}
                  question={question}
                  selectedValue={answers[index]}
                  onAnswerChange={(value) =>
                    handleAnswerChange(index, value)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Submit Section - Mobile */}
        <div className="fixed bottom-0 left-0 right-0 lg:static border-t border-base-300 bg-base-100 px-4 py-4 lg:relative">
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-2 mb-4 lg:mb-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    {allQuestionsAnswered
                      ? "Ready to submit?"
                      : "Complete all questions"}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {progressPercent}% complete
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || isSubmitting}
              className={`btn w-full btn-accent lg:self-start ${
                isSubmitting ? "loading" : ""
              } ${!allQuestionsAnswered ? "btn-disabled" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Submitting...
                </>
              ) : (
                "Submit Quiz"
              )}
            </button>
          </div>
        </div>
    </div>
  );
}

interface QuizHeaderProps {
  onBackClick: () => void;
}

function QuizHeader({ onBackClick }: QuizHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-base-300 bg-base-100/95 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto w-full px-4 lg:px-6 py-4 flex items-center gap-3">
        <button
          onClick={onBackClick}
          className="btn btn-ghost btn-circle btn-sm"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <Brand />
        </div>
      </div>
    </header>
  );
}

interface QuestionCardProps {
  questionNumber: number;
  question: string;
  selectedValue?: number;
  onAnswerChange: (value: number) => void;
}

function QuestionCard({
  questionNumber,
  question,
  selectedValue,
  onAnswerChange,
}: QuestionCardProps) {
  return (
    <div className="card bg-base-100 border border-base-200 rounded-xl">
      <div className="card-body p-4 lg:p-6">
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <span className="badge badge-accent badge-lg font-semibold">
              {questionNumber}
            </span>
            <h3 className="text-base lg:text-lg font-semibold leading-relaxed flex-1 pt-1">
              {question}
            </h3>
          </div>
        </div>

        {/* Likert Scale Options */}
        <div className="space-y-2">
          {SCALE_OPTIONS.map((option) => (
            <LikertScaleButton
              key={option.value}
              option={option}
              isSelected={selectedValue === option.value}
              onChange={() => onAnswerChange(option.value)}
            />
          ))}
        </div>

        {/* Selected Value Display */}
        {selectedValue !== undefined && (
          <div className="mt-4 pt-4 border-t border-base-200">
            <p className="text-xs text-base-content/60">
              Selected: <span className="font-semibold">{SCALE_OPTIONS.find(o => o.value === selectedValue)?.label}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface LikertScaleButtonProps {
  option: (typeof SCALE_OPTIONS)[0];
  isSelected: boolean;
  onChange: () => void;
}

function LikertScaleButton({
  option,
  isSelected,
  onChange,
}: LikertScaleButtonProps) {
  const getOptionConfig = (value: number) => {
    if (value === 1) {
      return { 
        icon: <Frown className="w-5 h-5" />,
        color: "text-error",
        selectedBg: "bg-accent",
      };
    }
    if (value === 2) {
      return { 
        icon: <FrownIcon className="w-5 h-5" />,
        color: "text-warning",
        selectedBg: "bg-accent",
      };
    }
    if (value === 3) {
      return { 
        icon: <Meh className="w-5 h-5" />,
        color: "text-base-content/60",
        selectedBg: "bg-accent",
      };
    }
    if (value === 4) {
      return { 
        icon: <Smile className="w-5 h-5" />,
        color: "text-info",
        selectedBg: "bg-accent",
      };
    }
    return { 
      icon: <SmilePlus className="w-5 h-5" />,
      color: "text-success",
      selectedBg: "bg-accent",
    };
  };

  const config = getOptionConfig(option.value);

  return (
    <button
      onClick={onChange}
      className={`w-full px-4 py-3 rounded-xl border transition-all ${
        isSelected
          ? `${config.selectedBg} border-accent text-accent-content shadow-md scale-[1.02]`
          : `bg-base-100 border-base-300 hover:border-base-content/20 hover:bg-base-200`
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 ${
          isSelected ? "text-accent-content" : config.color
        }`}>
          {config.icon}
        </div>
        <span className="flex-1 text-left font-medium text-sm lg:text-base">
          {option.label}
        </span>
        {isSelected && (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

function QuizLoadingState() {
  return (
    <div className="min-h-dvh bg-base-100 flex flex-col">
      <QuizHeader onBackClick={() => {}} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-lg font-medium">Loading quiz...</p>
        </div>
      </div>
    </div>
  );
}

interface QuizErrorStateProps {
  onBackClick: () => void;
}

function QuizErrorState({ onBackClick }: QuizErrorStateProps) {
  return (
    <div className="min-h-dvh bg-base-100 flex flex-col">
      <QuizHeader onBackClick={onBackClick} />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Quiz</h2>
          <p className="text-base-content/70 mb-6">
            Unable to load quiz details. Please try again.
          </p>
          <button
            onClick={onBackClick}
            className="btn btn-accent"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
