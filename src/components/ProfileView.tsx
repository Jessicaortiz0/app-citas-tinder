"use client";

import { Usuario } from "@/lib/types";
import { LogOut, Settings, Edit3 } from "lucide-react";

interface ProfileViewProps {
  usuario: Usuario;
  onLogout: () => void;
}

export default function ProfileView({ usuario, onLogout }: ProfileViewProps) {
  const imageUrl = usuario.fotografias?.[0]?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre)}&background=random`;

  return (
    <div className="p-6 h-full overflow-y-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Settings size={24} />
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4 group cursor-pointer">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800 shadow-xl">
            <img src={imageUrl} alt={usuario.nombre} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Edit3 className="text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white">{usuario.nombre}, {usuario.edad}</h3>
        <p className="text-zinc-400">{usuario.ciudad_pais}</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">About Me</h4>
        <p className="text-zinc-300 whitespace-pre-wrap">
          {usuario.perfil?.biografia || "No bio yet. Add one to get more matches!"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-rose-500 mb-1">24</span>
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Matches</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-blue-500 mb-1">12</span>
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Likes</span>
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full bg-zinc-900 border border-zinc-800 text-rose-500 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
      >
        <LogOut size={20} />
        Log Out
      </button>
    </div>
  );
}
