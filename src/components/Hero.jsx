import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Ornament from './Ornament'
import { useLanguage } from '../context/LanguageContext'

import slide1 from '../assets/slide1.jpg'
import slide2 from '../assets/slide2.jpg'
import slide3 from '../assets/slide3.jpg'
import slide4 from '../assets/slide4.jpg'
import mslide1 from '../assets/slide5.jpg'
import mslide2 from '../assets/slide6.jpg'
import mslide3 from '../assets/slide7.jpg'
import mslide4 from '../assets/slide8.jpg'

const desktopSlides = [slide1, slide2, slide3, slide4]
const mobileSlides = [mslide1, mslide2, mslide3, mslide4]

const TRANSLATIONS = {
  FR: {
    location: 'MARRAKECH · MAROC',
    title: "L’Élégance du Caftan Marocain Authentique",
    subtitle: "Haute Couture & Créations Sur-Mesure par Aziz Bousseta",
    cta: "Explorer la Collection"
  },
  EN: {
    location: 'MARRAKECH · MOROCCO',
    title: "Authentic Moroccan Elegance, Tailored to You",
    subtitle: "Bespoke traditional wear crafted by Master Tailor Aziz Bousseta in the heart of Marrakech.",
    cta: "Explore Collection"
  }
}

export default function Hero() {
  const { lang } = useLanguage()
  const T = TRANSLATIONS[lang]
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Listen to window resize to determine the correct slide array
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const activeSlides = isMobile ? mobileSlides : desktopSlides

  // Handle slide interval and index reset
  useEffect(() => {
    // Reset if index is invalid for current array
    if (current >= activeSlides.length) {
      setCurrent(0)
    }

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [activeSlides.length, current])

  return (
    <section
      id="hero"
      className="relative min-h-screen h-screen w-full overflow-hidden bg-black"
    >
      {/* ── Background: Responsive Dynamic Slider ── */}
      <AnimatePresence initial={false}>
        <motion.img
          key={`${isMobile ? 'm' : 'd'}-${current}`}
          src={activeSlides[current % activeSlides.length]}
          alt="Moroccan Elegance"
          initial={{ opacity: 0, scale: isMobile ? 1.3 : 1.1 }}
          animate={{ opacity: 1, scale: isMobile ? 1.1 : 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ height: '100%', width: '100%' }}
        />
      </AnimatePresence>
      
      {/* Cinematic Readability Overlays */}
      <div className="absolute inset-0 z-[5] bg-black/40 pointer-events-none" />
      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />




      {/* ── Hero Content ── */}
      <div className="relative z-10 container mx-auto px-6 text-center h-full flex flex-col items-center justify-center">
        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-4 md:mb-6 w-full flex flex-col items-center"
        >
          <Ornament className="mb-4" />
          <div className="relative flex items-center justify-center font-accent text-[11px] md:text-sm uppercase text-gold tracking-[0.5em] font-medium">
            {T.location}
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white leading-tight mb-4 md:mb-6 max-w-4xl mx-auto text-balance"
        >
          {lang === 'FR' ? (
            <>L’<span className="shimmer-text">Élégance</span> du Caftan Marocain <span className="font-accent italic text-white/90">Authentique</span></>
          ) : (
            <>Authentic Moroccan <span className="shimmer-text">Elegance</span>, Tailored to <span className="font-accent italic text-white/90">You</span></>
          )}
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="font-accent text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed text-balance"
        >
          {lang === 'FR' ? (
            <>Haute Couture & Créations Sur-Mesure par <span className="shimmer-text px-1">Aziz Bousseta</span></>
          ) : (
            <>Bespoke traditional wear crafted by Master Tailor <span className="shimmer-text px-1">Aziz Bousseta</span> in the heart of Marrakech.</>
          )}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-2"
        >
          <button
            onClick={() => scrollTo('categories')}
            className="group relative inline-flex items-center gap-4 px-6 md:px-8 py-3.5 md:py-4 border border-gold/60 text-gold font-light text-[10px] md:text-xs tracking-[0.3em] uppercase rounded-full overflow-hidden transition-all duration-500 hover:border-gold hover:shadow-[0_0_20px_rgba(212,168,67,0.3)] bg-transparent backdrop-blur-sm"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-gold-light">{T.cta}</span>
            <svg className="relative z-10 w-3 h-3 md:w-4 md:h-4 transition-all duration-500 group-hover:translate-x-2 group-hover:text-gold-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="absolute inset-0 bg-gold/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 md:mt-10 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto w-5 h-8 border-2 border-gold/40 rounded-full flex justify-center pt-2 backdrop-blur-sm"
          >
            <div className="w-1 h-2 bg-gold/80 rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Smooth SVG transition wave ── */}
      <div className="hidden md:block absolute bottom-0 inset-x-0 z-10 leading-[0]">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block w-full h-16 md:h-24 lg:h-32"
        >
          <path
            d="M0,80 C360,120 720,40 1080,80 C1260,100 1380,60 1440,70 L1440,120 L0,120 Z"
            fill="var(--color-ivory)"
          />
        </svg>
      </div>
    </section>
  )
}
