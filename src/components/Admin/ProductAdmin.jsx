import { useState, useEffect } from 'react'
import { HiPlus, HiPencilAlt, HiTrash, HiCheck } from 'react-icons/hi'
import { fetchProducts, fetchCategories, fetchProductById } from '../../api'
import ConfirmationModal from './ConfirmationModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductAdmin() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    title_en: '',
    slug: '',
    price: '',
    category_id: '',
    description: '',
    description_en: '',
    in_stock: true,
    is_featured: false,
    image: null,
    gallery: [],
    existingGallery: [],
    removeImages: []
  })
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([fetchProducts(), fetchCategories()])
      setProducts(p)
      setCategories(c)
    } catch (err) { console.error(err) }
  }

  const handleEdit = async (p) => {
    try {
      const detail = await fetchProductById(p.id)
      setFormData({
        id: detail.id,
        title: detail.title,
        title_en: detail.title_en || '',
        slug: detail.slug,
        price: detail.price,
        category_id: detail.category_id,
        description: detail.description,
        description_en: detail.description_en || '',
        in_stock: !!detail.in_stock,
        is_featured: !!detail.is_featured,
        image: null,
        gallery: [],
        existingGallery: detail.images || [],
        removeImages: []
      })
      setIsEditing(true)
    } catch (err) { console.error(err) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = formData.id ? 'PUT' : 'POST'
    const data = new FormData()
    
    // Core data
    data.append('title', formData.title)
    data.append('title_en', formData.title_en)
    data.append('slug', formData.slug)
    data.append('price', formData.price)
    data.append('category_id', formData.category_id)
    data.append('description', formData.description)
    data.append('description_en', formData.description_en)
    data.append('in_stock', formData.in_stock)
    data.append('is_featured', formData.is_featured)

    // Images
    if (formData.image) data.append('image', formData.image)
    if (formData.gallery.length > 0) {
      formData.gallery.forEach(file => data.append('gallery', file))
    }
    if (formData.removeImages.length > 0) {
      data.append('remove_images', JSON.stringify(formData.removeImages))
    }

    try {
      const resp = await fetch(`${API_URL}/api/admin/products${formData.id ? '/' + formData.id : ''}`, {
        method: method,
        body: data
      })
      if (resp.ok) {
        setIsEditing(false)
        setFormData({ id: null, title: '', title_en: '', slug: '', price: '', category_id: '', description: '', description_en: '', in_stock: true, is_featured: false, image: null, gallery: [], existingGallery: [], removeImages: [] })
        loadData()
      }
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`${API_URL}/api/admin/products/${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      loadData()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-charcoal uppercase tracking-widest">Gestion des Produits</h2>
        <button 
          onClick={() => {
            setIsEditing(true)
            setFormData({ id: null, title: '', title_en: '', slug: '', price: '', category_id: categories[0]?.id || '', description: '', description_en: '', in_stock: true, is_featured: false, image: null, gallery: [], existingGallery: [], removeImages: [] })
          }}
          className="flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold transition-all"
        >
          <HiPlus className="w-5 h-5" />
          Ajouter un produit
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-sand">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-smoke">Titre (FR)</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required
                className="bg-cream/20 border border-sand rounded-xl p-3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-smoke">Title (EN)</label>
              <input 
                type="text" 
                value={formData.title_en} 
                onChange={e => setFormData({...formData, title_en: e.target.value})} 
                required
                className="bg-cream/20 border border-gold/10 rounded-xl p-3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-smoke">Slug</label>
              <input 
                type="text" 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value})} 
                required
                className="bg-cream/20 border border-sand rounded-xl p-3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-smoke">Prix (DH)</label>
              <input 
                type="number" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                required
                className="bg-cream/20 border border-sand rounded-xl p-3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-smoke">Catégorie</label>
              <select 
                value={formData.category_id} 
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                className="bg-cream/20 border border-sand rounded-xl p-3"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-smoke">Description (FR)</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="bg-cream/20 border border-sand rounded-xl p-3 min-h-[80px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-smoke">Description (EN)</label>
              <textarea 
                value={formData.description_en} 
                onChange={e => setFormData({...formData, description_en: e.target.value})}
                className="bg-cream/20 border border-gold/10 rounded-xl p-3 min-h-[80px]"
              />
            </div>
            
            {/* Image Uploads */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 bg-cream/20 p-6 rounded-3xl border border-sand">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-smoke">Image Principale</label>
                </div>
                <div className="relative group">
                  <input 
                    type="file" 
                    id="main-image-upload"
                    className="hidden"
                    onChange={e => setFormData({...formData, image: e.target.files[0]})}
                  />
                  <label 
                    htmlFor="main-image-upload"
                    className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-sand rounded-2xl cursor-pointer hover:border-gold hover:bg-gold/5 transition-all overflow-hidden"
                  >
                    {formData.image || (formData.id && !formData.image) ? (
                      <img 
                        src={formData.image ? URL.createObjectURL(formData.image) : `${API_URL}/uploads/${products.find(p=>p.id===formData.id)?.main_image}`} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-smoke">
                        <HiPlus className="w-8 h-8 opacity-40" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Cliquer pour choisir</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-smoke">Galerie d'images</label>
                  <label htmlFor="gallery-upload" className="flex items-center gap-2 text-gold hover:text-charcoal transition-colors cursor-pointer">
                    <HiPlus className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Ajouter</span>
                  </label>
                  <input 
                    type="file" 
                    id="gallery-upload"
                    multiple
                    className="hidden"
                    onChange={e => setFormData({...formData, gallery: [...formData.gallery, ...Array.from(e.target.files)]})}
                  />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-white/50 p-4 rounded-2xl min-h-[120px] border border-sand/50">
                  {/* Current Gallery Previews (Existing) */}
                  {formData.existingGallery.map((img, idx) => (
                    <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-sand group shadow-sm bg-white">
                      <img src={`${API_URL}/uploads/${img}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              existingGallery: formData.existingGallery.filter(g => g !== img),
                              removeImages: [...formData.removeImages, img]
                            })
                          }}
                          className="text-white transform hover:scale-125 transition-transform"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* New Gallery Previews */}
                  {formData.gallery.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gold/30 group shadow-sm bg-gold/5 flex flex-col items-center justify-center p-2">
                       <img src={URL.createObjectURL(file)} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal/60">
                         <button 
                          type="button"
                          onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, i) => i !== idx)})}
                          className="text-white transform hover:scale-125 transition-transform"
                         >
                          <HiTrash className="w-5 h-5" />
                         </button>
                       </div>
                       <span className="relative z-10 text-[8px] font-bold text-charcoal bg-gold px-1.5 rounded-full uppercase">NOUVEAU</span>
                    </div>
                  ))}

                  {/* Empty state plus button */}
                  {formData.gallery.length === 0 && formData.existingGallery.length === 0 && (
                    <label htmlFor="gallery-upload" className="col-span-full flex flex-col items-center justify-center gap-2 text-smoke/40 cursor-pointer">
                       <HiPlus className="w-10 h-10 border-2 border-dashed border-sand rounded-xl p-2" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.in_stock} onChange={e => setFormData({...formData, in_stock: e.target.checked})} />
                <span className="text-sm font-medium">En Stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
                <span className="text-sm font-medium">Vedette</span>
              </label>
            </div>

            {/* Gallery Preview removed as it's now integrated above */}

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 text-smoke font-bold uppercase tracking-widest text-xs"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="bg-charcoal text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold transition-all"
              >
                Enregistrer le produit
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-sand">
        <table className="w-full text-left">
          <thead className="bg-cream/50">
            <tr>
              <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-smoke">Produit</th>
              <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-smoke">Catégorie</th>
              <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-smoke">Prix</th>
              <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-smoke">Stock</th>
              <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-smoke text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-cream/20 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-cream shrink-0">
                      <img src={`${API_URL}/uploads/${p.main_image}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal">{p.title}</h4>
                      <p className="text-xs text-smoke underline underline-offset-2">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-cream rounded-full text-[10px] font-bold uppercase tracking-widest text-gold-dark">
                    {p.category_name}
                  </span>
                </td>
                <td className="p-5 font-bold text-charcoal">{p.price} DH</td>
                <td className="p-5">
                  {p.in_stock ? (
                    <span className="flex items-center gap-1.5 text-emerald font-bold text-[10px] uppercase tracking-widest">
                      <HiCheck className="w-4 h-4" /> En Stock
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold text-[10px] uppercase tracking-widest">Épuisé</span>
                  )}
                </td>
                <td className="p-5">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(p)}
                      className="p-2 text-smoke hover:text-gold hover:bg-gold/10 rounded-lg transition-all"
                    >
                      <HiPencilAlt className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setDeleteId(p.id)}
                      className="p-2 text-smoke hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
