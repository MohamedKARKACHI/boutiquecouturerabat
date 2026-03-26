import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import Ornament from './Ornament'

import gallery1 from '../assets/gallery1.png'
import gallery2 from '../assets/gallery2.png'
import gallery3 from '../assets/gallery3.png'
import gallery4 from '../assets/gallery4.png'
import gallery5 from '../assets/gallery5.png'
import gallery6 from '../assets/gallery6.png'

/* ── Data constant ── */
const GALLERY_ITEMS = [
  { id: 1, src: gallery1, alt: 'Broderie artisanale' },
  { id: 2, src: gallery2, alt: 'Maître tailleur au travail' },
  { id: 3, src: gallery3, alt: 'Caftan de luxe' },
  { id: 4, src: gallery4, alt: 'Collection exposée' },
  { id: 5, src: gallery5, alt: 'Djellaba moderne' },
  { id: 6, src: gallery6, alt: 'Tissus précieux' },
]

export default function Gallery() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [lightbox, setLightbox] = useState(null)

  const close = () => setLightbox(null)
  const prev = () => setLightbox((p) => (p === 0 ? GALLERY_ITEMS.length - 1 : p - 1))
  const next = () => setLightbox((p) => (p === GALLERY_ITEMS.length - 1 ? 0 : p + 1))

  return (
    <section id="gallery" className="py-16 md:py-24 bg-ivory zellige-pattern">
      <div className="section-container relative z-10">
        {/* ── Header ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-accent text-sm tracking-[0.4em] text-gold uppercase mb-2">Portfolio</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal font-semibold mb-4">
            Notre <span className="italic text-majorelle">Galerie</span>
          </h2>
          <Ornament icon="◆" />
        </motion.div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {GALLERY_ITEMS.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative aspect-[4/3] overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group"
              onClick={() => setLightbox(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-all duration-400 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-gold/20 backdrop-blur-md border border-gold/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Caption slide-up */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-charcoal/80 to-transparent p-2 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                <p className="text-ivory/90 text-[10px] md:text-sm font-medium leading-tight">{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={close}
          >
            <button onClick={close} className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-ivory/10 border border-ivory/20 flex items-center justify-center text-ivory hover:bg-ivory/20 transition-all">
              <HiX size={22} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-3 md:left-8 z-10 w-11 h-11 rounded-full bg-ivory/10 border border-ivory/20 flex items-center justify-center text-ivory hover:bg-ivory/20 transition-all">
              <HiChevronLeft size={24} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-3 md:right-8 z-10 w-11 h-11 rounded-full bg-ivory/10 border border-ivory/20 flex items-center justify-center text-ivory hover:bg-ivory/20 transition-all">
              <HiChevronRight size={24} />
            </button>

            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              src={GALLERY_ITEMS[lightbox].src}
              alt={GALLERY_ITEMS[lightbox].alt}
              className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Bottom info */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
              <p className="text-ivory/40 text-sm font-accent tracking-widest">
                {lightbox + 1} / {GALLERY_ITEMS.length}
              </p>
              <a
                href={`https://wa.me/212666780147?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par cette pièce (image ${lightbox + 1}). Est-elle disponible ?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald/90 hover:bg-emerald text-ivory text-xs font-semibold tracking-wide transition-all shadow-lg"
              >
                Commander cette pièce
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
