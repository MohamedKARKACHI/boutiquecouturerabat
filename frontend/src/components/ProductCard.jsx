import { motion } from 'framer-motion'

export default function ProductCard({ product: p, t, lang, T, API_URL, onDiscover }) {
  const imagePath = p?.main_image || p?.image
  const imageUrl = imagePath?.startsWith('http') 
    ? imagePath 
    : `${API_URL}/uploads/${imagePath}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gold/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:border-gold/30 hover:shadow-[0_20px_40px_rgba(212,168,67,0.15)] transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Container (Fixed 4:5 Aspect Ratio) */}
      <div 
        className="w-full relative aspect-[4/5] overflow-hidden cursor-pointer"
        onClick={() => onDiscover(p)}
      >
        <img
          src={imageUrl}
          alt={p ? t(p, 'title') : ''}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
        
        {/* Badges */}
        {p && !p.in_stock && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-charcoal/90 text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded-md backdrop-blur-sm">
              {T.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Text Area with improved spacing (Smart Space) */}
      <div className="text-center px-2 sm:px-4 pt-7 sm:pt-8 flex flex-col flex-1">
        <p className="font-accent text-[9px] sm:text-[11px] tracking-[0.25em] text-gold uppercase mb-2 sm:mb-2.5">
          {p ? (p[`category_name${lang === 'EN' ? '_en' : ''}`] || p.category_name) : ''}
        </p>
        <h4 className="font-display text-base sm:text-lg text-charcoal font-semibold mb-1.5 line-clamp-1">
          {p ? t(p, 'title') : ''}
        </h4>
        
        {p && p.promo_active && p.old_price ? (
          <div className="flex items-center justify-center gap-2.5 mb-2 sm:mb-3">
            <span className="text-smoke/60 text-xs line-through decoration-smoke/40 decoration-[1.5px] font-medium">
              {Number(p.old_price).toLocaleString()} <span className="text-[10px]">DH</span>
            </span>
            <span className="text-charcoal text-sm sm:text-base font-bold">
              {Number(p.price).toLocaleString()} <span className="text-xs">DH</span>
            </span>
          </div>
        ) : (
          <p className="text-smoke text-xs sm:text-sm font-medium mb-2 sm:mb-3">
            {p ? Number(p.price).toLocaleString() : ''} DH
          </p>
        )}

        {/* Color Variants */}
        {p && p.colors && p.colors.length > 0 && p.colors[0] !== null && (
          <div className="flex items-center justify-center gap-1.5 mb-4 sm:mb-5">
            {p.colors.map((hex, idx) => (
              <div 
                key={idx} 
                className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => onDiscover(p)}
          className="mt-auto w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 md:py-3 rounded-xl border-2 border-charcoal/80 text-charcoal text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:border-gold hover:bg-gold hover:text-white hover:shadow-[0_4px_15_rgba(212,168,67,0.3)]"
        >
          <span>{T.discover}</span>
        </button>
      </div>
    </motion.div>
  )
}
