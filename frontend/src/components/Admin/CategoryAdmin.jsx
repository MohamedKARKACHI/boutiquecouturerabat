import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiPencilAlt, HiTrash, HiX } from 'react-icons/hi'
import { fetchCategories, getAdminHeaders } from '../../api'
import ImageDropZone from './ImageDropZone'
import ConfirmationModal from './ConfirmationModal'
import { useToast } from './AdminToast'

const API_URL = import.meta.env.VITE_API_URL || ''

const EMPTY_FORM = { id: null, name: '', name_en: '', slug: '', description: '', description_en: '', image: null }

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function CategoryAdmin() {
  const toast = useToast()
  const [categories, setCategories] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setCategories(await fetchCategories())
      setLoading(false)
    } catch { toast.error('Impossible de charger les catégories'); setLoading(false) }
  }

  const handleNew = () => {
    setFormData(EMPTY_FORM)
    setIsEditing(true)
  }

  const handleEdit = (c) => {
    setFormData({ ...c, image: null })
    setIsEditing(true)
  }

  const handleNameChange = (val) => {
    const update = { ...formData, name: val }
    if (!formData.id) update.slug = slugify(val)
    setFormData(update)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const data = new FormData()
    Object.keys(formData).forEach(key => { if (key !== 'image') data.append(key, formData[key] || '') })
    if (formData.image) data.append('image', formData.image)

    const url = formData.id ? `${API_URL}/api/admin/categories/${formData.id}` : `${API_URL}/api/admin/categories`
    try {
      const resp = await fetch(url, { 
        method: formData.id ? 'PUT' : 'POST', 
        body: data,
        headers: getAdminHeaders()
      })
      if (resp.ok) {
        setIsEditing(false)
        setFormData(EMPTY_FORM)
        await loadData()
        toast.success(formData.id ? 'Catégorie modifiée' : 'Catégorie créée')
      } else {
        toast.error('Erreur lors de l\'enregistrement')
      }
    } catch (err) { toast.error(`Erreur réseau: ${err.message}`) }
    finally { setIsSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`${API_URL}/api/admin/categories/${deleteId}`, { 
        method: 'DELETE',
        headers: getAdminHeaders()
      })
      setDeleteId(null)
      await loadData()
      toast.success('Catégorie supprimée')
    } catch { toast.error('Erreur lors de la suppression') }
  }

  // ── FORM VIEW ──
  if (isEditing) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div>
          <button onClick={() => setIsEditing(false)} className="text-[var(--a-text)]/30 hover:text-[var(--a-text)] text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
            ← Retour aux catégories
          </button>
          <h2 className="font-display text-2xl font-bold text-[var(--a-text)]">
            {formData.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Nom (FR)</label>
                <input type="text" value={formData.name} onChange={e => handleNameChange(e.target.value)} required
                  className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)] placeholder-[var(--a-text-20)] focus:border-gold/50 focus:outline-none transition-colors"
                  placeholder="Ex: Caftans" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Name (EN)</label>
                <input type="text" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} required
                  className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)] placeholder-[var(--a-text-20)] focus:border-gold/50 focus:outline-none transition-colors"
                  placeholder="Ex: Caftans" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Slug (auto)</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required
                  className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)]/50 font-mono text-sm focus:border-gold/50 focus:outline-none transition-colors" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Image</label>
                <ImageDropZone
                  value={formData.image}
                  existingUrl={formData.id && !formData.image && formData.image !== null ? `${API_URL}/uploads/${categories.find(c => c.id === formData.id)?.image}` : null}
                  onChange={(file) => setFormData({...formData, image: file})}
                  onRemove={() => setFormData({...formData, image: null})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Description (FR)</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3}
                  className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)] placeholder-[var(--a-text-20)] focus:border-gold/50 focus:outline-none transition-colors resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Description (EN)</label>
                <textarea value={formData.description_en} onChange={e => setFormData({...formData, description_en: e.target.value})} rows={3}
                  className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)] placeholder-[var(--a-text-20)] focus:border-gold/50 focus:outline-none transition-colors resize-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 text-[var(--a-text)]/40 hover:text-[var(--a-text)] text-xs font-bold uppercase tracking-widest transition-colors">Annuler</button>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3.5 bg-gold text-charcoal rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-all disabled:opacity-50 shadow-lg shadow-gold/20">
              {isSubmitting ? <><div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> Enregistrement...</> : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </motion.div>
    )
  }

  // ── LIST VIEW ──
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--a-text)]">Catégories</h2>
          <p className="text-[var(--a-text)]/30 text-sm mt-1">{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleNew} className="flex items-center gap-2 px-6 py-3 bg-gold text-charcoal rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-all shadow-lg shadow-gold/20">
          <HiPlus className="w-4 h-4" /> Nouvelle
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] overflow-hidden animate-pulse">
              <div className="aspect-[3/2] bg-[var(--a-sub)]" />
              <div className="p-5 space-y-3"><div className="h-4 w-2/3 bg-[var(--a-sub)] rounded" /><div className="h-3 w-full bg-[var(--a-panel)] rounded" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] overflow-hidden hover:border-[var(--a-border-hover)] transition-all duration-300"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-[var(--a-sub-hover)]">
                <img src={`${API_URL}/uploads/${c.image}`} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => handleEdit(c)} className="p-3 bg-[var(--a-hover-3)] backdrop-blur-sm rounded-xl text-[var(--a-text)] hover:bg-gold/80 hover:text-charcoal transition-all">
                    <HiPencilAlt className="w-5 h-5" />
                  </button>
                  <button onClick={() => setDeleteId(c.id)} className="p-3 bg-[var(--a-hover-3)] backdrop-blur-sm rounded-xl text-[var(--a-text)] hover:bg-red-500 transition-all">
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-[var(--a-text)]">{c.name}</h3>
                <p className="text-[var(--a-text)]/30 text-sm mt-1 line-clamp-2">{c.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmationModal isOpen={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)}
        title="Supprimer la catégorie" message="Êtes-vous sûr ? Tous les produits associés pourraient être affectés." />
    </div>
  )
}
