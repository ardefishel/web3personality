import { createFileRoute } from "@tanstack/react-router";
import { QuizListSection } from "./-components/list-quiz";
import { FeaturedQuizSection } from "./-components/featured-quiz";

export const Route = createFileRoute("/v2/_appv2Layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <FeaturedQuizSection/>
      <QuizListSection/>
    </>
  );
}


