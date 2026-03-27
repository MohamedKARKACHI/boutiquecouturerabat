import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import ImageViewer from './ImageViewer'
import { useLanguage } from '../context/LanguageContext'

const TRANSLATIONS = {
  FR: {
    sizeLabel: 'Sélectionner la Taille',
    colorLabel: 'Couleur du Modèle',
    nameLabel: 'Votre Nom Complet',
    namePlaceholder: 'Saisissez votre nom...',
    orderBtn: "Commander l'article",
    paymentNote: 'Paiement à la livraison ou virement',
    errorFields: 'Veuillez remplir votre nom et choisir une taille.',
    orderHeader: '*NOUVELLE COMMANDE* 🛍️',
    orderProduct: '*Produit :*',
    orderCategory: '*Catégorie :*',
    orderPrice: '*Prix :*',
    orderSize: '*Taille :*',
    orderColor: '*Couleur (Code Hex) :*',
    orderClient: '*Client :*',
    orderFooter: 'Je souhaite valider cette commande.'
  },
  EN: {
    sizeLabel: 'Select Size',
    colorLabel: 'Model Color',
    nameLabel: 'Your Full Name',
    namePlaceholder: 'Enter your name...',
    orderBtn: 'Order Item',
    paymentNote: 'Payment on delivery or bank transfer',
    errorFields: 'Please fill in your name and choose a size.',
    orderHeader: '*NEW ORDER* 🛍️',
    orderProduct: '*Product:*',
    orderCategory: '*Category:*',
    orderPrice: '*Price:*',
    orderSize: '*Size:*',
    orderColor: '*Color (Hex Code):*',
    orderClient: '*Client:*',
    orderFooter: 'I would like to confirm this order.'
  }
}

export default function ProductModal({ isOpen, product, onClose }) {
  const { lang, t } = useLanguage()
  const T = TRANSLATIONS[lang]
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showViewer, setShowViewer] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mobile scroll animation: image shrinks as you scroll down
  const scrollY = useMotionValue(0)
  const imageHeight = useTransform(scrollY, [0, 200], ['40vh', '20vh'])
  const imageOpacity = useTransform(scrollY, [0, 150], [1, 0.85])

  const SIZES = ['S', 'M', 'L', 'XL', 'Sur Mesure']

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  let images = []
  if (product?.images && product.images.length > 0) {
    images = product.images.map(img => img.startsWith('http') ? img : `/uploads/${img}`)
  } else if (product?.main_image || product?.image) {
    const mainImg = product.main_image || product.image
    images = [mainImg.startsWith('http') ? mainImg : `/uploads/${mainImg}`]
  }

  useEffect(() => {
    if (isOpen && product) {
      setSelectedSize('')
      setSelectedColor(product.colors?.[0] || '')
      setCustomerName('')
      setCurrentImageIndex(0)
      setShowViewer(false)
      if (scrollRef.current) scrollRef.current.scrollTop = 0
      scrollY.set(0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen, product])

  const handleScroll = useCallback((e) => {
    scrollY.set(e.target.scrollTop)
  }, [scrollY])

  // Touch swipe for gallery
  const [touchStartX, setTouchStartX] = useState(0)
  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX)
  const handleTouchEnd = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50 && images.length > 1) {
      if (diff > 0) setCurrentImageIndex(prev => (prev + 1) % images.length)
      else setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
    }
  }

  if (!product) return null

  const handleOrder = () => {
    if (!selectedSize || !customerName.trim()) {
      alert(T.errorFields)
      return
    }

    const priceText = typeof product.price === 'number'
      ? `${product.price} DH`
      : product.price

    const message = `${T.orderHeader}\n\n` +
      `${T.orderProduct} ${t(product, 'title')}\n` +
      `${T.orderCategory} ${product.category_name || ''}\n` +
      `${T.orderPrice} ${priceText}\n` +
      `${T.orderSize} ${selectedSize}\n` +
      (product.colors?.length > 0 ? `${T.orderColor} ${selectedColor}\n` : '') +
      `${T.orderClient} ${customerName.trim()}\n\n` +
      `${T.orderFooter}`

    const url = `https://wa.me/212666780147?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-ivory rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 md:top-6 md:right-6 z-10 p-2 md:p-3 bg-white/80 backdrop-blur-xl rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all text-charcoal"
              >
                <HiX className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* ═══ Left Image Gallery ═══ */}
              <motion.div
                className="md:w-1/2 bg-cream relative flex-shrink-0 overflow-hidden cursor-pointer"
                style={isMobile ? { height: imageHeight } : {}}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 z-10 pointer-events-none" />

                {/* Gallery Main Image */}
                <div
                  className="relative w-full h-full"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => setShowViewer(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={images[currentImageIndex]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      style={isMobile ? { opacity: imageOpacity } : {}}
                    />
                  </AnimatePresence>

                  {/* Zoom hint */}
                  <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[9px] tracking-widest uppercase font-semibold flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Zoom
                  </div>
                </div>

                {/* Desktop Nav Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length) }}
                      className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/60 hover:bg-white/90 backdrop-blur-lg rounded-full shadow-md transition-all text-charcoal"
                    >
                      <HiChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % images.length) }}
                      className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/60 hover:bg-white/90 backdrop-blur-lg rounded-full shadow-md transition-all text-charcoal"
                    >
                      <HiChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Dot Indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i) }}
                        className={`rounded-full transition-all ${
                          i === currentImageIndex
                            ? 'w-6 h-2 bg-white shadow-md'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Thumbnail Strip (desktop) */}
                {images.length > 1 && (
                  <div className="hidden md:flex absolute bottom-4 left-4 z-20 gap-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i) }}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                          i === currentImageIndex ? 'border-white shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* ═══ Right Details (scrollable with custom scrollbar) ═══ */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="md:w-1/2 overflow-y-auto p-6 md:p-10 lg:p-12 flex flex-col bg-white modal-scrollbar"
              >
                <span className="font-accent text-[10px] md:text-xs tracking-[0.3em] text-gold uppercase mb-2 block">
                  {product.category_name}
                </span>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-charcoal mb-2 leading-tight">
                  {t(product, 'title')}
                </h2>
                <p className="text-lg md:text-xl text-gold-dark font-medium mb-6 md:mb-8">
                  {product.price} {typeof product.price === 'number' ? 'DH' : ''}
                </p>

                <div className="prose prose-sm text-smoke mb-8 leading-relaxed">
                  <p>
                    {t(product, 'description')}
                  </p>
                </div>

                {/* Form Option Container */}
                <div className="flex flex-col gap-6 md:gap-8 mb-8 mt-auto border-t border-sand/50 pt-8">
                  {/* Size Choice */}
                  <div>
                    <label className="block font-display text-xs md:text-sm font-bold tracking-widest text-charcoal uppercase mb-3">
                      {T.sizeLabel}
                    </label>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {SIZES.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2.5 text-xs font-bold tracking-widest uppercase border-2 rounded-xl transition-all ${
                            selectedSize === size
                              ? 'bg-charcoal text-white border-charcoal shadow-md'
                              : 'bg-cream/30 text-charcoal border-transparent hover:border-gold/50 hover:bg-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors Choice */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <label className="block font-display text-xs md:text-sm font-bold tracking-widest text-charcoal uppercase mb-3">
                        {T.colorLabel}
                      </label>
                      <div className="flex items-center gap-3 md:gap-4 p-1">
                        {product.colors.map(hex => (
                          <button
                            key={hex}
                            onClick={() => setSelectedColor(hex)}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                              selectedColor === hex ? 'border-charcoal scale-110 shadow-md ring-4 ring-gold/20' : 'border-transparent hover:scale-110 shadow-sm'
                            }`}
                            style={{ backgroundColor: hex }}
                          >
                            {selectedColor === hex && (
                              <span className="flex items-center justify-center h-full w-full">
                                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Name Capture */}
                  <div>
                    <label className="block font-display text-xs md:text-sm font-bold tracking-widest text-charcoal uppercase mb-3">
                      {T.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={T.namePlaceholder}
                      className="w-full bg-cream/30 border-2 border-transparent hover:border-sand rounded-xl py-3.5 px-5 text-sm md:text-base font-medium text-charcoal placeholder:text-smoke/60 focus:outline-none focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10 transition-all"
                    />
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={handleOrder}
                  className="w-full flex items-center justify-center gap-2 py-4 md:py-5 rounded-xl bg-charcoal text-white font-bold tracking-[0.2em] uppercase text-xs md:text-sm transition-all hover:bg-gold hover:shadow-[0_4px_20px_rgba(212,168,67,0.3)] hover:-translate-y-1"
                >
                  <FaWhatsapp className="w-5 h-5 md:w-6 md:h-6" />
                  <span>{T.orderBtn}</span>
                </button>

                <p className="text-center text-[10px] md:text-xs text-smoke mt-4 uppercase tracking-widest">
                  {T.paymentNote}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Viewer */}
      <ImageViewer
        isOpen={showViewer}
        images={images}
        startIndex={currentImageIndex}
        onClose={() => setShowViewer(false)}
      />
    </>
  )
}
