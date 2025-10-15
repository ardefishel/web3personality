import { Wallet } from "@coinbase/onchainkit/wallet";
import { Link } from "@tanstack/react-router";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import React from "react";

type Props = {
  children: React.ReactNode;
};

function TopBar() {
  return (
    <div className="navbar px-4 py-2">
      <div className="flex-1 flex items-center gap-1">
        <img src="/w3p-logo.png" alt="W3P" className="h-8 w-auto" />
        <h2 className="text-white font-bold">Web3Personality</h2>
      </div>
      <div className="flex-none">
        <Wallet />
      </div>
    </div>
  );
}

function BottomDock() {
  return (
    <div className="dock dock-sm bg-base-100/90 backdrop-blur supports-[backdrop-filter]:bg-base-100/75">
      <Link
        to="/"
        className="flex flex-col items-center"
        activeProps={{ className: "dock-active" }}
      >
        {/* Home icon */}
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
            <polyline
              points="1 11 12 2 23 11"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></polyline>
            <path
              d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></path>
            <line
              x1="12"
              y1="22"
              x2="12"
              y2="18"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></line>
          </g>
        </svg>
        <span className="dock-label">Dashboard</span>
      </Link>

      <a href="/browse" className="flex flex-col items-center">
        {/* Browse icon */}
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
            <polyline
              points="3 14 9 14 9 17 15 17 15 14 21 14"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></polyline>
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              ry="2"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></rect>
          </g>
        </svg>
        <span className="dock-label">Browse</span>
      </a>

      <a href="/collection" className="flex flex-col items-center">
        {/* Collection icon */}
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
            <circle
              cx="12"
              cy="12"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></circle>
            <path
              d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></path>
          </g>
        </svg>
        <span className="dock-label">My Collection</span>
      </a>

      <a href="/account" className="flex flex-col items-center">
        {/* Account icon */}
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
            <circle
              cx="12"
              cy="8"
              r="4"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></circle>
            <path
              d="M4 20c0-4 4-6 8-6s8 2 8 6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></path>
          </g>
        </svg>
        <span className="dock-label">Account</span>
      </a>
    </div>
  );
}

const AppLayout = ({ children }: Props) => {
  return (
    <div className="min-h-dvh flex flex-col pb-24">
      <SafeArea>
        <TopBar />
        {children}
        <BottomDock />
      </SafeArea>
    </div>
  );
};

export default AppLayout;
