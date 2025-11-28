
import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Appointment } from '../../types';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<'contact' | 'debate'>('contact');

  useEffect(() => {
      // Charger les RDV et rafraichir toutes les 2s pour voir les nouvelles demandes en temps réel
      const load = () => setAppointments(dataService.getAppointments());
      load();
      const interval = setInterval(load, 2000);
      return () => clearInterval(interval);
  }, []);

  const handleStatus = (id: string, status: 'confirmed' | 'rejected' | 'pending') => {
      const updated = dataService.updateAppointmentStatus(id, status);
      setAppointments(updated);
  };

  const handleDelete = (id: string) => {
      if(confirm("Supprimer définitivement ?")) {
          const updated = dataService.deleteAppointment(id);
          setAppointments(updated);
      }
  };

  // Filtrer selon l'onglet
  const filteredList = appointments.filter(a => {
      if (tab === 'contact') return !a.type || a.type === 'contact';
      if (tab === 'debate') return a.type === 'debate_challenge';
      return true;
  });

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-white">Gestion des Demandes</h1>
            <p className="text-gray-500 mt-1">Centralisation des RDV et des Défis.</p>
        </div>
        
        {/* TABS */}
        <div className="flex bg-black p-1 rounded-lg border border-gray-800">
            <button 
                onClick={() => setTab('contact')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition ${tab === 'contact' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                RDV Classiques
            </button>
            <button 
                onClick={() => setTab('debate')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${tab === 'debate' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                <span>⚔️</span> Défis / Arène
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
               {filteredList.map((apt) => (
                   <div key={apt.id} className={`bg-[#121214] border rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition relative group ${apt.type === 'debate_challenge' ? 'border-red-900/30 hover:border-red-600/50' : 'border-gray-800 hover:border-gray-700'}`}>
                       <div className={`w-1 rounded-full self-stretch ${apt.status === 'confirmed' ? 'bg-green-500' : apt.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                       
                       <div className="flex-1">
                           <div className="flex justify-between items-start mb-2">
                               <div>
                                   <h3 className="text-xl font-bold text-white">{apt.name}</h3>
                                   <p className="text-gray-400 font-mono text-sm">{apt.phone}</p>
                               </div>
                               <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                                   apt.status === 'confirmed' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                                   apt.status === 'pending' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10' :
                                   'border-red-500/30 text-red-500 bg-red-500/10'
                               }`}>
                                   {apt.status === 'pending' ? 'En Attente' : apt.status}
                               </span>
                           </div>
                           
                           {/* Affichage spécifique selon le type */}
                           {apt.type === 'debate_challenge' ? (
                               <div className="bg-red-900/10 p-4 rounded-lg border border-red-900/30 mb-4">
                                   <div className="flex items-center gap-2 mb-2">
                                       <span className="text-red-500 font-bold text-xs uppercase tracking-widest">VS</span>
                                       <span className="text-white font-bold">{apt.opponentName}</span>
                                   </div>
                                   <p className="text-lg font-serif text-gray-200 mb-2">"{apt.topic}"</p>
                                   <p className="text-gray-400 text-sm italic">{apt.message}</p>
                               </div>
                           ) : (
                               <div className="bg-black/50 p-3 rounded-lg border border-gray-800 mb-4">
                                   <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{apt.subject}</p>
                                   <p className="text-gray-300 text-sm leading-relaxed">{apt.message}</p>
                               </div>
                           )}

                           <div className="flex items-center gap-2 text-xs text-gray-500">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                               Souhaité le : {apt.requestedDate || 'Non précisé'} | Reçu le : {apt.createdAt}
                           </div>
                       </div>

                       <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                           {apt.status === 'pending' && (
                               <>
                                <button onClick={() => handleStatus(apt.id, 'confirmed')} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded uppercase transition">
                                    Valider
                                </button>
                                <button onClick={() => handleStatus(apt.id, 'rejected')} className="flex-1 px-4 py-2 bg-red-900/50 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold rounded uppercase transition">
                                    Rejeter
                                </button>
                               </>
                           )}
                           <a href={`tel:${apt.phone}`} className="flex-1 px-4 py-2 bg-black border border-gray-700 hover:border-white text-white text-xs font-bold rounded uppercase transition text-center flex items-center justify-center gap-2">
                               Appeler
                           </a>
                           <button onClick={() => handleDelete(apt.id)} className="text-xs text-gray-600 hover:text-red-500 mt-2">Archiver</button>
                       </div>
                   </div>
               ))}
               
               {filteredList.length === 0 && (
                   <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl">
                       <p className="text-gray-500 font-medium">Aucune demande pour le moment.</p>
                   </div>
               )}
          </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
