import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Ornament from './Ornament'
import { fetchCategories } from '../api'
import { useLanguage } from '../context/LanguageContext'

import slideBg from '../assets/slide1.jpg'

const API_URL = import.meta.env.VITE_API_URL || '';

const TRANSLATIONS = {
  FR: {
    badge: 'Nos Collections De Luxe',
    title: <>Caftan & <span className="italic text-gold">Haute Couture</span></>,
    sub: 'Une collection exclusive de caftans marocains et djellabas haut de gamme.',
    discover: 'Découvrir'
  },
  EN: {
    badge: 'Our Luxury Collections',
    title: <>Caftan & <span className="italic text-gold">Haute Couture</span></>,
    sub: 'An exclusive collection of premium Moroccan caftans and luxury djellabas.',
    discover: 'Discover'
  }
}

export default function Categories() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const T = TRANSLATIONS[lang]

  useEffect(() => {
    fetchCategories()
      .then(data => { setCollections(data); setLoading(false) })
      .catch(err => { console.error('Error fetching categories:', err); setLoading(false) })
  }, [])

  return (
    <section id="categories" className="relative py-16 md:py-24 overflow-hidden bg-ivory">
      {/* ── Parallax Background Responsive Switch ── */}
      <div
        className="absolute inset-0 w-full h-full bg-fixed bg-cover bg-top opacity-15 mix-blend-multiply block md:hidden"
        style={{ backgroundImage: `url(${slideBg})` }}
      />
      <div
        className="absolute inset-0 w-full h-full bg-fixed bg-cover bg-center opacity-15 mix-blend-multiply hidden md:block"
        style={{ backgroundImage: `url(${slideBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-ivory/90 to-ivory z-0" />

      <div className="section-container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-accent text-sm tracking-[0.4em] text-gold uppercase mb-2">{T.badge}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal font-semibold mb-4">
            {T.title}
          </h2>
          <Ornament />
          <p className="font-accent text-base md:text-lg text-smoke max-w-xl mx-auto leading-relaxed">
            {T.sub}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
          {loading ? (
            // Skeleton placeholders
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-gold/10 animate-pulse">
                <div className="w-full aspect-[4/5] bg-cream" />
                <div className="p-3 md:p-5 lg:p-6">
                  <div className="h-3 w-16 bg-sand/60 rounded mb-3" />
                  <div className="h-5 w-3/4 bg-sand/60 rounded mb-2" />
                  <div className="h-3 w-full bg-sand/40 rounded mb-6" />
                  <div className="h-10 w-full bg-sand/30 rounded-xl" />
                </div>
              </div>
            ))
          ) : (
            collections.map((item, i) => (
              <CategoryCard 
                key={item.id} 
                item={item} 
                i={i} 
                inView={inView} 
                t={t} 
                navigate={navigate} 
                API_URL={API_URL} 
                T={T} 
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ item, i, inView, t, navigate, API_URL, T }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  
  const mainImg = item?.image
  let categoryImages = []
  
  if (item && item.images && item.images.length > 0) {
    categoryImages = [...item.images]
    if (mainImg && !categoryImages.includes(mainImg)) {
      categoryImages.unshift(mainImg)
    }
  } else if (item) {
    categoryImages = [mainImg]
  }

  const currentImage = categoryImages[currentImgIndex]
  const imageUrl = currentImage?.startsWith('http')
    ? currentImage
    : `${API_URL}/uploads/${currentImage}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.12 }}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-gold/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:border-gold/30 hover:shadow-[0_20px_40px_rgba(212,168,67,0.15)] transition-all duration-500"
    >
      {/* Image Container */}
      <div
        className="w-full shrink-0 relative aspect-[4/5] overflow-hidden cursor-pointer bg-charcoal"
        onClick={() => navigate(`/shop?category=${encodeURIComponent(item.name)}`)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={imageUrl}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        </AnimatePresence>

        {/* Premium Thumbnail Bar Overlay */}
        {categoryImages.length > 1 && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 p-1.5 bg-black/40 backdrop-blur-2xl rounded-[18px] border border-white/10 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {categoryImages.map((img, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setCurrentImgIndex(idx)}
                onClick={() => setCurrentImgIndex(idx)}
                className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-[12px] overflow-hidden border-2 transition-all duration-300 ${
                  currentImgIndex === idx 
                    ? 'border-white scale-110 shadow-lg' 
                    : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img 
                  src={img.startsWith('http') ? img : `${API_URL}/uploads/${img}`} 
                  className="w-full h-full object-cover" 
                  alt=""
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Text Container with Spacing fix */}
      <div className="flex flex-col flex-1 p-3 pt-6 md:p-5 md:pt-8 lg:p-6 lg:pt-8 relative z-10 text-center">
        <div className="mb-auto">
          <p className="font-accent text-[9px] md:text-[11px] tracking-[0.25em] text-gold-dark/70 uppercase mb-1.5 md:mb-2 line-clamp-1">
            {item.name}
          </p>
          <h3 className="font-display text-xl md:text-2xl text-charcoal font-semibold mb-2 group-hover:text-gold transition-colors">
            {t(item, 'name')}
          </h3>
          <p className="text-sm text-smoke line-clamp-2 mb-6">
            {t(item, 'description')}
          </p>
        </div>

        <div className="mt-3 md:mt-5">
          <button
            onClick={() => navigate(`/shop?category=${encodeURIComponent(item.name)}`)}
            className="w-full flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 rounded-xl border-2 border-charcoal/80 text-charcoal text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:border-gold hover:bg-gold hover:text-white hover:shadow-[0_4px_15_rgba(212,168,67,0.3)]"
          >
            <span>{T.discover}</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
