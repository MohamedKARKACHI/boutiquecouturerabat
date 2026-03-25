import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiOutlineHome, HiOutlineShoppingBag } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

const NAV_LINKS = [
  { id: 'hero', label: 'Accueil', page: 'home' },
  { id: 'collection', label: 'Boutique', page: 'collection' },
  { id: 'surmesure', label: 'Sur-Mesure', page: 'home' },
  { id: 'gallery', label: 'Galerie', page: 'home' },
  { id: 'contact', label: 'Contact', page: 'home' },
]

export default function Navbar({ currentPage, setCurrentPage }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lang, setLang] = useState('FR')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const handleNav = (link) => {
    setOpen(false)
    if (link.page === 'collection') {
      setCurrentPage('collection')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (currentPage !== 'home') {
        setCurrentPage('home')
        setTimeout(() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }), 100)
      } else {
        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* ── Top Navbar (Desktop & Mobile Logo) ── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || currentPage !== 'home'
            ? 'bg-charcoal/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(212,168,67,0.12)] border-b border-gold/10'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container flex items-center justify-center md:justify-between h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={() => handleNav(NAV_LINKS[0])} 
            className="flex flex-col leading-none text-center md:text-left"
          >
            <span className="font-display text-base md:text-lg font-bold tracking-[0.18em] text-gold">
              BOUTIQUE COUTURE
            </span>
            <span className="font-accent text-[9px] md:text-[10px] tracking-[0.3em] text-gold-light/60 mt-px">
              RABAT
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((l) => {
              const isActive = l.page === 'collection' ? currentPage === 'collection' : false
              
              return (
                <button
                  key={l.id}
                  onClick={() => handleNav(l)}
                  className={`relative text-[13px] font-medium tracking-wider transition-colors group ${
                    isActive ? 'text-gold' : 'text-ivory/70 hover:text-gold'
                  }`}
                >
                  {l.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              )
            })}
            <button
              onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')}
              className="ml-2 px-3 py-1 text-[11px] tracking-widest border border-gold/30 text-gold rounded-full hover:bg-gold/10 transition-all"
            >
              {lang}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Floating Bottom App Bar ── */}
      <div className="md:hidden fixed bottom-6 inset-x-4 z-[60]">
        <div className="bg-charcoal/95 backdrop-blur-2xl border border-gold/20 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center justify-around py-3 px-2">
          
          <button 
            onClick={() => handleNav({ id: 'hero', page: 'home' })}
            className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'home' && !open ? 'text-gold' : 'text-ivory/50'} hover:text-gold`}
          >
            <HiOutlineHome className="w-5 h-5 mb-0.5" />
            <span className="text-[8px] tracking-widest uppercase font-semibold">Accueil</span>
          </button>

          <button 
            onClick={() => handleNav({ id: 'collection', page: 'collection' })}
            className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'collection' && !open ? 'text-gold' : 'text-ivory/50'} hover:text-gold`}
          >
            <HiOutlineShoppingBag className="w-5 h-5 mb-0.5" />
            <span className="text-[8px] tracking-widest uppercase font-semibold">Boutique</span>
          </button>

          <a 
            href="https://wa.me/212666780147"
            target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 transition-colors text-ivory/50 hover:text-green-500"
          >
            <FaWhatsapp className="w-5 h-5 mb-0.5" />
            <span className="text-[8px] tracking-widest uppercase font-semibold">Contact</span>
          </a>

          <button 
            onClick={() => setOpen(!open)}
            className={`flex flex-col items-center gap-1 transition-colors ${open ? 'text-gold' : 'text-ivory/50'} hover:text-gold`}
          >
            {open ? <HiX className="w-5 h-5 mb-0.5" /> : <HiMenu className="w-5 h-5 mb-0.5" />}
            <span className="text-[8px] tracking-widest uppercase font-semibold">Menu</span>
          </button>

        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="md:hidden fixed inset-0 z-40 bg-charcoal/98 backdrop-blur-2xl flex flex-col justify-center items-center pb-20"
          >
            <div className="section-container flex flex-col items-center space-y-8 w-full">
              {NAV_LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleNav(l)}
                  className="block text-center text-3xl font-display tracking-widest text-ivory/90 hover:text-gold transition-colors"
                >
                  {l.label}
                </motion.button>
              ))}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-8"
              >
                <button
                  onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')}
                  className="px-6 py-2.5 text-xs font-bold tracking-[0.2em] border border-gold/30 text-gold rounded-full uppercase hover:bg-gold/10 transition-all"
                >
                  {lang === 'FR' ? '🇫🇷 Français' : '🇬🇧 English'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
