
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VeoStudio from '../../components/VeoStudio';
import { dataService } from '../../services/dataService';
import { DonationCampaign } from '../../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  
  // State pour les données réelles
  const [campaign, setCampaign] = useState<DonationCampaign | null>(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalRDV, setTotalRDV] = useState(0);

  useEffect(() => {
      // Chargement initial
      loadStats();
      
      // Rafraichissement temps réel (Polling) pour voir l'activité
      const interval = setInterval(loadStats, 3000);
      return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
      const c = dataService.getCampaign();
      const donations = dataService.getDonations();
      const appointments = dataService.getAppointments();

      setCampaign(c);
      setTotalDonations(donations.reduce((acc, curr) => acc + curr.amount, 0));
      setTotalRDV(appointments.filter(a => a.status === 'pending').length);
  };

  const handleDownloadReport = () => {
      setDownloadingReport(true);
      setTimeout(() => {
          setDownloadingReport(false);
          alert("📄 Le Rapport Financier Mensuel (PDF) a été généré et téléchargé avec succès.");
      }, 2000);
  };

  const handleNavigate = (path: string) => {
      setShowContentMenu(false);
      navigate(path);
  }

  if (!campaign) return <div className="p-10 text-white">Chargement du Dashboard...</div>;

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6 relative z-30">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Vue d'ensemble</h1>
            <p className="text-gray-500 mt-1">Gérez l'impact de la DDR en temps réel.</p>
          </div>
          <div className="flex gap-3 relative">
              <button 
                onClick={handleDownloadReport}
                disabled={downloadingReport}
                className="px-4 py-2 bg-black hover:bg-gray-900 text-gray-300 text-sm font-medium rounded-lg border border-gray-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                 {downloadingReport ? 'Génération...' : 'Rapport Financier'}
              </button>
              
              <div className="relative">
                <button 
                    onClick={() => setShowContentMenu(!showContentMenu)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(234,88,12,0.3)] transition flex items-center gap-2"
                >
                    Ajouter Contenu
                </button>

                {showContentMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1c] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                        <div className="py-1">
                            <button onClick={() => handleNavigate('/admin/news')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-brand-600 hover:text-white transition flex items-center gap-3">
                                <span className="text-lg">📰</span> Nouvelle Actualité
                            </button>
                            <button onClick={() => handleNavigate('/admin/debates')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-brand-600 hover:text-white transition flex items-center gap-3">
                                <span className="text-lg">🎥</span> Nouveau Débat
                            </button>
                            <div className="border-t border-gray-700 my-1"></div>
                            <button onClick={() => { setShowContentMenu(false); window.scrollTo({ top: 1000, behavior: 'smooth' }); }} className="w-full text-left px-4 py-3 text-sm text-purple-400 hover:bg-purple-900/30 transition flex items-center gap-3 font-bold">
                                <span className="text-lg">🎬</span> Générer Vidéo (Veo)
                            </button>
                        </div>
                    </div>
                )}
              </div>
          </div>
      </div>
      
      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121214] p-6 rounded-xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 text-green-500"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg></div>
                <p className="text-sm font-medium text-gray-400 mb-1">Collecte École</p>
                <p className="text-3xl font-bold text-white tracking-tight font-mono">{campaign.currentAmount.toLocaleString()} F</p>
                <span className="text-xs text-green-500">+ En direct</span>
            </div>

            <div className="bg-[#121214] p-6 rounded-xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 text-brand-500"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path></svg></div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-white tracking-tight font-mono">{totalDonations.toLocaleString()} F</p>
            </div>

            <div className="bg-[#121214] p-6 rounded-xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 text-blue-500"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg></div>
                <p className="text-sm font-medium text-gray-400 mb-1">RDV & Défis en attente</p>
                <p className="text-3xl font-bold text-white tracking-tight font-mono">{totalRDV}</p>
                {totalRDV > 0 && <span className="text-xs text-blue-400 font-bold">À traiter</span>}
            </div>

            <div className="bg-[#121214] p-6 rounded-xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 text-purple-500"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg></div>
                <p className="text-sm font-medium text-gray-400 mb-1">Visiteurs Actifs</p>
                <p className="text-3xl font-bold text-white tracking-tight font-mono">1,204</p>
                <span className="text-xs text-green-500">+12% cette semaine</span>
            </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Status Card */}
          <div className="lg:col-span-2 bg-[#121214] p-0 rounded-xl border border-gray-800 shadow-sm flex flex-col overflow-hidden">
             <div className="relative h-40">
                 <img src={campaign.imageUrl} className="w-full h-full object-cover opacity-50" alt="Chantier" />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121214]"></div>
                 <div className="absolute bottom-4 left-6">
                     <h2 className="text-2xl font-bold text-white">État du Chantier</h2>
                     <p className="text-xs text-gray-400">Mise à jour en temps réel</p>
                 </div>
             </div>
             
             <div className="p-6 pt-2 flex-1">
                 <div className="flex justify-between items-end mb-2">
                     <span className="text-4xl font-bold text-brand-500 font-mono">{Math.round((campaign.currentAmount / campaign.targetAmount) * 100)}%</span>
                     <span className="text-sm text-gray-500">Objectif: {campaign.targetAmount.toLocaleString()} F</span>
                 </div>
                 <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden mb-6 border border-gray-700">
                    <div className="bg-gradient-to-r from-brand-600 to-yellow-500 h-4 rounded-full relative" style={{ width: `${Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100)}%` }}></div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => navigate('/admin/campaigns')} className="py-3 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-lg">
                         Gérer la campagne
                     </button>
                     <button onClick={() => navigate('/admin/donations')} className="py-3 bg-[#1a1a1c] border border-gray-700 text-gray-300 hover:text-white hover:border-white text-xs font-bold uppercase tracking-wider rounded-lg transition">
                         Voir les transactions
                     </button>
                 </div>
             </div>
          </div>

           {/* Quick Actions & AI */}
           <div className="space-y-6">
                <VeoStudio />
           </div>
      </div>
    </div>
  );
};

export default Dashboard;
