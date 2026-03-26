import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineHome, HiOutlineShoppingBag, HiMenu, HiX } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const getNavLinks = (lang) => [
  { id: 'hero', label: lang === 'FR' ? 'Accueil' : 'Home', path: '/', isSection: true },
  { id: 'shop', label: lang === 'FR' ? 'Boutique' : 'Shop', path: '/shop' },
  { id: 'surmesure', label: lang === 'FR' ? 'Sur-Mesure' : 'Custom', path: '/', isSection: true },
  { id: 'gallery', label: lang === 'FR' ? 'Galerie' : 'Gallery', path: '/', isSection: true },
  { id: 'contact', label: lang === 'FR' ? 'Contact' : 'Contact', path: '/', isSection: true },
]

export default function Navbar() {
  const { lang, toggleLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const NAV_LINKS = getNavLinks(lang)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [open])

  const handleSectionClick = (id) => {
    setOpen(false)
    if (location.pathname !== '/') return // Router will handle path change
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || location.pathname !== '/'
            ? 'bg-charcoal/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(212,168,67,0.12)] border-b border-gold/10'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container flex items-center justify-center md:justify-between h-16 md:h-20">
          <Link 
            to="/" 
            className="flex flex-col leading-none text-center md:text-left"
            onClick={() => setOpen(false)}
          >
            <span className="font-display text-base md:text-lg font-bold tracking-[0.18em] text-gold">
              BOUTIQUE COUTURE
            </span>
            <span className="font-accent text-[9px] md:text-[10px] tracking-[0.3em] text-gold-light/60 mt-px">
              RABAT
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((l) => {
              const isActive = location.pathname === l.path && !l.isSection
              
              if (l.isSection && location.pathname === '/') {
                return (
                  <button
                    key={l.id}
                    onClick={() => handleSectionClick(l.id)}
                    className="relative text-[13px] font-medium tracking-wider transition-colors text-ivory/70 hover:text-gold group"
                  >
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 w-0 group-hover:w-full" />
                  </button>
                )
              }

              return (
                <Link
                  key={l.id}
                  to={l.path}
                  className={`relative text-[13px] font-medium tracking-wider transition-colors group ${
                    isActive ? 'text-gold' : 'text-ivory/70 hover:text-gold'
                  }`}
                >
                  {l.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )
            })}
            <button
              onClick={toggleLang}
              className="ml-2 px-3 py-1 text-[11px] tracking-widest border border-gold/30 text-gold rounded-full hover:bg-gold/10 transition-all font-bold"
            >
              {lang}
            </button>
          </div>
        </div>
      </motion.nav>

      <div className="md:hidden fixed bottom-6 inset-x-4 z-[60]">
        <div className="bg-charcoal/95 backdrop-blur-2xl border border-gold/20 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center justify-around py-3 px-2">
          
          <Link 
            to="/"
            className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/' ? 'text-gold' : 'text-ivory/50'} hover:text-gold`}
          >
            <HiOutlineHome className="w-5 h-5 mb-0.5" />
            <span className="text-[8px] tracking-widest uppercase font-semibold">{lang === 'FR' ? 'Accueil' : 'Home'}</span>
          </Link>

          <Link 
            to="/shop"
            className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/shop' ? 'text-gold' : 'text-ivory/50'} hover:text-gold`}
          >
            <HiOutlineShoppingBag className="w-5 h-5 mb-0.5" />
            <span className="text-[8px] tracking-widest uppercase font-semibold">{lang === 'FR' ? 'Boutique' : 'Shop'}</span>
          </Link>

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
            <span className="text-[8px] tracking-widest uppercase font-semibold">{lang === 'FR' ? 'Menu' : 'Menu'}</span>
          </button>

        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="md:hidden fixed inset-0 z-40 bg-charcoal/98 backdrop-blur-2xl flex flex-col justify-center items-center pb-20"
          >
            <div className="section-container flex flex-col items-center space-y-8 w-full">
              {NAV_LINKS.map((l, i) => {
                if (l.isSection && location.pathname === '/') {
                  return (
                    <motion.button
                      key={l.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => handleSectionClick(l.id)}
                      className="block text-center text-3xl font-display tracking-widest text-ivory/90 hover:text-gold transition-colors"
                    >
                      {l.label}
                    </motion.button>
                  )
                }

                return (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={l.path}
                      onClick={() => setOpen(false)}
                      className="block text-center text-3xl font-display tracking-widest text-ivory/90 hover:text-gold transition-colors"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                )
              })}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-8"
              >
                <button
                  onClick={toggleLang}
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
