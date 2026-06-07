"use client";

import { useState } from "react";
import { ChevronLeft, Send } from "lucide-react";
import { ChatMessage, Matchs } from "@/lib/types";

interface ChatBoxProps {
  match: Matchs;
  onBack: () => void;
}

export default function ChatBox({ match, onBack }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const otherUser = match.usuario2;
  if (!otherUser) return null;

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    // Optimistically add message
    const msg: ChatMessage = {
      id_chat: Date.now(),
      id_match: match.id_match,
      mensaje: newMessage,
      leido: false,
    };
    
    setMessages([...messages, msg]);
    setNewMessage("");
    
    // In a real app, send to API here
  };

  const imageUrl = otherUser.fotografias?.[0]?.url_imagen || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.nombre)}&background=random`;

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-950">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft size={28} />
        </button>
        <div className="flex items-center gap-3">
          <img src={imageUrl} alt={otherUser.nombre} className="w-10 h-10 rounded-full border border-zinc-700 object-cover" />
          <h2 className="font-bold text-lg text-white">{otherUser.nombre}</h2>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 mt-10">
            <p>You matched with {otherUser.nombre}!</p>
            <p className="text-sm mt-2">Say hi to start the conversation.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id_chat} className="flex justify-end">
            <div className="bg-rose-600 text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%] break-words">
              {msg.mensaje}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900 pb-8">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-rose-500 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
