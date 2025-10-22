import { Search } from "lucide-react";

export function QuizListSection() {
  return (
    <section className="">
      <h2 className="text-3xl my-4 font-bold">Browse all Quizzes</h2>
      <SearchInputQuiz />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <QuizCard />
        <QuizCard />
        <QuizCard />
      </div>
    </section>
  );
}


function SearchInputQuiz() {
    return (
      <label className="input w-full rounded-full">
        <Search />
        <input type="search" required placeholder="Search" />
      </label>
    );
  }
  
  function QuizCard() {
    return (
      <div className="bg-accent h-54 card relative">
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-10% from-black/60 to-transparent">
          <caption className="badge badge-sm">#0001</caption>
          <h4 className="text-lg font-semibold">Series Title</h4>
        </div>
      </div>
    );
  }