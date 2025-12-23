
import React, { useState, useRef, useEffect } from 'react';
import { getRakshakResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Namaste! I am **Rakshak**, your safety guardian. I've automatically synced with your GPS to provide precise local help. How can I protect you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address?: string } | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  // PROACTIVE LOCATION DETECTION
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`);
          const data = await res.json();
          const addr = data.display_name.split(',').slice(0, 3).join(',');
          setUserLocation({ lat: latitude, lng: longitude, address: addr });
        } catch (e) { 
          setUserLocation({ lat: latitude, lng: longitude, address: 'Location Synced' });
        }
      }, (err) => {
        console.warn("Bot location access denied", err);
      }, { enableHighAccuracy: true });
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const renderContent = (text: string) => {
    // Handle Markdown bold and potentially links from grounding
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-black text-indigo-700 bg-indigo-50/50 px-1.5 py-0.5 rounded-md">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('[') && part.includes('](')) {
        const title = part.match(/\[(.*?)\]/)?.[1];
        const url = part.match(/\((.*?)\)/)?.[1];
        return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline hover:text-indigo-800 ml-1">{title}</a>;
      }
      return part;
    });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await getRakshakResponse(userMsg, userLocation);
    setMessages(prev => [...prev, { role: 'bot', content: response || "System busy. Use SOS for immediate help." }]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[82vh] bg-white rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="bg-slate-900 px-10 py-8 flex items-center justify-between text-white border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center border border-indigo-400 shadow-2xl">
            <i className="fas fa-robot text-2xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight leading-none mb-2">Rakshak AI</h2>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Guardian Network Online</span>
            </div>
          </div>
        </div>
        {userLocation && (
          <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] font-bold text-white/70 max-w-[320px]">
            <i className="fas fa-location-crosshairs text-indigo-400"></i>
            <span className="truncate">{userLocation.address || "GPS Pulse Active"}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/20 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-8 py-6 text-[15px] leading-relaxed shadow-sm transition-all hover:shadow-md ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white font-bold rounded-[2.5rem] rounded-tr-none' 
                : 'glass-card bg-white border-slate-100 text-slate-700 font-medium rounded-[2.5rem] rounded-tl-none whitespace-pre-wrap'
            }`}>
              {msg.role === 'bot' ? renderContent(msg.content) : msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-card bg-white rounded-[2rem] rounded-tl-none px-8 py-5 flex gap-2.5 items-center h-14">
              <span className="w-2 h-2 rounded-full bg-indigo-200 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-150"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-300"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-10 bg-white border-t border-slate-100">
        <div className="flex gap-5">
          <input
            type="text"
            placeholder="Ask about nearby police, safe routes, or legal aid..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-1 px-10 py-6 bg-slate-50 border-2 border-slate-100 rounded-[3rem] focus:border-indigo-500 focus:bg-white outline-none text-slate-900 font-bold text-base shadow-inner transition-all placeholder:text-slate-300"
          />
          <button 
            type="submit"
            disabled={isTyping || !input.trim()}
            className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)] hover:bg-indigo-600 transition-all flex items-center justify-center disabled:opacity-20 active:scale-90 group"
          >
            <i className={`fas ${isTyping ? 'fa-circle-notch fa-spin' : 'fa-paper-plane-top'} text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`}></i>
          </button>
        </div>
        <p className="mt-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <i className="fas fa-shield-halved mr-2"></i>
           Encrypted conversation between you and Rakshak
        </p>
      </form>
    </div>
  );
};

export default ChatBot;
