import { motion, AnimatePresence, useMotionValue, useTransform, useScroll } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import ImageViewer from './ImageViewer'
import { useLanguage } from '../context/LanguageContext'
import StorefrontModal from './StorefrontModal'

const TRANSLATIONS = {
  FR: {
    sizeLabel: 'Sélectionner la Taille',
    colorLabel: 'Couleurs Disponibles',
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
    colorLabel: 'Available Colors',
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
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const desktopScrollRef = useRef(null)
  const mobileScrollRef = useRef(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollY = useMotionValue(0)
  const desktopImgScale = useTransform(scrollY, [0, 200], [1.1, 1])
  const desktopImgY = useTransform(scrollY, [0, 200], [0, -20])
  const desktopImgOpacity = useTransform(scrollY, [0, 150], [1, 0.6])
  const overlayOpacity = useTransform(scrollY, [0, 150], [0, 0.4])

  const { scrollYProgress } = useScroll({
    container: mobileScrollRef
  })

  // WOW Scroll Effects for Mobile
  const mobileImgScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.85])
  const mobileImgOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.4])
  const mobileImgY = useTransform(scrollYProgress, [0, 0.3], [0, -50])
  const borderRadius = useTransform(scrollYProgress, [0, 0.3], ["0px", "40px"])

  const SIZES = ['S', 'M', 'L', 'XL', 'Sur Mesure']
  const API_URL = import.meta.env.VITE_API_URL || '';

  const mainImg = product?.main_image || product?.image
  let images = []
  
  if (product?.images && product.images.length > 0) {
    images = [...product.images]
    if (mainImg && !images.includes(mainImg)) {
      images.unshift(mainImg)
    }
  } else if (mainImg) {
    images = [mainImg]
  }

  // Pre-process paths
  images = images.map(img => {
    const imgPath = typeof img === 'string' ? img : (img.path || img.image_path || '')
    return imgPath.startsWith('http') ? imgPath : `${API_URL}/uploads/${imgPath}`
  })

  useEffect(() => {
    if (isOpen && product) {
      setSelectedSize('')
      // Fixed color mapping: check for object or string
      const firstColor = product.colors?.[0]
      setSelectedColor(firstColor?.hex_code || (typeof firstColor === 'string' ? firstColor : ''))
      setCustomerName('')
      setCurrentImageIndex(0)
      setShowViewer(false)
      if (desktopScrollRef.current) desktopScrollRef.current.scrollTop = 0
      if (mobileScrollRef.current) mobileScrollRef.current.scrollTop = 0
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

  const [touchStartX, setTouchStartX] = useState(0)
  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX)
  const handleTouchEnd = (e) => {
    if (!images.length) return
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50 && images.length > 1) {
      if (diff > 0) setCurrentImageIndex(prev => (prev + 1) % images.length)
      else setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
    }
  }

  if (!product) return null

  const handleOrder = () => {
    if (!selectedSize || !customerName.trim()) {
      setIsAlertOpen(true)
      return
    }

    const priceText = typeof product.price === 'number' ? `${product.price} DH` : product.price
    const promoLine = product.promo_active && product.old_price
      ? `\n*🏷️ Promo :* ~${Number(product.old_price).toLocaleString()} DH~ → ${priceText}`
      : ''

    const message = `${T.orderHeader}\n\n` +
      `${T.orderProduct} ${t(product, 'title')}\n` +
      `${T.orderCategory} ${product.category_name || ''}\n` +
      `${T.orderPrice} ${priceText}${promoLine}\n` +
      `${T.orderSize} ${selectedSize}\n` +
      (selectedColor ? `${T.orderColor} ${selectedColor}\n` : '') +
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
          isMobile ? (
            /* ── MOBILE IMMERSIVE VIEW ── */
            <motion.div
              ref={mobileScrollRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] bg-ivory flex flex-col overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar"
            >
              <div className="sticky top-0 left-0 right-0 p-4 z-[70] flex items-center justify-between pointer-events-none mb-[-64px]">
                <button
                  onClick={onClose}
                  className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-xl rounded-full shadow-lg text-charcoal active:scale-90 transition-transform"
                >
                  <HiChevronLeft className="w-8 h-8" />
                </button>

                {/* Move Zoom Button to Top Right */}
                <div 
                  className="pointer-events-auto px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white flex items-center gap-2 border border-white/10 shadow-lg cursor-pointer active:scale-95 transition-all"
                  onClick={() => setShowViewer(true)}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  <span className="text-[10px] font-black tracking-[0.1em] uppercase">Zoom</span>
                </div>
              </div>

              <motion.div
                className="relative w-screen h-[75vh] shrink-0 overflow-hidden bg-charcoal sticky top-0"
                style={{ 
                  y: mobileImgY
                }}
                onClick={() => setShowViewer(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={images[currentImageIndex]}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    style={{ 
                      height: '100%', 
                      width: '100%', 
                      objectFit: 'cover', 
                      objectPosition: 'top' 
                    }}
                  />
                </AnimatePresence>

                {/* Mobile Thumbnails */}
                {images.length > 1 && (
                  <div
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex gap-3 p-2.5 bg-black/40 backdrop-blur-3xl rounded-[24px] border border-white/10 shadow-lg overflow-x-auto max-w-[90%] no-scrollbar"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`shrink-0 w-12 h-12 rounded-[16px] overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === i ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'
                          }`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Product Info */}
              <div className="relative -mt-10 bg-ivory rounded-t-[45px] p-8 pb-32 flex flex-col gap-8 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] border-t border-white/50">
                <div>
                  <span className="text-[10px] tracking-[0.4em] font-accent text-gold uppercase mb-2 block">{product.category_name}</span>
                  <h1 className="text-3xl font-display font-semibold text-charcoal leading-tight mb-3">
                    {t(product, 'title')}
                  </h1>
                </div>

                <div>
                  <label className="text-[10px] font-bold tracking-[0.3em] text-charcoal uppercase mb-3 block">{T.sizeLabel}</label>
                  <div className="flex flex-wrap gap-2.5">
                    {SIZES.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border-2 ${selectedSize === sz
                          ? 'bg-charcoal text-white border-charcoal shadow-lg scale-105'
                          : 'bg-white border-sand/30 text-charcoal active:bg-sand/10'
                          }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {product.colors?.length > 0 && (
                  <div>
                    <label className="text-[10px] font-bold tracking-[0.3em] text-charcoal uppercase mb-3 block">{T.colorLabel}</label>
                    <div className="flex flex-wrap gap-4">
                      {product.colors.map(color => {
                        const hex = typeof color === 'string' ? color : color.hex_code
                        return (
                          <button
                            key={color.id || hex}
                            onClick={() => setSelectedColor(hex)}
                            className={`w-11 h-11 rounded-full border-2 p-1 transition-all ${selectedColor === hex ? 'border-charcoal scale-110' : 'border-transparent'
                              }`}
                          >
                            <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: hex }} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="text-smoke text-sm leading-[1.8] font-accent opacity-80 whitespace-pre-wrap">
                  {t(product, 'description')}
                </div>

                <div>
                  <label className="text-[10px] font-bold tracking-[0.3em] text-charcoal uppercase mb-3 block">{T.nameLabel}</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={T.namePlaceholder}
                    className="w-full bg-sand/10 border-2 border-transparent focus:border-gold/30 focus:bg-white p-4 rounded-2xl text-sm transition-all focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="fixed bottom-0 left-0 right-0 p-6 pt-2 bg-white/80 backdrop-blur-2xl border-t border-sand/20 z-[60] flex items-center gap-4">
                <div className="shrink-0 px-6 py-4 bg-sand/10 rounded-2xl border border-sand/20">
                  <span className="text-[10px] text-smoke uppercase tracking-widest block leading-3">Prix</span>
                  <span className="text-xl font-bold text-charcoal">{product.price} <span className="text-xs">DH</span></span>
                </div>
                <button
                  onClick={handleOrder}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-charcoal text-white rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase shadow-xl active:bg-gold active:scale-95 transition-all"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Commander
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── DESKTOP MODAL VIEW ── */
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
                <button onClick={onClose} className="absolute top-6 right-6 z-30 p-3 bg-white/80 backdrop-blur-xl rounded-full shadow-lg hover:bg-white transition-all text-charcoal border border-charcoal/5">
                  <HiX className="w-6 h-6" />
                </button>

                <div className="md:w-1/2 bg-charcoal relative flex-shrink-0 overflow-hidden cursor-zoom-in min-h-[500px]" onClick={() => setShowViewer(true)}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      layoutId={currentImageIndex === 0 ? `prod-img-${product.id}` : undefined}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      src={images[currentImageIndex]}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ 
                        height: '100%', 
                        width: '100%', 
                        objectFit: 'cover', 
                        objectPosition: 'top',
                        scale: desktopImgScale,
                        y: desktopImgY
                      }}
                    />
                  </AnimatePresence>

                  {/* Desktop Premium Floating Thumbnails */}
                  {images.length > 1 && (
                    <div 
                      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3 p-2 bg-black/40 backdrop-blur-3xl rounded-[24px] border border-white/10 shadow-2xl transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`shrink-0 w-14 h-14 rounded-[16px] overflow-hidden border-2 transition-all duration-300 ${
                            i === currentImageIndex 
                              ? 'border-white scale-110 shadow-lg' 
                              : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div ref={desktopScrollRef} onScroll={handleScroll} className="md:w-1/2 overflow-y-auto p-12 flex flex-col bg-white modal-scrollbar">
                  <span className="font-accent text-xs tracking-[0.3em] text-gold uppercase mb-2 block">{product.category_name}</span>
                  <h2 className="font-display text-4xl font-semibold text-charcoal mb-4 leading-tight">{t(product, 'title')}</h2>

                  <div className="text-2xl text-charcoal font-bold mb-8">{product.price} DH</div>

                  <div className="prose prose-sm text-smoke mb-8 leading-relaxed whitespace-pre-wrap">
                    {t(product, 'description')}
                  </div>

                  <div className="flex flex-col gap-8 mb-8 mt-auto border-t border-sand/50 pt-8">
                    <div>
                      <label className="block font-display text-xs font-bold tracking-widest text-charcoal uppercase mb-3">{T.sizeLabel}</label>
                      <div className="flex flex-wrap gap-3">
                        {SIZES.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2.5 text-xs font-bold uppercase border-2 rounded-xl transition-all ${selectedSize === size ? 'bg-charcoal text-white border-charcoal' : 'bg-cream/30 text-charcoal border-transparent hover:border-gold/50'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {product.colors && product.colors.length > 0 && (
                      <div>
                        <label className="block font-display text-xs font-bold tracking-widest text-charcoal uppercase mb-3">{T.colorLabel}</label>
                        <div className="flex flex-wrap items-center gap-3">
                          {product.colors.map(color => {
                            const hex = typeof color === 'string' ? color : color.hex_code
                            return (
                              <button
                                key={color.id || hex}
                                onClick={() => setSelectedColor(hex)}
                                className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === hex ? 'border-charcoal scale-110 shadow-md ring-4 ring-gold/20' : 'border-transparent hover:scale-110'
                                  }`}
                                style={{ backgroundColor: hex }}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block font-display text-xs font-bold tracking-widest text-charcoal uppercase mb-3">{T.nameLabel}</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={T.namePlaceholder}
                        className="w-full bg-cream/30 border-2 border-transparent rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleOrder}
                    className="w-full flex items-center justify-center gap-2 py-5 rounded-xl bg-charcoal text-white font-bold tracking-[0.2em] uppercase text-sm transition-all hover:bg-gold shadow-xl"
                  >
                    <FaWhatsapp className="w-6 h-6" />
                    <span>{T.orderBtn}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )
        )}
      </AnimatePresence>

      <ImageViewer
        isOpen={showViewer}
        images={images}
        startIndex={currentImageIndex}
        onClose={() => setShowViewer(false)}
      />

      <StorefrontModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title={lang === 'FR' ? 'Champs incomplets' : 'Missing fields'}
        message={T.errorFields}
        type="error"
      />
    </>
  )
}
