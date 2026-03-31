import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiTrash, HiX } from 'react-icons/hi'
import { fetchGallery } from '../../api'
import ConfirmationModal from './ConfirmationModal'
import { useToast } from './AdminToast'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function GalleryAdmin() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setItems(await fetchGallery())
      setLoading(false)
    } catch { toast.error('Impossible de charger la galerie'); setLoading(false) }
  }

  const uploadImages = async (files) => {
    setUploading(true)
    let successCount = 0

    for (const file of files) {
      const data = new FormData()
      data.append('image', file)
      data.append('alt_text', file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
      data.append('alt_text_en', file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
      data.append('order_index', items.length + successCount + 1)

      try {
        const resp = await fetch(`${API_URL}/api/admin/gallery`, { method: 'POST', body: data })
        if (resp.ok) successCount++
      } catch (err) { console.error(err) }
    }

    setUploading(false)
    await loadData()
    if (successCount > 0) toast.success(`${successCount} image${successCount > 1 ? 's' : ''} ajoutée${successCount > 1 ? 's' : ''}`)
    if (successCount < files.length) toast.warning(`${files.length - successCount} image${files.length - successCount > 1 ? 's' : ''} échouée${files.length - successCount > 1 ? 's' : ''}`)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length > 0) uploadImages(files)
  }, [items])

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) uploadImages(files)
    e.target.value = ''
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`${API_URL}/api/admin/gallery/${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      await loadData()
      toast.success('Image supprimée')
    } catch { toast.error('Erreur lors de la suppression') }
  }

  return (
    <div className="space-y-8"
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileSelect} className="hidden" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--a-text)]">Galerie Portfolio</h2>
          <p className="text-[var(--a-text)]/30 text-sm mt-1">{items.length} image{items.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 bg-gold text-charcoal rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-all shadow-lg shadow-gold/20">
          <HiPlus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Upload indicator */}
      {uploading && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gold/10 border border-gold/20">
          <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <span className="text-sm text-gold">Upload en cours...</span>
        </div>
      )}

      {/* Drag overlay */}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gold/20 flex items-center justify-center">
              <HiPlus className="w-10 h-10 text-gold" />
            </div>
            <p className="font-display text-2xl font-bold text-[var(--a-text)] mb-2">Déposer les images ici</p>
            <p className="text-[var(--a-text)]/40 text-sm">JPEG, PNG, WebP · Max 5MB par image</p>
          </div>
        </motion.div>
      )}

      {/* Gallery grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full py-20 rounded-2xl border-2 border-dashed border-[var(--a-border-hover)] flex flex-col items-center justify-center gap-4 hover:border-gold/40 hover:bg-[var(--a-sub-hover)] transition-all cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--a-hover-1)] flex items-center justify-center">
            <HiPlus className="w-8 h-8 text-[var(--a-text)]/30" />
          </div>
          <div className="text-center">
            <p className="text-[var(--a-text)]/50 font-medium mb-1">Aucune image dans la galerie</p>
            <p className="text-[var(--a-text)]/25 text-xs uppercase tracking-widest">Glisser-déposer ou cliquer pour ajouter</p>
          </div>
        </button>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[var(--a-sub-hover)] border border-[var(--a-border)] hover:border-[var(--a-border-hover)] transition-all"
            >
              <img src={`${API_URL}/uploads/${item.image_path}`} alt={item.alt_text} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <p className="text-[var(--a-text)]/80 text-xs line-clamp-1 flex-1">{item.alt_text}</p>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-2 bg-red-500/80 text-[var(--a-text)] rounded-lg hover:bg-red-500 hover:scale-110 transition-all shrink-0 ml-2"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add more button */}
          <button
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-[var(--a-border-hover)] flex flex-col items-center justify-center gap-2 hover:border-gold/40 hover:bg-[var(--a-sub-hover)] transition-all"
          >
            <HiPlus className="w-8 h-8 text-[var(--a-text)]/20" />
            <span className="text-[9px] text-[var(--a-text)]/20 uppercase tracking-widest font-bold">Ajouter</span>
          </button>
        </div>
      )}

      <ConfirmationModal isOpen={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)}
        title="Supprimer l'image" message="Êtes-vous sûr de vouloir supprimer cette image de la galerie ?" />
    </div>
  )
}
