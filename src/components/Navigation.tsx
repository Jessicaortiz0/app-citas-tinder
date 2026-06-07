"use client";

import { Flame, MessageCircle, User } from "lucide-react";

interface NavigationProps {
  currentTab: "discover" | "matches" | "profile";
  setTab: (tab: "discover" | "matches" | "profile") => void;
}

export default function Navigation({ currentTab, setTab }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button
          onClick={() => setTab("discover")}
          className={`p-3 rounded-full transition-colors ${
            currentTab === "discover" ? "text-rose-500" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Flame size={28} strokeWidth={currentTab === "discover" ? 2.5 : 2} />
        </button>
        <button
          onClick={() => setTab("matches")}
          className={`p-3 rounded-full transition-colors ${
            currentTab === "matches" ? "text-rose-500" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <MessageCircle size={28} strokeWidth={currentTab === "matches" ? 2.5 : 2} />
        </button>
        <button
          onClick={() => setTab("profile")}
          className={`p-3 rounded-full transition-colors ${
            currentTab === "profile" ? "text-rose-500" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <User size={28} strokeWidth={currentTab === "profile" ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
}
