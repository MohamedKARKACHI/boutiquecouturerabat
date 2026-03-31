import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiPencilAlt, HiTrash, HiCheck, HiX, HiStar, HiChevronDown } from 'react-icons/hi'
import { fetchProducts, fetchCategories, fetchProductById } from '../../api'
import ImageDropZone, { MultiImageDropZone } from './ImageDropZone'
import ConfirmationModal from './ConfirmationModal'
import { useToast } from './AdminToast'

const API_URL = import.meta.env.VITE_API_URL || ''

const EMPTY_FORM = {
  id: null, title: '', title_en: '', slug: '', price: '', category_id: '',
  description: '', description_en: '', in_stock: true, is_featured: false,
  image: null, gallery: [], existingGallery: [], removeImages: []
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProductAdmin() {
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()])
      setProducts(prods)
      setCategories(cats)
      setLoading(false)
    } catch (err) {
      toast.error('Impossible de charger les données')
      setLoading(false)
    }
  }

  const handleNew = () => {
    setFormData({ ...EMPTY_FORM, category_id: categories[0]?.id || '' })
    setIsEditing(true)
  }

  const handleEdit = async (p) => {
    try {
      const detail = await fetchProductById(p.id)
      setFormData({
        id: detail.id, title: detail.title, title_en: detail.title_en || '',
        slug: detail.slug, price: detail.price, category_id: detail.category_id,
        description: detail.description || '', description_en: detail.description_en || '',
        in_stock: !!detail.in_stock, is_featured: !!detail.is_featured,
        image: null, gallery: [],
        existingGallery: (detail.images || []).map(img => ({
          id: img.id,
          url: `${API_URL}/uploads/${img.path || img.image_path}`,
          path: img.path || img.image_path
        })),
        removeImages: []
      })
      setIsEditing(true)
    } catch (err) { toast.error('Erreur lors du chargement du produit') }
  }

  const handleTitleChange = (val) => {
    const update = { ...formData, title: val }
    // Auto-slug only for new products
    if (!formData.id) update.slug = slugify(val)
    setFormData(update)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const method = formData.id ? 'PUT' : 'POST'
    const data = new FormData()
    
    data.append('title', formData.title)
    data.append('title_en', formData.title_en)
    data.append('slug', formData.slug)
    data.append('price', formData.price)
    data.append('category_id', formData.category_id)
    data.append('description', formData.description)
    data.append('description_en', formData.description_en)
    data.append('in_stock', formData.in_stock)
    data.append('is_featured', formData.is_featured)

    if (formData.image) data.append('image', formData.image)
    formData.gallery.forEach(file => data.append('gallery', file))
    if (formData.removeImages.length > 0) {
      data.append('remove_images', JSON.stringify(formData.removeImages))
    }

    try {
      const resp = await fetch(`${API_URL}/api/admin/products${formData.id ? '/' + formData.id : ''}`, { method, body: data })
      if (resp.ok) {
        setIsEditing(false)
        setFormData(EMPTY_FORM)
        await loadData()
        toast.success(formData.id ? 'Produit modifié avec succès' : 'Produit créé avec succès')
      } else {
        const errData = await resp.json()
        toast.error(errData.error || 'Erreur serveur')
      }
    } catch (err) { 
      toast.error(`Erreur réseau: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`${API_URL}/api/admin/products/${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      await loadData()
      toast.success('Produit supprimé')
    } catch (err) { toast.error('Erreur lors de la suppression') }
  }

  // ── FORM VIEW ──
  if (isEditing) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => setIsEditing(false)} className="text-[var(--a-text)]/30 hover:text-[var(--a-text)] text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
              ← Retour aux produits
            </button>
            <h2 className="font-display text-2xl font-bold text-[var(--a-text)]">
              {formData.id ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic info */}
          <div className="rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] p-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--a-text)]/30">Informations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Titre (FR)</label>
                <input type="text" value={formData.title} onChange={e => handleTitleChange(e.target.value)} required
                  className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)] placeholder-[var(--a-text-20)] focus:border-gold/50 focus:outline-none transition-colors"
                  placeholder="Ex: Caftan Royal" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Title (EN)</label>
                <input type="text" value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} required
                  className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)] placeholder-[var(--a-text-20)] focus:border-gold/50 focus:outline-none transition-colors"
                  placeholder="Ex: Royal Caftan" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Slug (auto)</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required
                  className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)]/50 font-mono text-sm focus:border-gold/50 focus:outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Prix (DH)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required
                    className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)] focus:border-gold/50 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Catégorie</label>
                  <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}
                    className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)] focus:border-gold/50 focus:outline-none transition-colors appearance-none">
                    {categories.map(c => <option key={c.id} value={c.id} className="bg-[#1a1a2e] text-[var(--a-text)]">{c.name}</option>)}
                  </select>
                </div>
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

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${formData.in_stock ? 'bg-emerald-500 justify-end' : 'bg-[var(--a-hover-2)] justify-start'}`}>
                  <div className="w-5 h-5 bg-[var(--a-text)] rounded-full mx-0.5 shadow-sm" />
                </div>
                <span className="text-sm text-[var(--a-text)]/60 group-hover:text-[var(--a-text)]/80 transition-colors">En stock</span>
              </label>
              <input type="checkbox" checked={formData.in_stock} onChange={e => setFormData({...formData, in_stock: e.target.checked})} className="hidden" />
              
              <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}>
                <div className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${formData.is_featured ? 'bg-gold justify-end' : 'bg-[var(--a-hover-2)] justify-start'}`}>
                  <div className="w-5 h-5 bg-[var(--a-text)] rounded-full mx-0.5 shadow-sm" />
                </div>
                <span className="text-sm text-[var(--a-text)]/60 group-hover:text-[var(--a-text)]/80 transition-colors">Vedette</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] p-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--a-text)]/30">Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Image Principale</label>
                <ImageDropZone
                  value={formData.image}
                  existingUrl={formData.id && !formData.image ? `${API_URL}/uploads/${products.find(p => p.id === formData.id)?.main_image}` : null}
                  onChange={(file) => setFormData({...formData, image: file})}
                  onRemove={() => setFormData({...formData, image: null})}
                  label="Image principale"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Galerie</label>
                <MultiImageDropZone
                  files={formData.gallery}
                  existingImages={formData.existingGallery}
                  onAdd={(newFiles) => setFormData({...formData, gallery: [...formData.gallery, ...newFiles]})}
                  onRemoveNew={(idx) => setFormData({...formData, gallery: formData.gallery.filter((_, i) => i !== idx)})}
                  onRemoveExisting={(imgId) => setFormData({
                    ...formData,
                    existingGallery: formData.existingGallery.filter(g => g.id !== imgId),
                    removeImages: [...formData.removeImages, imgId]
                  })}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button type="button" onClick={() => setIsEditing(false)}
              className="px-6 py-3 text-[var(--a-text)]/40 hover:text-[var(--a-text)] text-xs font-bold uppercase tracking-widest transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3.5 bg-gold text-charcoal rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-all disabled:opacity-50 shadow-lg shadow-gold/20">
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> Enregistrement...</>
              ) : formData.id ? 'Sauvegarder' : 'Créer le produit'}
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
          <h2 className="font-display text-2xl font-bold text-[var(--a-text)]">Produits</h2>
          <p className="text-[var(--a-text)]/30 text-sm mt-1">{products.length} article{products.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleNew}
          className="flex items-center gap-2 px-6 py-3 bg-gold text-charcoal rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-all shadow-lg shadow-gold/20">
          <HiPlus className="w-4 h-4" /> Nouveau
        </button>
      </div>

      {/* Product cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-[var(--a-sub)]" />
              <div className="p-5 space-y-3"><div className="h-4 w-2/3 bg-[var(--a-sub)] rounded" /><div className="h-3 w-1/3 bg-[var(--a-sub)] rounded" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] overflow-hidden hover:border-[var(--a-border-hover)] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--a-sub-hover)]">
                <img src={`${API_URL}/uploads/${p.main_image}`} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {p.is_featured ? (
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-gold/90 text-charcoal text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    <HiStar className="w-3 h-3" /> Vedette
                  </span>
                ) : null}
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => handleEdit(p)} className="p-3 bg-[var(--a-hover-3)] backdrop-blur-sm rounded-xl text-[var(--a-text)] hover:bg-gold/80 hover:text-charcoal transition-all">
                    <HiPencilAlt className="w-5 h-5" />
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="p-3 bg-[var(--a-hover-3)] backdrop-blur-sm rounded-xl text-[var(--a-text)] hover:bg-red-500 transition-all">
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Info */}
              <div className="p-5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gold/70">{p.category_name}</span>
                <h3 className="font-display text-lg font-semibold text-[var(--a-text)] mt-1">{p.title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[var(--a-text)]/80 font-bold">{Number(p.price).toLocaleString()} DH</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 ${p.in_stock ? 'text-emerald-400' : 'text-red-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.in_stock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {p.in_stock ? 'En stock' : 'Épuisé'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Supprimer le produit"
        message="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
      />
    </div>
  )
}
