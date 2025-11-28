import React, { useState, useRef } from 'react';
import { LiveClient } from '../services/geminiService';

const LiveAssistant = () => {
  const [active, setActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const clientRef = useRef<LiveClient | null>(null);

  const toggleSession = async () => {
    if (active) {
        clientRef.current?.disconnect();
        setActive(false);
        setTranscript('');
    } else {
        setConnecting(true);
        try {
            const client = new LiveClient((text) => {
                setTranscript(text);
            });
            await client.connect();
            clientRef.current = client;
            setActive(true);
        } catch (e) {
            console.error(e);
            alert("Impossible de connecter l'assistant vocal. Vérifiez les permissions micro.");
        } finally {
            setConnecting(false);
        }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
        {/* Interface Chat Flottante */}
        {active && (
            <div className="mb-4 bg-black/90 backdrop-blur-xl border border-brand-500 p-6 rounded-2xl shadow-[0_0_40px_rgba(234,88,12,0.4)] max-w-sm w-80 animate-fade-in-up relative overflow-hidden">
                {/* Visualizer Simulation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent animate-[shimmer_2s_infinite_linear]"></div>
                
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="font-bold text-white text-sm tracking-wide">Compagnon DDR</span>
                    </div>
                    <div className="flex gap-1 items-end h-4">
                        <div className="w-1 bg-brand-500 h-2 animate-[bounce_1s_infinite]"></div>
                        <div className="w-1 bg-brand-500 h-4 animate-[bounce_1.2s_infinite]"></div>
                        <div className="w-1 bg-brand-500 h-3 animate-[bounce_0.8s_infinite]"></div>
                    </div>
                </div>
                
                <div className="h-24 bg-[#121212] rounded-lg p-3 overflow-y-auto text-sm text-gray-300 italic border border-gray-800 leading-relaxed scrollbar-thin">
                    "{transcript || "Je vous écoute mon frère... Posez votre question."}"
                </div>
                
                <div className="mt-2 text-[10px] text-gray-600 text-center uppercase tracking-widest">
                    IA Vocale Connectée
                </div>
            </div>
        )}

        {/* Bouton Principal */}
        <button
            onClick={toggleSession}
            disabled={connecting}
            className={`group flex items-center justify-center gap-3 px-6 py-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all transform hover:scale-105 border-2 ${
                active 
                ? 'bg-red-600 text-white border-red-500 hover:bg-red-700' 
                : 'bg-[#0a0a0a] text-white border-brand-600 hover:bg-brand-900/30'
            }`}
        >
            {connecting ? (
                 <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
            ) : (
                <>
                     {active ? (
                         <>
                            <span className="font-bold tracking-wide">Raccrocher</span>
                            <div className="bg-white text-red-600 rounded-full p-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/></svg>
                            </div>
                         </>
                     ) : (
                         <>
                            <div className="relative">
                                <span className="absolute -inset-1 rounded-full bg-brand-500 opacity-20 group-hover:animate-ping"></span>
                                <svg className="w-6 h-6 text-brand-500 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wider group-hover:text-brand-500 transition-colors">Vocal</span>
                         </>
                     )}
                </>
            )}
        </button>
    </div>
  );
};

export default LiveAssistant;