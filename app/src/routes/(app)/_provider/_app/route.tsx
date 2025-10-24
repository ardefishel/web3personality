import {
  createFileRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import SidebarNavigation from "./-components/sidebar";
import BottomNavigation from "./-components/navigation-bottom";
import AppHeader from "./-components/header";

export const Route = createFileRoute("/(app)/_provider/_app")({
  component: MobileLayout,
});


function MobileLayout() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const [checkDone, setCheckDone] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isQuizPage = pathname.includes("/quiz/");

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedApp");

    if (!hasVisited && !isConnected) {
      navigate({ to: "/onboard", replace: true });
    } else {
      setCheckDone(true);
    }
  }, [isConnected, navigate]);

  if (!checkDone) {
    return null;
  }

  // Quiz page has its own layout, so render it without the app wrapper
  if (isQuizPage) {
    return (
      <div className="min-h-dvh relative bg-base-100">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-dvh relative bg-base-100">
      <div className="max-w-md lg:max-w-6xl overflow-hidden mx-auto min-h-dvh relative">
        <AppHeader />
        <div className="lg:flex lg:gap-6 lg:pt-20">
          <SidebarNavigation />
          <main className="pt-20 pb-24 px-4 lg:pt-0 lg:pb-8 lg:flex-1">
            <Outlet />
          </main>
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}




