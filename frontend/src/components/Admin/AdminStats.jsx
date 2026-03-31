import { motion } from 'framer-motion'
import { HiOutlineShoppingBag, HiOutlineTag, HiOutlinePhotograph, HiPlus } from 'react-icons/hi'

export default function AdminStats({ stats, onNavigate }) {
  const cards = [
    { 
      key: 'products', 
      label: 'Produits', 
      count: stats.products, 
      icon: HiOutlineShoppingBag,
      color: 'from-gold/20 to-amber-500/10',
      iconBg: 'bg-gold/20 text-gold',
      action: 'Ajouter un produit'
    },
    { 
      key: 'categories', 
      label: 'Catégories', 
      count: stats.categories, 
      icon: HiOutlineTag,
      color: 'from-blue-500/20 to-indigo-500/10',
      iconBg: 'bg-blue-500/20 text-blue-400',
      action: 'Ajouter une catégorie'
    },
    { 
      key: 'gallery', 
      label: 'Galerie', 
      count: stats.gallery, 
      icon: HiOutlinePhotograph,
      color: 'from-emerald-500/20 to-green-500/10',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      action: 'Ajouter des images'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--a-text)] mb-2">
          Bienvenue, Aziz
        </h1>
        <p className="text-[var(--a-text)]/40 text-sm">
          Gérez votre boutique depuis ce tableau de bord.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} border border-[var(--a-border)] p-6 group hover:border-[var(--a-border-hover)] transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`p-3 rounded-xl ${card.iconBg}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className="font-display text-4xl font-bold text-[var(--a-text)]/90">{card.count}</span>
            </div>
            
            <h3 className="text-sm font-bold text-[var(--a-text)]/60 uppercase tracking-widest mb-4">{card.label}</h3>
            
            <button
              onClick={() => onNavigate(card.key)}
              className="flex items-center gap-2 text-xs text-[var(--a-text)]/40 hover:text-gold transition-colors uppercase tracking-widest font-bold"
            >
              <HiPlus className="w-4 h-4" />
              {card.action}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Quick info */}
      <div className="rounded-2xl bg-[var(--a-panel)] border border-[var(--a-border)] p-8">
        <h3 className="font-display text-lg font-bold text-[var(--a-text)]/80 mb-4">Informations Boutique</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-[var(--a-text)]/30 uppercase tracking-widest text-[10px] font-bold mb-2">Adresse</p>
            <p className="text-[var(--a-text)]/60">Dar Pacha, Arset Aouzal</p>
            <p className="text-[var(--a-text)]/40">Marrakech 40030</p>
          </div>
          <div>
            <p className="text-[var(--a-text)]/30 uppercase tracking-widest text-[10px] font-bold mb-2">Horaires</p>
            <p className="text-[var(--a-text)]/60">Tous les jours</p>
            <p className="text-[var(--a-text)]/40">10h00 – 22h00</p>
          </div>
          <div>
            <p className="text-[var(--a-text)]/30 uppercase tracking-widest text-[10px] font-bold mb-2">Contact</p>
            <p className="text-[var(--a-text)]/60">+212 666 780 147</p>
            <p className="text-[var(--a-text)]/40">WhatsApp disponible</p>
          </div>
        </div>
      </div>
    </div>
  )
}
