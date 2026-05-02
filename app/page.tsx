"use client";

import { useState, useRef, useEffect } from "react";

type RoleType = "user" | "bot" | "error";

interface Message {
  role: RoleType;
  text: string;
}

export default function ChatbotEducativo() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Bienvenido, nuevo corresponsal. Soy el redactor de **La Gaceta de la Razón**. Aquí no buscamos adornos, buscamos la luz del intelecto y la justicia. ¿Qué suceso de la Revolución necesitas analizar hoy para que el progreso no se detenga?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return (
        <span key={index}>
          {part.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i !== arr.length - 1 && <br />}
            </span>
          ))}
        </span>
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = messages
        .filter(m => m.role !== 'error')
        .map(m => ({
          role: m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));
      
      chatHistory.push({ role: 'user', parts: [{ text: trimmed }] });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) throw new Error("Fallo en la comunicación");

      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "error", text: "Noticias no encontradas temporalmente... El Comité reporta un bloqueo en los archivos." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#bcaf9d] flex items-center justify-center p-4 overflow-hidden select-none" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="bg-[#e8dfd1] w-full max-w-5xl h-full border border-[#bba387] shadow-2xl flex flex-col relative" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <header className="p-4 md:p-6 border-b-[5px] border-double border-[#1a1a1a] text-center bg-[#e8dfd1]">
          <div className="flex justify-between text-[8px] md:text-[10px] font-bold uppercase mb-2 tracking-[0.2em] border-b border-black pb-1">
            <span>Nº 427 — SERIE III</span>
            <span>¡IGUALDAD O MUERTE!</span>
            <span>PRECIO: 2 SOUS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter border-y-2 border-black py-2 mb-2" style={{ fontFamily: "'Times New Roman', serif" }}>
            La Gaceta de la Razón
          </h1>
          <div className="flex justify-between text-[10px] md:text-xs italic">
            <span>París, 14 de Julio de 1793</span>
            <span>Año II de la República Una e Indivisible</span>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <aside className="hidden md:block w-64 border-r border-black/20 p-4 bg-black/5 text-justify text-sm overflow-hidden">
            <h4 className="font-bold border-b border-black mb-3 uppercase text-center text-[10px] tracking-widest">Breves del Comité</h4>
            <div className="space-y-4 text-xs md:text-sm">
              <p><strong>L'AUTRICHIENNE:</strong> Informes sugieren que la prisionera Capeto será interrogada al amanecer en la Conciergerie.</p>
              <p><strong>EL PAN:</strong> El Comité de Subsistencia anuncia nuevas cartillas de racionamiento para la sección del Temple.</p>
              <div className="border-y-2 border-black py-3 my-4 text-center font-bold text-[11px] uppercase leading-tight">
                AVISO:<br/>Todo ciudadano debe portar su escarapela tricolor so pena de sospecha.
              </div>
              <p className="italic text-black/70">"La virtud sin la cual el terror es funesto; el terror sin el cual la virtud es impotente." — Robespierre</p>
            </div>
          </aside>

          <section className="flex-1 flex flex-col p-4 md:p-6 bg-white/10 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-6 flex flex-col hide-scrollbar px-2">
              {messages.map((msg, idx) => (
                <div key={idx} className={msg.role === 'user' ? "self-end max-w-[85%] text-right border-r-4 border-[#1a365d] pr-4 italic text-[#1a365d]" : "relative p-4 border-y border-black/10 bg-black/5"}>
                  {(msg.role === 'bot' || msg.role === 'error') && (
                    <div className="text-[10px] opacity-50 font-bold mb-2 tracking-widest uppercase">
                      {msg.role === 'error' ? 'Aviso de la imprenta' : 'Extracto de la Gaceta'}
                    </div>
                  )}
                  {msg.role === 'user' ? (
                    <p className="text-[15px] md:text-lg leading-snug">{formatText(msg.text)}</p>
                  ) : (
                    <p className={`text-[17px] md:text-xl leading-relaxed ${msg.role === 'error' ? 'text-red-800' : ''} first-letter:text-5xl md:first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#8d2323] first-letter:leading-none`}>
                      {formatText(msg.text)}
                    </p>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-[#8d2323] italic text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#8d2323] rounded-full animate-ping"></span> Imprimiendo nueva columna...
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </section>
        </main>

        <footer className="p-4 md:p-6 border-t-[5px] border-double border-[#1a1a1a] bg-black/5">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto border border-black/30 p-1 bg-white/20 shadow-inner">
            <div className="flex items-center gap-2 md:gap-4 bg-white/40 border border-black p-2">
              <span className="font-bold uppercase text-[10px] opacity-50 whitespace-nowrap hidden sm:inline">Tinta:</span>
              <input 
                type="text" 
                className="bg-transparent border-none flex-1 italic text-base md:text-lg outline-none min-w-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Redacte aquí sus observaciones para la República..." 
                autoComplete="off"
                disabled={isLoading}
              />
              <button disabled={isLoading} type="submit" className="bg-[#1a1a1a] text-[#e8dfd1] hover:bg-[#8d2323] px-4 md:px-6 py-2 uppercase text-[10px] md:text-xs font-bold tracking-widest shadow-[3px_3px_0px_rgba(0,0,0,0.3)] transition-all active:translate-y-1 active:translate-x-1 active:shadow-[1px_1px_0px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap">
                Estampar
              </button>
            </div>
          </form>
          <p className="text-[7px] md:text-[9px] text-center mt-3 opacity-60 uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold">
            "La Gaceta de la Razón: El único baluarte contra la tiranía y la ignorancia."
          </p>
        </footer>
      </div>
    </div>
  );
}
