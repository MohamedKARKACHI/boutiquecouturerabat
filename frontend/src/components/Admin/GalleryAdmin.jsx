import { useState, useEffect } from 'react'
import { HiPlus, HiTrash } from 'react-icons/hi'
import { fetchGallery } from '../../api'
import ConfirmationModal from './ConfirmationModal'

const API_URL = import.meta.env.VITE_API_URL || '';

export default function GalleryAdmin() {
  const [items, setItems] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({ image: null, alt_text: '', alt_text_en: '', order_index: 0 })
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { loadData() }, [])
  const loadData = async () => { setItems(await fetchGallery()) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('alt_text', formData.alt_text)
    data.append('alt_text_en', formData.alt_text_en)
    data.append('order_index', formData.order_index)
    if (formData.image) data.append('image', formData.image)

    try {
      await fetch(`${API_URL}/api/admin/gallery`, { method: 'POST', body: data })
      setIsAdding(false)
      loadData()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`${API_URL}/api/admin/gallery/${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      loadData()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-charcoal uppercase tracking-widest">Galerie Portfolio</h2>
        <button onClick={() => setIsAdding(true)} className="bg-charcoal text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold transition-all flex items-center gap-2">
          <HiPlus /> Ajouter des images
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-sand flex flex-col gap-4">
          <input type="file" onChange={e => setFormData({...formData, image: e.target.files[0]})} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Texte alternatif (FR)" value={formData.alt_text} onChange={e => setFormData({...formData, alt_text: e.target.value})} className="border border-sand rounded-xl p-3" />
            <input type="text" placeholder="Alt Text (EN)" value={formData.alt_text_en} onChange={e => setFormData({...formData, alt_text_en: e.target.value})} className="border border-gold/10 rounded-xl p-3" />
          </div>
          <div className="flex justify-end gap-3">
             <button type="button" onClick={() => setIsAdding(false)}>Annuler</button>
             <button type="submit" className="bg-charcoal text-white px-8 py-3 rounded-xl font-bold">Uploader</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map(item => (
          <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden group">
            <img src={`${API_URL}/uploads/${item.image_path}`} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => setDeleteId(item.id)} 
                className="p-3 bg-red-400 text-white rounded-full hover:scale-110 transition-transform"
              >
                <HiTrash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Supprimer l'image"
        message="Êtes-vous sûr de vouloir supprimer cette image de la galerie ?"
      />
    </div>
  )
}
