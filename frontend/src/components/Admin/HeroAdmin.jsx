import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineCheck, HiX } from 'react-icons/hi'
import { getAdminHeaders } from '../../api'

const API_URL = import.meta.env.VITE_API_URL || '';

export default function HeroAdmin() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title_fr: '', title_en: '',
    subtitle_fr: '', subtitle_en: '',
    order_index: 0,
    image: null
  })

  useEffect(() => {
    loadSlides()
  }, [])

  const loadSlides = async () => {
    try {
      const resp = await fetch(`${API_URL}/api/admin/hero`, { headers: getAdminHeaders() });
      const data = await resp.json();
      setSlides(data);
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null) data.append(key, val);
    });

    const url = editingSlide 
      ? `${API_URL}/api/admin/hero/${editingSlide.id}`
      : `${API_URL}/api/admin/hero`;
    
    const method = editingSlide ? 'PUT' : 'POST';

    try {
      const resp = await fetch(url, {
        method,
        headers: getAdminHeaders(),
        body: data
      });
      if (resp.ok) {
        setIsModalOpen(false);
        setEditingSlide(null);
        setFormData({ title_fr: '', title_en: '', subtitle_fr: '', subtitle_en: '', order_index: 0, image: null });
        loadSlides();
      }
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette slide ?')) return;
    try {
      await fetch(`${API_URL}/api/admin/hero/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      loadSlides();
    } catch (err) { console.error(err) }
  }

  const openEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title_fr: slide.title_fr,
      title_en: slide.title_en,
      subtitle_fr: slide.subtitle_fr,
      subtitle_en: slide.subtitle_en,
      order_index: slide.order_index,
      image: null
    });
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-[var(--a-text)]">Design Hero</h2>
          <p className="text-sm text-[var(--a-text)]/40">Gérez les images et textes de la page d'accueil</p>
        </div>
        <button 
          onClick={() => { setEditingSlide(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
        >
          <HiOutlinePlus className="w-4 h-4" /> Ajouter une Slide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map(slide => (
          <div key={slide.id} className="group relative aspect-video bg-[var(--a-input)] rounded-2xl overflow-hidden border border-[var(--a-border)]">
            <img src={`${API_URL}/uploads/${slide.image_path}`} alt="" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-bold">{slide.title_fr || 'Sans titre'}</h3>
              <p className="text-white/60 text-xs line-clamp-1">{slide.subtitle_fr}</p>
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(slide)} className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-gold hover:text-black">
                  <HiOutlinePencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(slide.id)} className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-500">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--a-bg)] border border-[var(--a-border)] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-[var(--a-border)] flex justify-between items-center">
                <h3 className="text-lg font-bold text-[var(--a-text)]">{editingSlide ? 'Modifier Slide' : 'Nouvelle Slide'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[var(--a-input)] rounded-full text-[var(--a-text)]/40"><HiX className="w-5 h-5" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--a-text)]/30">Titre (FR)</label>
                    <input type="text" value={formData.title_fr} onChange={e => setFormData({...formData, title_fr: e.target.value})} className="w-full bg-[var(--a-input)] border border-[var(--a-border)] rounded-xl p-3 text-sm text-[var(--a-text)]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--a-text)]/30">Title (EN)</label>
                    <input type="text" value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full bg-[var(--a-input)] border border-[var(--a-border)] rounded-xl p-3 text-sm text-[var(--a-text)]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--a-text)]/30">Sous-titre (FR)</label>
                    <textarea value={formData.subtitle_fr} onChange={e => setFormData({...formData, subtitle_fr: e.target.value})} className="w-full bg-[var(--a-input)] border border-[var(--a-border)] rounded-xl p-3 text-sm text-[var(--a-text)] h-20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--a-text)]/30">Subtitle (EN)</label>
                    <textarea value={formData.subtitle_en} onChange={e => setFormData({...formData, subtitle_en: e.target.value})} className="w-full bg-[var(--a-input)] border border-[var(--a-border)] rounded-xl p-3 text-sm text-[var(--a-text)] h-20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--a-text)]/30">Image</label>
                    <input type="file" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="text-xs text-[var(--a-text)]/40" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--a-text)]/30">Ordre</label>
                    <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: e.target.value})} className="w-full bg-[var(--a-input)] border border-[var(--a-border)] rounded-xl p-3 text-sm text-[var(--a-text)]" />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-gold text-black font-bold text-xs uppercase tracking-widest rounded-xl">Enregistrer</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
