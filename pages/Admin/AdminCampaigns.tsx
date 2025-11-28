import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { DonationCampaign } from '../../types';

const AdminCampaigns = () => {
  const [campaign, setCampaign] = useState<DonationCampaign | null>(null);
  const [amountToAdd, setAmountToAdd] = useState('');

  useEffect(() => {
      setCampaign(dataService.getCampaign());
  }, []);

  const handleUpdate = () => {
      if (!amountToAdd) return;
      const val = parseInt(amountToAdd);
      const updated = dataService.updateCampaignAmount(val);
      setCampaign({...updated});
      setAmountToAdd('');
      
      // Feedback visuel
      alert(`Succès ! ${val.toLocaleString()} FCFA ajoutés manuellement au compteur.`);
  };

  if (!campaign) return <div>Chargement...</div>;

  const progress = (campaign.currentAmount / campaign.targetAmount) * 100;
  const remaining = campaign.targetAmount - campaign.currentAmount;

  const milestones = [
      { label: 'Fondations', threshold: 20, done: progress >= 20 },
      { label: 'Murs & Dalle', threshold: 50, done: progress >= 50 },
      { label: 'Toiture', threshold: 80, done: progress >= 80 },
      { label: 'Finitions', threshold: 100, done: progress >= 100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div>
            <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white tracking-tight">Projet École & Mosquée</h1>
                <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">En cours</span>
            </div>
            <p className="text-gray-500 text-sm">Les modifications ici sont visibles en temps réel sur la page d'accueil.</p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#1a1a1c] border border-gray-700 text-gray-300 font-bold rounded-lg text-sm hover:text-white transition flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Rapport PDF
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-[#121214] to-black border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-900/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-900/5 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                          <div>
                              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Fonds Collectés (Total)</p>
                              <div className="flex items-baseline gap-1">
                                  <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter">{campaign.currentAmount.toLocaleString()}</span>
                                  <span className="text-xl text-gray-500 font-medium">FCFA</span>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Objectif Cible</p>
                              <p className="text-xl font-bold text-gray-400">{campaign.targetAmount.toLocaleString()} <span className="text-sm">FCFA</span></p>
                          </div>
                      </div>

                      <div className="mb-8">
                          <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
                              <span>Démarrage</span>
                              <span className="text-brand-500">{progress.toFixed(1)}% Financé</span>
                              <span>Livraison</span>
                          </div>
                          <div className="w-full h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
                                <div 
                                    className="h-full bg-gradient-to-r from-brand-700 via-brand-500 to-yellow-500 relative shadow-[0_0_20px_rgba(234,88,12,0.5)] transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50"></div>
                                </div>
                                {milestones.map(m => (
                                    <div key={m.label} className="absolute top-0 bottom-0 w-0.5 bg-gray-800 z-10" style={{ left: `${m.threshold}%` }}></div>
                                ))}
                          </div>
                          
                          <div className="flex justify-between mt-3 px-1">
                              {milestones.map((m, idx) => (
                                  <div key={idx} className={`flex flex-col items-center ${m.done ? 'text-green-500' : 'text-gray-600'}`}>
                                      <div className={`w-3 h-3 rounded-full mb-1 border-2 ${m.done ? 'bg-green-500 border-green-500' : 'bg-black border-gray-700'}`}></div>
                                      <span className="text-[10px] uppercase font-bold tracking-wider hidden sm:block">{m.label}</span>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800/50">
                           <div className="bg-black/40 rounded-xl p-4 border border-gray-800 backdrop-blur-sm">
                               <div className="text-red-400 text-xs font-bold uppercase tracking-wide mb-1">Manquant</div>
                               <div className="text-xl font-bold text-white">{remaining.toLocaleString()} <span className="text-xs font-normal text-gray-500">F</span></div>
                           </div>
                           <div className="bg-black/40 rounded-xl p-4 border border-gray-800 backdrop-blur-sm">
                               <div className="text-blue-400 text-xs font-bold uppercase tracking-wide mb-1">Donateurs</div>
                               <div className="text-xl font-bold text-white">{(1245 + Math.floor(campaign.currentAmount / 10000)).toLocaleString()} <span className="text-xs font-normal text-gray-500">Pers.</span></div>
                           </div>
                           <div className="bg-black/40 rounded-xl p-4 border border-gray-800 backdrop-blur-sm">
                               <div className="text-purple-400 text-xs font-bold uppercase tracking-wide mb-1">Image</div>
                               <div className="text-xs font-bold text-white truncate max-w-[100px]">{campaign.imageUrl.substring(0, 20)}...</div>
                           </div>
                      </div>
                  </div>
              </div>

              <div className="bg-[#121214] border border-gray-800 rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Indicateurs de Confiance (Affichés au public)</h3>
                  </div>
                  
                  <div className="space-y-5">
                      {campaign.trustIndicators.map((item, idx) => (
                          <div key={idx} className="group">
                              <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center gap-3">
                                      <span className="text-2xl bg-gray-900 p-2 rounded-lg border border-gray-800">{item.icon}</span>
                                      <div>
                                          <h4 className="text-white font-bold text-sm">{item.title}</h4>
                                          <p className="text-gray-500 text-xs">{item.text}</p>
                                      </div>
                                  </div>
                              </div>
                              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-gray-700 h-full rounded-full w-3/4 group-hover:bg-brand-600 transition-colors"></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-[#1a1a1c] border border-gray-700 rounded-2xl p-1 shadow-2xl">
                  <div className="bg-black rounded-xl p-6 border border-gray-800 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-yellow-500"></div>
                      
                      <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Terminal de Saisie
                      </h3>
                      <p className="text-xs text-gray-500 mb-6">Ajouter un don manuel (Espèces/Chèque).</p>
                      
                      <div className="space-y-4">
                          <div className="relative">
                              <span className="absolute left-4 top-4 text-gray-500 font-bold">FCFA</span>
                              <input 
                                type="number" 
                                placeholder="0" 
                                className="w-full bg-[#121214] border border-gray-700 rounded-xl py-4 pl-14 pr-4 text-white font-mono text-2xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-right"
                                value={amountToAdd}
                                onChange={(e) => setAmountToAdd(e.target.value)}
                              />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                              {[5000, 10000, 50000].map(v => (
                                  <button 
                                    key={v}
                                    onClick={() => setAmountToAdd(v.toString())}
                                    className="py-2 bg-gray-900 text-gray-400 text-xs font-bold rounded hover:bg-gray-800 hover:text-white transition border border-gray-800"
                                  >
                                      +{v/1000}k
                                  </button>
                              ))}
                          </div>

                          <button 
                            onClick={handleUpdate}
                            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold py-4 rounded-xl transition transform active:scale-95 shadow-lg hover:shadow-brand-900/30 flex justify-center items-center gap-2 uppercase tracking-widest text-sm"
                          >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                              Encaisser
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AdminCampaigns;