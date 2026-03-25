import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import ProductModal from './ProductModal'

import slideBg from '../assets/slide1.jpg'
import caftansImg from '../assets/caftans.png'
import djellImg from '../assets/djellabas.png'
import gandImg from '../assets/gandouras.png'
import accImg from '../assets/accessories.png'
import gallery1 from '../assets/gallery1.png'
import gallery2 from '../assets/gallery2.png'
import gallery3 from '../assets/gallery3.png'
import slide3 from '../assets/slide3.jpg'
import slide4 from '../assets/slide4.jpg'
import slide5 from '../assets/slide5.jpg'

const COLLECTIONS = [
  { id: 1, title: 'Haute Couture Caftans', subtitle: 'Majestic elegance', image: caftansImg, images: [caftansImg, slide3, gallery1], price: 'À partir de 3,500 DH', colors: ['#0D6B4B', '#D4A843', '#1A2980'] },
  { id: 2, title: 'Modern Djellabas', subtitle: 'Contemporary tradition', image: djellImg, images: [djellImg, slide4, gallery2], price: 'À partir de 1,800 DH', colors: ['#E8DDD0', '#C75B39', '#1C1C1E'] },
  { id: 3, title: 'Elegant Gandouras', subtitle: 'Refined simplicity', image: gandImg, images: [gandImg, slide5, gallery3], price: 'À partir de 1,200 DH', colors: ['#0D6B4B', '#1C1C1E'] },
  { id: 4, title: 'Accessories', subtitle: 'Finishing touches', image: accImg, images: [accImg], price: 'À partir de 300 DH', colors: ['#D4A843', '#1C1C1E', '#E8DDD0'] },
]

function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
  )
}

export default function Categories() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [selectedProduct, setSelectedProduct] = useState(null)

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
          <p className="font-accent text-sm tracking-[0.4em] text-gold uppercase mb-2">Our Collections</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal font-semibold mb-4">
            Nos <span className="italic text-gold-dark">Créations</span>
          </h2>
          <div className="ornament"><span className="text-gold">◆</span></div>
          <p className="font-accent text-base md:text-lg text-smoke mt-4 max-w-lg mx-auto leading-relaxed">
            Chaque pièce est une œuvre d'art, confectionnée avec passion et savoir-faire
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
          {COLLECTIONS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-gold/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:border-gold/30 hover:shadow-[0_20px_40px_rgba(212,168,67,0.15)] transition-all duration-500"
            >
              {/* Image Container */}
              <div 
                className="w-full shrink-0 relative aspect-[4/5] overflow-hidden cursor-pointer"
                onClick={() => setSelectedProduct(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col flex-1 p-3 pt-0 md:p-5 md:pt-0 lg:p-6 lg:pt-0 relative z-10">
                <div className="mb-auto">
                  <p className="font-accent text-[9px] md:text-[11px] tracking-[0.25em] text-gold-dark/70 uppercase mb-1.5 md:mb-2 line-clamp-1">
                    {item.subtitle}
                  </p>
                  <h3 className="font-display text-sm sm:text-lg md:text-xl text-charcoal font-semibold leading-snug mb-2 md:mb-3 text-balance">
                    {item.title}
                  </h3>
                  <p className="text-gold-dark text-xs sm:text-sm font-medium">{item.price}</p>
                  {item.colors && item.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 md:mt-3">
                      {item.colors.map(hex => (
                        <div key={hex} className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: hex }} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 md:mt-5">
                  <button
                    onClick={() => setSelectedProduct(item)}
                    className="w-full flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3 rounded-xl border-2 border-charcoal/80 text-charcoal text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:border-gold hover:bg-gold hover:text-white hover:shadow-[0_4px_15px_rgba(212,168,67,0.3)]"
                  >
                    <span>Découvrir</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProductModal 
        isOpen={!!selectedProduct} 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  )
}
