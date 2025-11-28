
import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { NewsItem, Debate, Conversion } from '../../types';

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'debates' | 'stories'>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [debates, setDebates] = useState<Debate[]>([]);
  const [stories, setStories] = useState<Conversion[]>([]);
  
  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null); // Generic type for simplicity

  useEffect(() => {
      loadData();
  }, []);

  const loadData = () => {
      setNews(dataService.getNews());
      setDebates(dataService.getDebates());
      setStories(dataService.getConversions());
  };

  const handleDelete = (type: 'news' | 'debates' | 'stories', id: string) => {
      if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.")) return;
      
      if (type === 'news') {
          dataService.deleteNews(id);
      } else if (type === 'debates') {
          dataService.deleteDebate(id);
      } else {
          dataService.deleteConversion(id);
      }
      loadData();
  };

  const handleEdit = (item: any) => {
      setEditingItem(item);
      setIsEditOpen(true);
  };

  const saveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingItem) return;

      if (activeTab === 'news') {
          dataService.updateNews(editingItem);
      } else if (activeTab === 'debates') {
          dataService.updateDebate(editingItem);
      }
      // Stories simple delete only for now or add update method
      
      loadData();
      setIsEditOpen(false);
      setEditingItem(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up relative">
       
       {/* EDIT MODAL */}
       {isEditOpen && editingItem && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
               <div className="bg-[#1a1a1c] w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl p-8">
                   <h2 className="text-2xl font-bold text-white mb-6">Modifier le contenu</h2>
                   <form onSubmit={saveEdit} className="space-y-4">
                       <div>
                           <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Titre</label>
                           <input 
                                type="text" 
                                value={editingItem.title || editingItem.name} 
                                onChange={(e) => setEditingItem({...editingItem, [editingItem.title ? 'title' : 'name']: e.target.value})}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                           />
                       </div>
                       <div>
                           <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Description / Contenu</label>
                           <textarea 
                                rows={5}
                                value={editingItem.content || editingItem.description || editingItem.story} 
                                onChange={(e) => setEditingItem({...editingItem, [editingItem.content ? 'content' : editingItem.description ? 'description' : 'story']: e.target.value})}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                           />
                       </div>
                       <div>
                           <label className="block text-xs text-gray-500 uppercase font-bold mb-2">URL Image / Vidéo</label>
                           <input 
                                type="text" 
                                value={editingItem.imageUrl || editingItem.videoUrl || editingItem.mediaUrl} 
                                onChange={(e) => setEditingItem({...editingItem, [editingItem.imageUrl ? 'imageUrl' : editingItem.videoUrl ? 'videoUrl' : 'mediaUrl']: e.target.value})}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none text-xs font-mono text-gray-400"
                           />
                       </div>
                       
                       <div className="flex justify-end gap-3 pt-4">
                           <button type="button" onClick={() => setIsEditOpen(false)} className="px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 font-bold">Annuler</button>
                           <button type="submit" className="px-6 py-3 rounded-lg bg-brand-600 text-white hover:bg-brand-500 font-bold">Enregistrer</button>
                       </div>
                   </form>
               </div>
           </div>
       )}

       <div className="flex justify-between items-center pb-6 border-b border-gray-800">
        <div>
            <h1 className="text-3xl font-bold text-white">Gestion du Contenu</h1>
            <p className="text-gray-500 mt-1">Publiez, modifiez ou supprimez les éléments du site.</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition transform">
            + Créer Nouveau
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
          <button 
            onClick={() => setActiveTab('news')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'news' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
              Actualités ({news.length})
          </button>
          <button 
            onClick={() => setActiveTab('debates')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'debates' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
              Débats & Vidéos ({debates.length})
          </button>
          <button 
            onClick={() => setActiveTab('stories')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'stories' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
              Témoignages ({stories.length})
          </button>
      </div>

      {/* Content List */}
      <div className="grid grid-cols-1 gap-4">
          {activeTab === 'news' && news.map(item => (
              <div key={item.id} className="bg-[#121214] border border-gray-800 p-4 rounded-xl flex gap-4 items-center group hover:border-brand-500/50 transition">
                  <img src={item.imageUrl} className="w-24 h-24 object-cover rounded-lg bg-gray-900" alt="thumbnail" />
                  <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                          <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded uppercase font-bold">{item.category}</span>
                          <span className="text-xs text-gray-500">{item.createdAt}</span>
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{item.content}</p>
                  </div>
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition">
                      <button onClick={() => handleEdit(item)} className="p-2 hover:bg-brand-900/30 rounded text-brand-500 font-bold text-xs uppercase border border-transparent hover:border-brand-500/50">Modifier</button>
                      <button onClick={() => handleDelete('news', item.id)} className="p-2 hover:bg-red-900/30 rounded text-red-500 font-bold text-xs uppercase border border-transparent hover:border-red-500/50">Supprimer</button>
                  </div>
              </div>
          ))}

          {activeTab === 'debates' && debates.map(item => (
              <div key={item.id} className="bg-[#121214] border border-gray-800 p-4 rounded-xl flex gap-4 items-center group hover:border-brand-500/50 transition">
                   <div className="w-32 h-20 bg-black rounded-lg relative overflow-hidden flex items-center justify-center">
                       {/* Use video thumb logic or fallback */}
                       <img src={item.thumbnailUrl || `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`} className="w-full h-full object-cover opacity-60" alt="thumb" />
                       <div className="absolute w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">▶</div>
                   </div>
                   <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-1" dangerouslySetInnerHTML={{__html: item.title}}></h3>
                        <p className="text-xs text-brand-500 font-bold uppercase">{item.speaker}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.location} • {item.date}</p>
                   </div>
                   <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition">
                      <button onClick={() => handleEdit(item)} className="p-2 hover:bg-brand-900/30 rounded text-brand-500 font-bold text-xs uppercase border border-transparent hover:border-brand-500/50">Modifier</button>
                      <button onClick={() => handleDelete('debates', item.id)} className="p-2 hover:bg-red-900/30 rounded text-red-500 font-bold text-xs uppercase border border-transparent hover:border-red-500/50">Supprimer</button>
                  </div>
              </div>
          ))}

          {activeTab === 'stories' && stories.map(item => (
              <div key={item.id} className="bg-[#121214] border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row gap-6 group hover:border-brand-500/50 transition">
                   <div className="flex items-center gap-4">
                       <img src={item.mediaUrl} className="w-16 h-16 rounded-full border-2 border-gray-700 object-cover" alt="avatar" />
                       <div>
                           <h3 className="font-bold text-white">{item.name}</h3>
                           <p className="text-xs text-gray-500">{item.date}</p>
                       </div>
                   </div>
                   <div className="flex-1 bg-black/40 p-4 rounded-lg border border-gray-800/50 italic text-gray-300 text-sm">
                       "{item.story}"
                   </div>
                   <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition items-center">
                      <button className="text-sm font-bold text-green-500 hover:underline cursor-default">Publié</button>
                      <button onClick={() => handleDelete('stories', item.id)} className="text-xs bg-red-900/20 text-red-500 px-3 py-1 rounded hover:bg-red-900/50 border border-red-900/30">Retirer</button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default AdminContent;