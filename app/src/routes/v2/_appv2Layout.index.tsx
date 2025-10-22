import { createFileRoute } from "@tanstack/react-router";
import { FeaturedQuiz } from "./-components/featured-quiz";

export const Route = createFileRoute("/v2/_appv2Layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <section className="gap-4 mt-4 flex flex-col">
        <h2 className="text-3xl font-bold">Featured Quiz</h2>
        <FeaturedQuiz />
      </section>
      <section className="">
      <h2 className="text-3xl mt-4 font-bold">Browse all Quizzes</h2>
      </section>
    </>
  );
}

