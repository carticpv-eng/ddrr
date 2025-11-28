
import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { Appointment } from '../types';
import { Link } from 'react-router-dom';

const DebateRequest = () => {
  const [formData, setFormData] = useState({
    challengerName: '',
    challengerPhone: '',
    opponent: 'Oustaz Diane',
    topic: '',
    date: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Création de l'objet Défi (qui est un type d'Appointment)
    const newChallenge: Appointment = {
        id: Date.now().toString(),
        type: 'debate_challenge',
        name: formData.challengerName,
        phone: formData.challengerPhone,
        subject: 'Défi Débat',
        opponentName: formData.opponent,
        topic: formData.topic,
        requestedDate: formData.date,
        message: formData.message,
        status: 'pending',
        createdAt: new Date().toLocaleDateString()
    };

    // Sauvegarde réelle dans le dataService pour affichage Admin
    setTimeout(() => {
        dataService.addAppointment(newChallenge);
        setLoading(false);
        setSubmitted(true);
        window.scrollTo(0, 0);
    }, 1500);
  };

  if (submitted) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-black border border-red-900/50 text-white p-12 rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.2)] text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold mb-4 text-red-500 uppercase tracking-tighter">Défi Lancé !</h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Votre demande de confrontation a été enregistrée dans l'Arène.
                        <br/>L'équipe DDR analysera votre proposition sur le thème : <br/><strong className="text-white">"{formData.topic}"</strong>.
                    </p>
                    <Link to="/" className="w-full block py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition shadow-lg">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden selection:bg-red-600 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black"></div>
      
      <div className="max-w-4xl mx-auto py-20 px-4 relative z-10">
          <div className="text-center mb-16">
              <span className="bg-red-900/30 text-red-500 border border-red-900/50 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.3em]">Espace Contradictoire</span>
              <h1 className="text-5xl md:text-7xl font-black text-white mt-6 tracking-tighter uppercase italic">
                  L'Arène du <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Débat</span>
              </h1>
              <p className="text-gray-500 mt-6 text-xl max-w-2xl mx-auto">
                  Vous êtes Pasteur, Prêtre, Libre-penseur ? Vous souhaitez confronter vos arguments à ceux de la DDR ? La tribune est ouverte.
              </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Votre Nom & Titre</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Pasteur Jean-Marc"
                        className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                        value={formData.challengerName}
                        onChange={e => setFormData({...formData, challengerName: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contact (Téléphone)</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="Pour organisation"
                        className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                        value={formData.challengerPhone}
                        onChange={e => setFormData({...formData, challengerPhone: e.target.value})}
                      />
                  </div>
              </div>

              <div className="mb-8">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Adversaire Souhaité</label>
                  <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, opponent: 'Oustaz Diane'})}
                        className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${formData.opponent === 'Oustaz Diane' ? 'bg-red-900/20 border-red-500 text-white' : 'bg-[#121212] border-gray-700 text-gray-400 hover:border-gray-500'}`}
                      >
                          <div className="w-10 h-10 rounded-full bg-gray-800"></div>
                          <div>
                              <div className="font-bold text-sm">Oustaz Diane</div>
                              <div className="text-[10px] opacity-70">Comparatiste</div>
                          </div>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, opponent: 'Ismaël Aka'})}
                        className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${formData.opponent === 'Ismaël Aka' ? 'bg-red-900/20 border-red-500 text-white' : 'bg-[#121212] border-gray-700 text-gray-400 hover:border-gray-500'}`}
                      >
                          <div className="w-10 h-10 rounded-full bg-gray-800"></div>
                          <div>
                              <div className="font-bold text-sm">Ismaël Aka</div>
                              <div className="text-[10px] opacity-70">Débatteur</div>
                          </div>
                      </button>
                  </div>
              </div>

              <div className="mb-8">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Thème du Débat</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: La divinité de Jésus dans la Bible"
                    className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition font-serif text-lg"
                    value={formData.topic}
                    onChange={e => setFormData({...formData, topic: e.target.value})}
                  />
              </div>

              <div className="mb-8">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message / Conditions</label>
                  <textarea 
                    rows={4}
                    placeholder="Détails supplémentaires..."
                    className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition resize-none"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transition transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {loading ? 'Transmission du défi...' : 'LANCER LE DÉFI OFFICIELLEMENT'}
              </button>
              <p className="text-center text-[10px] text-gray-600 mt-4">
                  En soumettant ce formulaire, vous acceptez que le débat soit filmé et diffusé sur les réseaux officiels de la DDR.
              </p>
          </form>
      </div>
    </div>
  );
};

export default DebateRequest;
