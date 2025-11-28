
import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';

const AdminSettings = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [flashMsg, setFlashMsg] = useState('');
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
      const s = dataService.getSettings();
      setMaintenance(s.maintenanceMode);
      setFlashMsg(s.flashMessage);
      setFlashActive(s.flashActive);
  }, []);

  const toggleMaintenance = () => {
      const newState = !maintenance;
      setMaintenance(newState);
      dataService.updateSettings({ maintenanceMode: newState });
  };

  const saveFlash = () => {
      dataService.updateSettings({ flashMessage: flashMsg, flashActive: flashActive });
      alert("Flash Info mis à jour !");
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
       <div className="border-b border-gray-800 pb-6">
            <h1 className="text-3xl font-bold text-white">Paramètres & Alertes</h1>
            <p className="text-gray-500 mt-1">Configuration technique et communication d'urgence.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FLASH INFO */}
            <div className="bg-[#121214] p-8 rounded-2xl border border-gray-800 lg:col-span-2">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <span className="text-brand-500">📢</span> Flash Info (Bandeau Défilant)
                </h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message d'alerte</label>
                        <input 
                            type="text" 
                            value={flashMsg} 
                            onChange={(e) => setFlashMsg(e.target.value)}
                            placeholder="Ex: Débat Live ce soir à 20h..." 
                            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none" 
                        />
                    </div>
                    <div className="flex items-center gap-3 pb-2">
                        <input 
                            type="checkbox" 
                            id="flashActive" 
                            checked={flashActive}
                            onChange={(e) => setFlashActive(e.target.checked)}
                            className="w-5 h-5 accent-brand-500"
                        />
                        <label htmlFor="flashActive" className="text-white text-sm font-bold select-none cursor-pointer">Activer sur l'accueil</label>
                    </div>
                    <button onClick={saveFlash} className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition">
                        Enregistrer
                    </button>
                </div>
                {flashActive && (
                    <div className="mt-4 p-3 bg-brand-900/20 border border-brand-500/30 text-brand-500 text-xs font-mono rounded">
                        APERÇU: 🔴 FLASH: {flashMsg}
                    </div>
                )}
            </div>

            <div className="bg-[#121214] p-8 rounded-2xl border border-gray-800">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <span className="text-brand-500">⚙️</span> Infos Système
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Version</label>
                        <input type="text" value="v2.4.0 (Production)" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-gray-400" readOnly />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Serveur</label>
                        <div className="flex items-center gap-2 p-3 bg-black border border-gray-700 rounded-lg">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-white text-sm">Opérationnel</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`border p-8 rounded-2xl flex flex-col justify-between transition-colors ${maintenance ? 'bg-red-900/20 border-red-500' : 'bg-gray-900/20 border-gray-800'}`}>
                <div>
                    <h3 className={`font-bold mb-1 flex items-center gap-2 ${maintenance ? 'text-red-500' : 'text-white'}`}>
                        {maintenance ? '⛔ SITE VERROUILLÉ' : '✅ SITE EN LIGNE'}
                    </h3>
                    <p className="text-xs text-gray-500 mb-6">
                        Le mode maintenance redirige tous les visiteurs vers une page d'attente. L'admin reste accessible.
                    </p>
                </div>
                <button 
                    onClick={toggleMaintenance}
                    className={`w-full px-6 py-4 font-bold rounded-xl transition shadow-lg flex justify-center items-center gap-2 ${maintenance ? 'bg-white text-red-600 hover:bg-gray-200' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                    {maintenance ? 'DÉSACTIVER MAINTENANCE' : 'ACTIVER MAINTENANCE'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default AdminSettings;