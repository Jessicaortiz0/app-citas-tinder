"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState(""); // Only for signup
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (isSignUp && !nombre.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // Sign up with Supabase
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (data.user) {
          // Sync with Prisma via our custom API route
          const res = await fetch("/api/usuarios/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              email, 
              nombre, 
              authId: data.user.id 
            }),
          });

          if (!res.ok) {
            console.error("Error syncing with Prisma");
            // Still log them in for MVP, but display a warning
          }

          onLogin();
        }
      } else {
        // Log in with Supabase
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;
        
        if (data.user) {
          onLogin(); // Tell page.tsx to fetch the user
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <div className="bg-gradient-to-tr from-rose-600 to-orange-500 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(225,29,72,0.4)]">
          <Flame size={48} className="text-white" strokeWidth={2.5} />
        </div>
        
        <h1 className="text-4xl font-black mb-2 tracking-tight">Ignite</h1>
        <p className="text-zinc-400 mb-8">{isSignUp ? "Create an account to start matching" : "Match. Chat. Date."}</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {isSignUp && (
            <div>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                disabled={isLoading}
              />
            </div>
          )}
          
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              disabled={isLoading}
            />
          </div>
          
          {error && <p className="text-rose-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password.trim()}
            className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl px-6 py-4 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 text-lg"
          >
            {isLoading ? "Connecting..." : isSignUp ? "Create Account" : "Log In"}
          </button>
        </form>

        <button 
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
          }}
          className="mt-6 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
