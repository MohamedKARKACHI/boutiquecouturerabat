import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPlus, HiTrash } from 'react-icons/hi'
import { fetchColors, getAdminHeaders } from '../../api'
import ConfirmationModal from './ConfirmationModal'
import { useToast } from './AdminToast'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function ColorsAdmin() {
  const [colors, setColors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ id: null, name: '', hex_code: '#000000' })
  const [isNaming, setIsNaming] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (!isEditing || !formData.hex_code || formData.hex_code.length !== 7) return

    const timer = setTimeout(async () => {
      // Trigger if name is empty, whitespace only, or 'Sans Nom'
      const nameIsEmpty = !formData.name || formData.name.trim() === '' || formData.name === 'Sans Nom'
      if (!nameIsEmpty) return

      try {
        setIsNaming(true)
        const hex = formData.hex_code.replace('#', '')
        const resp = await fetch(`https://www.thecolorapi.com/id?hex=${hex}`)
        if (!resp.ok) return
        const data = await resp.json()
        
        if (data.name && data.name.value) {
          setFormData(prev => {
            const currentNameIsEmpty = !prev.name || prev.name.trim() === '' || prev.name === 'Sans Nom'
            if (currentNameIsEmpty) {
              return { ...prev, name: data.name.value }
            }
            return prev
          })
        }
      } catch (err) {
        console.error('Color API error:', err)
      } finally {
        setIsNaming(false)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [formData.hex_code, formData.name, isEditing])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await fetchColors()
      setColors(data)
    } catch (err) {
      toast.error('Erreur lors du chargement des couleurs: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setFormData({ id: null, name: '', hex_code: '#000000' })
    setIsEditing(true)
  }

  const handleEdit = (color) => {
    setFormData(color)
    setIsEditing(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const method = formData.id ? 'PUT' : 'POST'
    const url = `${API_URL}/api/admin/colors${formData.id ? '/' + formData.id : ''}`

    try {
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify({ name: formData.name, hex_code: formData.hex_code })
      })

      if (resp.ok) {
        setIsEditing(false)
        await loadData()
        toast.success(formData.id ? 'Couleur modifiée' : 'Couleur ajoutée')
      } else {
        const errData = await resp.json()
        toast.error(errData.message || 'Erreur serveur')
      }
    } catch (err) {
      toast.error('Erreur réseau')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const resp = await fetch(`${API_URL}/api/admin/colors/${deleteId}`, { 
        method: 'DELETE',
        headers: getAdminHeaders()
      })
      if (!resp.ok) throw new Error('Erreur')
      setDeleteId(null)
      await loadData()
      toast.success('Couleur supprimée')
    } catch (err) {
      toast.error('Erreur lors de la suppression')
    }
  }

  if (isEditing) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => setIsEditing(false)} className="text-[var(--a-text)]/30 hover:text-[var(--a-text)] text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
              ← Retour
            </button>
            <h2 className="font-display text-2xl font-bold text-[var(--a-text)]">
              {formData.id ? 'Modifier la couleur' : 'Nouvelle couleur'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] p-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--a-text)]/30">Informations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Nom (ex: Beige Sable)</label>
                <div className="relative">
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required
                    className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)] focus:border-gold/50 focus:outline-none transition-colors" />
                  {isNaming && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--a-text)]/40">Code Hexadécimal</label>
                <div className="flex gap-4">
                  <input type="color" value={formData.hex_code} onChange={e => setFormData({...formData, hex_code: e.target.value})} required
                    className="h-12 w-12 rounded-xl cursor-pointer bg-[var(--a-input)] border border-[var(--a-border-std)]" />
                  <input type="text" value={formData.hex_code} onChange={e => setFormData({...formData, hex_code: e.target.value})} required pattern="^#[0-9A-Fa-f]{6}$"
                    className="flex-1 bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl px-4 py-3 text-[var(--a-text)] focus:border-gold/50 focus:outline-none transition-colors uppercase" placeholder="#FFFFFF" />
                </div>
              </div>
            </div>

            <div className="p-5 border border-[var(--a-border-std)] rounded-xl bg-[var(--a-panel-light,var(--a-input))] flex items-center gap-4 transition-all">
              <div className="w-12 h-12 rounded-full border-2 border-[var(--a-border-std)] shadow-lg" style={{ backgroundColor: formData.hex_code }}></div>
              <div>
                <p className="text-xs font-bold text-[var(--a-text)]/30 uppercase tracking-widest mb-0.5">Aperçu</p>
                <p className="text-[var(--a-text)] font-medium">
                  {formData.name || 'Sans Nom'} 
                  <span className="opacity-30 ml-2 font-mono text-sm">({formData.hex_code})</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 text-[var(--a-text)]/40 hover:text-[var(--a-text)] text-xs font-bold uppercase tracking-widest transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 bg-gold text-charcoal rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-all disabled:opacity-50 shadow-lg shadow-gold/20">
              {isSubmitting ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--a-text)]">Palette de Couleurs</h2>
          <p className="text-[var(--a-text)]/30 text-sm mt-1">{colors.length} couleur{colors.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleNew} className="flex items-center gap-2 px-6 py-3 bg-gold text-charcoal rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold-light transition-all shadow-lg shadow-gold/20">
          <HiPlus className="w-4 h-4" /> Nouvelle
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {colors.map(color => (
          <motion.div key={color.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] p-4 hover:border-[var(--a-border-hover)] transition-all cursor-pointer overflow-hidden" onClick={() => handleEdit(color)}>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); setDeleteId(color.id); }} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-16 h-16 rounded-full border border-charcoal/10 shadow-[0_4px_15px_rgba(0,0,0,0.1)] mb-4" style={{ backgroundColor: color.hex_code }}></div>
              <h3 className="font-medium text-[var(--a-text)] text-sm text-center">{color.name}</h3>
              <p className="text-[10px] text-[var(--a-text)]/40 font-mono mt-1 uppercase">{color.hex_code}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Supprimer la couleur"
        message="Êtes-vous sûr de vouloir supprimer cette couleur ?"
      />
    </div>
  )
}
