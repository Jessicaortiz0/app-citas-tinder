"use client";

import { Matchs } from "@/lib/types";
import { MessageCircle } from "lucide-react";

interface MatchListProps {
  matches: Matchs[];
  onOpenChat: (matchId: number) => void;
}

export default function MatchList({ matches, onOpenChat }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4 px-6 text-center">
        <MessageCircle size={48} strokeWidth={1.5} className="text-zinc-700" />
        <h3 className="text-xl font-medium text-zinc-300">No matches yet</h3>
        <p>Keep swiping to find your perfect match!</p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto h-full pb-20">
      <h2 className="text-2xl font-bold text-white mb-6">Your Matches</h2>
      <div className="grid grid-cols-2 gap-4">
        {matches.map((match) => {
          const otherUser = match.usuario2;
          if (!otherUser) return null;

          const imageUrl = otherUser.fotografias?.[0]?.url_imagen || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.nombre)}&background=random`;

          return (
            <button
              key={match.id_match}
              onClick={() => onOpenChat(match.id_match)}
              className="flex flex-col relative aspect-[3/4] rounded-xl overflow-hidden group border border-zinc-800 transition-transform hover:scale-[1.02]"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3 text-left w-full">
                <span className="font-semibold text-white block truncate">{otherUser.nombre}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
