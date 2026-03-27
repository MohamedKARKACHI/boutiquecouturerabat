import { useState, useEffect } from 'react'
import { HiPlus, HiPencilAlt, HiTrash } from 'react-icons/hi'
import { fetchCategories } from '../../api'
import ConfirmationModal from './ConfirmationModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CategoryAdmin() {
  const [categories, setCategories] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ id: null, name: '', name_en: '', slug: '', description: '', description_en: '', image: null })
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { loadData() }, [])
  const loadData = async () => { setCategories(await fetchCategories()) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.keys(formData).forEach(key => { if(key !== 'image') data.append(key, formData[key]) })
    if (formData.image) data.append('image', formData.image)

    const url = formData.id ? `${API_URL}/api/admin/categories/${formData.id}` : `${API_URL}/api/admin/categories`
    try {
      await fetch(url, { method: formData.id ? 'PUT' : 'POST', body: data })
      setIsEditing(false)
      loadData()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`${API_URL}/api/admin/categories/${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      loadData()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-charcoal uppercase tracking-widest">Catégories</h2>
        <button onClick={() => { setIsEditing(true); setFormData({ id: null, name: '', slug: '', description: '', image: null }) }} className="bg-charcoal text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold transition-all flex items-center gap-2">
          <HiPlus /> Ajouter
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-sand grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Nom (FR)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border border-sand rounded-xl p-3" required />
          <input type="text" placeholder="Name (EN)" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="border border-gold/10 rounded-xl p-3" required />
          <input type="text" placeholder="Slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="border border-sand rounded-xl p-3" required />
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea placeholder="Description (FR)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="border border-sand rounded-xl p-3 min-h-[80px]" />
            <textarea placeholder="Description (EN)" value={formData.description_en} onChange={e => setFormData({...formData, description_en: e.target.value})} className="border border-gold/10 rounded-xl p-3 min-h-[80px]" />
          </div>
          <input type="file" onChange={e => setFormData({...formData, image: e.target.files[0]})} />
          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
            <button type="submit" className="bg-charcoal text-white px-8 py-3 rounded-xl font-bold">Enregistrer</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-3xl shadow-sm border border-sand flex items-center gap-4 group">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-cream shrink-0">
               <img src={`/uploads/${c.image}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-charcoal">{c.name}</h4>
              <p className="text-xs text-smoke">{c.slug}</p>
            </div>
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setFormData({...c, image: null}); setIsEditing(true) }} className="p-2 text-smoke hover:text-gold"><HiPencilAlt /></button>
              <button onClick={() => setDeleteId(c.id)} className="p-2 text-smoke hover:text-red-400"><HiTrash /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Supprimer la catégorie"
        message="Êtes-vous sûr de vouloir supprimer cette catégorie ? Tous les produits associés pourraient être affectés."
      />
    </div>
  )
}
