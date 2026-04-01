import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineSave, HiCheckCircle } from 'react-icons/hi'
import { fetchSettings, getAdminHeaders } from '../../api'

const API_URL = import.meta.env.VITE_API_URL || '';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await fetchSettings()
      setSettings(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      const resp = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders()
        },
        body: JSON.stringify({ settings })
      })
      if (resp.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const sections = [
    {
      title: 'Informations de Contact',
      keys: [
        { id: 'contact_phone', label: 'Téléphone', type: 'text' },
        { id: 'whatsapp_number', label: 'WhatsApp (sans +)', type: 'text' },
        { id: 'contact_email', label: 'Email', type: 'email' },
      ]
    },
    {
      title: 'Adresses',
      keys: [
        { id: 'contact_address_fr', label: 'Adresse (FR)', type: 'textarea' },
        { id: 'contact_address_en', label: 'Address (EN)', type: 'textarea' },
        { id: 'google_maps_url', label: 'URL Google Maps (Embed)', type: 'textarea' },
      ]
    },
    {
      title: 'Horaires d\'ouverture',
      keys: [
        { id: 'opening_hours_fr', label: 'Horaires (FR)', type: 'text' },
        { id: 'opening_hours_en', label: 'Hours (EN)', type: 'text' },
      ]
    }
  ]

  if (loading) return <div className="animate-pulse space-y-4 pt-12"><div className="h-8 bg-[var(--a-input)] rounded w-1/4" /><div className="h-48 bg-[var(--a-input)] rounded w-full" /></div>

  return (
    <div className="max-w-4xl space-y-12 pb-24">
      <div className="flex items-center justify-between sticky top-0 bg-[var(--a-bg)]/80 backdrop-blur-md z-10 py-6 border-b border-[var(--a-border)]">
        <div>
          <h2 className="text-2xl font-display font-bold text-[var(--a-text)]">Paramètres Globaux</h2>
          <p className="text-sm text-[var(--a-text)]/40">Modifiez les informations de contact et sociales du site</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gold text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gold/20"
        >
          {saving ? 'Enregistrement...' : success ? <><HiCheckCircle className="w-4 h-4" /> Enregistré</> : <><HiOutlineSave className="w-4 h-4" /> Enregistrer</>}
        </button>
      </div>

      <div className="space-y-10">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{section.title}</h3>
            <div className="grid grid-cols-1 gap-6 bg-[var(--a-input)] p-8 rounded-3xl border border-[var(--a-border)]">
              {section.keys.map(field => (
                <div key={field.id} className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--a-text)]/30">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      value={settings[field.id] || ''} 
                      onChange={e => handleChange(field.id, e.target.value)}
                      className="w-full bg-[var(--a-bg)] border border-[var(--a-border)] rounded-xl p-4 text-sm text-[var(--a-text)] focus:border-gold/50 transition-colors h-24"
                    />
                  ) : (
                    <input 
                      type={field.type}
                      value={settings[field.id] || ''} 
                      onChange={e => handleChange(field.id, e.target.value)}
                      className="w-full bg-[var(--a-bg)] border border-[var(--a-border)] rounded-xl p-4 text-sm text-[var(--a-text)] focus:border-gold/50 transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
