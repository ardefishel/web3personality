import { createFileRoute } from "@tanstack/react-router";
import { QuizBrowser } from "./-components/list-quiz";
import { FeaturedQuizHighlight } from "./-components/featured-quiz";

export const Route = createFileRoute("/v2/_appv2Layout/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="space-y-8 lg:space-y-12">
      <FeaturedQuizHighlight />
      <QuizBrowser />
    </div>
  );
}


