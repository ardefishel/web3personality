import { FeaturedQuizHighlight } from "@/components/featured-quiz";
import { QuizBrowser } from "@/components/list-quiz";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_provider/_app/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="space-y-8 lg:space-y-12">
      <FeaturedQuizHighlight quizId={1}/>
      <QuizBrowser />
    </div>
  );
}
