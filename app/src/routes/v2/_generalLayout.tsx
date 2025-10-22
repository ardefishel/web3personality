import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/v2/_generalLayout")({
  component: GeneralLayout,
});

function GeneralLayout() {
  return (
    <div className="min-h-dvh relative bg-base-100">
      <div className="max-w-md lg:max-w-4xl overflow-hidden mx-auto min-h-dvh relative">
        <GeneralHeader />
        <main className="pt-16 px-4 lg:px-8 pb-8 lg:pb-16">
          <div className="max-w-3xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function GeneralHeader() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  
  const getPageTitle = () => {
    if (pathname.includes("/faq")) return "FAQ";
    if (pathname.includes("/privacy")) return "Privacy Policy";
    if (pathname.includes("/about")) return "About";
    if (pathname.includes("/profile")) return "Profile Settings";
    if (pathname.includes("/network")) return "Change Network";
    return "";
  };

  return (
    <header className="navbar bg-base-100/95 backdrop-blur-sm fixed top-0 w-full shadow-sm px-4 lg:px-8 py-3 z-10 border-b border-base-300">
      <div className="max-w-md lg:max-w-4xl mx-auto w-full flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/v2/account" })}
          className="btn btn-ghost btn-circle btn-sm"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg lg:text-xl font-semibold">{getPageTitle()}</h1>
      </div>
    </header>
  );
}
