/**
 * ProductDetails — placeholder component for the dynamic product page.
 *
 * Accepts `productData` prop shaped like:
 * {
 *   id: number,
 *   title: string,
 *   category: string,
 *   price: string,
 *   description: string,
 *   images: string[],           // array of image URLs
 *   sizes: string[],            // e.g. ['S','M','L','XL','XXL']
 *   colors: { name: string, hex: string }[],
 *   details: string[],          // bullet points
 *   whatsappNumber: string,     // e.g. '212666780147'
 * }
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export default function ProductDetails({ productData }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-smoke font-accent text-lg">Produit non trouvé</p>
      </div>
    )
  }

  const {
    title = '',
    category = '',
    price = '',
    description = '',
    images = [],
    sizes = [],
    colors = [],
    details = [],
    whatsappNumber = '212666780147',
  } = productData

  const prevImg = () => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1))
  const nextImg = () => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1))

  const handleOrder = () => {
    const parts = [`Bonjour, je souhaite commander :`, `Produit : ${title}`]
    if (selectedSize) parts.push(`Taille : ${selectedSize}`)
    if (selectedColor) parts.push(`Couleur : ${selectedColor.name}`)
    parts.push(`Prix : ${price}`)
    const msg = encodeURIComponent(parts.join('\n'))
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank')
  }

  return (
    <section className="py-16 md:py-24 bg-ivory">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* ── Left: Image carousel ── */}
          <div className="relative">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream">
              {images.length > 0 ? (
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={images[currentImage]}
                  alt={`${title} - ${currentImage + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-smoke">
                  No image
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition-all">
                    <HiChevronLeft size={20} />
                  </button>
                  <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition-all">
                    <HiChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === currentImage ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product info ── */}
          <div className="flex flex-col">
            <p className="font-accent text-sm tracking-[0.3em] text-gold uppercase mb-2">{category}</p>
            <h1 className="font-display text-3xl md:text-4xl text-charcoal font-semibold leading-tight mb-3">
              {title}
            </h1>
            <p className="font-display text-2xl text-majorelle font-semibold mb-6">{price}</p>

            <p className="text-smoke leading-relaxed mb-8">{description}</p>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-charcoal mb-3">Taille</p>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                        selectedSize === s
                          ? 'border-gold bg-gold/10 text-charcoal'
                          : 'border-sand text-smoke hover:border-gold/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-charcoal mb-3">
                  Couleur{selectedColor ? ` : ${selectedColor.name}` : ''}
                </p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setSelectedColor(c)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor?.hex === c.hex ? 'border-charcoal scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            {details.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-charcoal mb-3">Détails</p>
                <ul className="space-y-2">
                  {details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-smoke text-sm leading-relaxed">
                      <span className="text-gold mt-1">◆</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Order CTA */}
            <button
              onClick={handleOrder}
              className="mt-auto w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-base tracking-wider uppercase shadow-[0_6px_30px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_40px_rgba(34,197,94,0.5)] hover:scale-[1.01] transition-all duration-400"
            >
              <FaWhatsapp className="text-xl" />
              Commander via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
