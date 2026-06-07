"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { X, Heart, Info } from "lucide-react";
import { Usuario } from "@/lib/types";

interface SwipeCardProps {
  usuario: Usuario;
  onSwipe: (direction: "left" | "right", usuarioId: number) => void;
  isActive: boolean;
}

export default function SwipeCard({ usuario, onSwipe, isActive }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Visual indicators for swiping
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe("right", usuario.id_usuario);
    } else if (info.offset.x < -100) {
      onSwipe("left", usuario.id_usuario);
    }
  };

  const getProfileImage = () => {
    if (usuario.fotografias && usuario.fotografias.length > 0) {
      return usuario.fotografias[0].url_imagen;
    }
    // Placeholder if no photo
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre)}&size=400&background=random`;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      {isActive && (
        <motion.div
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-zinc-800 cursor-grab active:cursor-grabbing border border-zinc-700"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getProfileImage()})` }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Swipe Indicators */}
          <motion.div 
            style={{ opacity: likeOpacity }} 
            className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-bold text-4xl px-4 py-2 rounded-lg rotate-[-15deg] uppercase tracking-wider"
          >
            Like
          </motion.div>
          <motion.div 
            style={{ opacity: nopeOpacity }} 
            className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-bold text-4xl px-4 py-2 rounded-lg rotate-[15deg] uppercase tracking-wider"
          >
            Nope
          </motion.div>

          {/* Profile Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-baseline gap-2 mb-1">
              <h2 className="text-3xl font-bold">{usuario.nombre}</h2>
              <span className="text-xl font-medium text-zinc-300">{usuario.edad}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300 text-sm mb-4">
              <span className="bg-zinc-800/80 px-2 py-1 rounded-md">{usuario.nacionalidad}</span>
              <span className="bg-zinc-800/80 px-2 py-1 rounded-md">{usuario.ciudad_pais}</span>
            </div>
            
            {usuario.perfil?.biografia && (
              <p className="text-sm text-zinc-300 line-clamp-2 mb-4">
                {usuario.perfil.biografia}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onSwipe("left", usuario.id_usuario); }}
                className="w-14 h-14 bg-zinc-900 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 hover:bg-zinc-800 transition-colors shadow-lg"
              >
                <X size={24} strokeWidth={3} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); /* show full profile */ }}
                className="w-12 h-12 bg-zinc-900 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-500 hover:bg-zinc-800 transition-colors shadow-lg"
              >
                <Info size={20} strokeWidth={2.5} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onSwipe("right", usuario.id_usuario); }}
                className="w-14 h-14 bg-zinc-900 border border-green-500/30 rounded-full flex items-center justify-center text-green-500 hover:bg-zinc-800 transition-colors shadow-lg"
              >
                <Heart size={24} strokeWidth={3} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
