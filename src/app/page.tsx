"use client";

import { useEffect, useState } from "react";
import Login from "@/components/Login";
import SwipeCard from "@/components/SwipeCard";
import Navigation from "@/components/Navigation";
import MatchList from "@/components/MatchList";
import ProfileView from "@/components/ProfileView";
import ChatBox from "@/components/ChatBox";
import { Usuario, Matchs } from "@/lib/types";

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [currentTab, setCurrentTab] = useState<"discover" | "matches" | "profile">("discover");
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const [potentialMatches, setPotentialMatches] = useState<Usuario[]>([]);
  const [matches, setMatches] = useState<Matchs[]>([]);

  useEffect(() => {
    setMounted(true);
    // Load logged-in user from localStorage
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUsuario(parsed);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      fetchPotentialMatches();
      fetchMatches();
    }
  }, [usuario]);

  const fetchPotentialMatches = async () => {
    try {
      const res = await fetch(`/api/usuarios?id=${usuario?.id_usuario}`);
      if (res.ok) {
        const data = await res.json();
        setPotentialMatches(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch(`/api/matchs?id=${usuario?.id_usuario}`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginSuccess = (user: Usuario) => {
    localStorage.setItem("usuario", JSON.stringify(user));
    setUsuario(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  const handleSwipe = async (direction: "left" | "right", targetId: number) => {
    setPotentialMatches(prev => prev.filter(u => u.id_usuario !== targetId));

    if (direction === "right") {
      try {
        const res = await fetch("/api/matchs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: usuario?.id_usuario,
            targetId,
          }),
        });
        
        if (res.ok) {
          const { isMatch, newMatch } = await res.json();
          if (isMatch && newMatch) {
            setMatches(prev => [...prev, newMatch]);
            alert("It's a Match!");
          }
        }
      } catch (e) {
        console.error("Error logging match", e);
      }
    }
  };

  if (!mounted) return <div className="min-h-screen bg-zinc-950" />;

  if (!usuario) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  if (activeChat) {
    const activeMatch = matches.find(m => m.id_match === activeChat);
    if (activeMatch) {
      return <ChatBox match={activeMatch} onBack={() => setActiveChat(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex justify-center">
      <div className="w-full max-w-md bg-zinc-950 relative overflow-hidden flex flex-col h-[100dvh]">
        
        <main className="flex-1 relative overflow-hidden">
          {currentTab === "discover" && (
            <div className="h-full relative flex items-center justify-center p-4">
              {potentialMatches.length > 0 ? (
                [...potentialMatches].reverse().map((pMatch, index, arr) => (
                  <SwipeCard
                    key={pMatch.id_usuario}
                    usuario={pMatch}
                    onSwipe={handleSwipe}
                    isActive={index === arr.length - 1}
                  />
                ))
              ) : (
                <div className="text-center text-zinc-500">
                  <div className="w-20 h-20 rounded-full border-2 border-zinc-800 border-t-rose-500 animate-spin mx-auto mb-4" />
                  <p>Finding people near you...</p>
                </div>
              )}
            </div>
          )}

          {currentTab === "matches" && (
            <MatchList matches={matches} onOpenChat={setActiveChat} />
          )}

          {currentTab === "profile" && (
            <ProfileView usuario={usuario} onLogout={handleLogout} />
          )}
        </main>

        <Navigation currentTab={currentTab} setTab={setCurrentTab} />
      </div>
    </div>
  );
}