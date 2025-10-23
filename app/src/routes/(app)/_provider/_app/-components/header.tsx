import { Brand } from "@/components/brand";
import { useRouterState } from "@tanstack/react-router";

function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAccountPage = pathname.includes("/account");

  return (
    <header className="navbar bg-base-100/95 backdrop-blur-sm fixed top-0 left-0 right-0 shadow-sm px-4 lg:px-8 py-3 z-10 border-b border-base-300">
      <div className="max-w-md lg:max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex-1">
          <Brand />
        </div>
        {!isAccountPage && <UserAvatar />}
      </div>
    </header>
  );
}

function UserAvatar() {
  return (
    <button
      className="avatar hover:opacity-80 transition-opacity"
      aria-label="User profile"
    >
      <div className="mask mask-squircle w-10">
        <img
          src="https://img.daisyui.com/images/profile/demo/distracted1@192.webp"
          alt="User avatar"
        />
      </div>
    </button>
  );
}

export default AppHeader;
