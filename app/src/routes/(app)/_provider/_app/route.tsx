import {
  createFileRoute,
  Outlet,
} from "@tanstack/react-router";


import SidebarNavigation from "./-components/sidebar";
import BottomNavigation from "./-components/navigation-bottom";
import AppHeader from "./-components/header";

export const Route = createFileRoute("/(app)/_provider/_app")({
  component: MobileLayout,
});


function MobileLayout() {
  return (
    <div className="min-h-dvh relative bg-base-100">
      <div className="max-w-md lg:max-w-6xl overflow-hidden mx-auto min-h-dvh relative">
        <AppHeader />
        <div className="lg:flex lg:gap-6 lg:pt-20">
          <SidebarNavigation />
          <main className="pt-20 md:pt-0 pb-24 px-4 lg:pb-8 lg:flex-1">
            <Outlet />
          </main>
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}




