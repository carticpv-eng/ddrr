import React from 'react';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/20 via-black to-black"></div>
        
        <div className="relative z-10 max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto bg-brand-900/30 border border-brand-500/50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <svg className="w-12 h-12 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            
            <h1 className="text-4xl font-extrabold text-white mb-4">Site en Maintenance</h1>
            <p className="text-gray-400 text-lg mb-8">
                Nous effectuons actuellement des mises à jour importantes pour améliorer votre expérience.
                <br/><br/>
                <span className="text-brand-500 font-bold">Retour estimé : Quelques heures.</span>
            </p>
            
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-8">
                <div className="bg-brand-500 h-1.5 rounded-full w-1/3 animate-[shimmer_2s_infinite_linear]"></div>
            </div>

            <a href="/#/admin/login" className="text-xs text-gray-600 hover:text-white transition">Accès Staff</a>
        </div>
    </div>
  );
};

export default Maintenance;