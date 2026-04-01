import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Ornament from './Ornament'
import { useLanguage } from '../context/LanguageContext'
import { fetchHero } from '../api'

const API_URL = import.meta.env.VITE_API_URL || '';

const TRANSLATIONS = {
  FR: {
    location: 'MARRAKECH · MAROC',
    cta: "Explorer la Collection",
    defaultTitle: <>L’<span className="text-gold italic font-display">Élégance</span> du Caftan Marocain <span className="font-accent italic text-white/90">Authentique</span></>,
    defaultSub: <>Haute Couture & Créations Sur-Mesure par <span className="text-gold/90 font-semibold">Aziz Bousseta</span></>
  },
  EN: {
    location: 'MARRAKECH · MOROCCO',
    cta: "Explore Collection",
    defaultTitle: <>Authentic Moroccan <span className="text-gold italic font-display">Elegance</span>, Tailored to <span className="font-accent italic text-white/90">You</span></>,
    defaultSub: <>Bespoke traditional wear crafted by Master Tailor <span className="text-gold/90 font-semibold">Aziz Bousseta</span> in the heart of Marrakech.</>
  }
}

export default function Hero() {
  const { lang } = useLanguage()
  const T = TRANSLATIONS[lang]
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHero()
      .then(data => {
        if (data && data.length > 0) {
          setSlides(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching hero slides:', err);
        setLoading(false);
      });
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (loading) return <div className="h-screen bg-black" />;

  // Helper to format dynamic text with some basic luxury tags if they appear
  // This is a simple version, we could use dangerouslySetInnerHTML if the user provides HTML
  const renderText = (text, isTitle = false) => {
    if (!text) return null;
    // Simple logic: if the user types *word*, it becomes gold/italic
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <span key={i} className={`text-gold italic ${isTitle ? 'font-display' : 'font-semibold'}`}>{part.slice(1, -1)}</span>;
      }
      return part;
    });
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* ── Background: Cinematic Dynamic Slider ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slides[current]?.id || 'default'}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {slides.length > 0 ? (
            <img
              src={`${API_URL}/uploads/${slides[current]?.image_path}`}
              alt=""
              className="w-full h-full object-cover object-center brightness-[0.7]"
            />
          ) : (
            <div className="w-full h-full bg-charcoal" />
          )}
          {/* Gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>
      
      {/* ── Hero Content ── */}
      <div className="relative z-10 container mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-4 mb-8"
        >
          <Ornament className="w-12 h-12 drop-shadow-gold" />
          <span className="font-accent text-[10px] md:text-xs uppercase text-gold tracking-[0.8em] font-medium opacity-80">
            {T.location}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white font-bold leading-[1.1] mb-8 max-w-6xl mx-auto tracking-tight"
        >
          {slides.length > 0 && slides[current][`title_${lang.toLowerCase()}`] ? (
            renderText(slides[current][`title_${lang.toLowerCase()}`], true)
          ) : T.defaultTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-accent text-base md:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          {slides.length > 0 && slides[current][`subtitle_${lang.toLowerCase()}`] ? (
            renderText(slides[current][`subtitle_${lang.toLowerCase()}`])
          ) : T.defaultSub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <button
            onClick={() => scrollTo('categories')}
            className="group relative inline-flex items-center gap-6 px-10 py-5 border border-gold/40 text-gold rounded-full transition-all duration-500 hover:border-gold hover:shadow-[0_0_30px_rgba(212,168,67,0.2)] bg-black/20 backdrop-blur-md overflow-hidden"
          >
            <span className="relative z-10 text-xs font-bold uppercase tracking-[0.3em] group-hover:text-white transition-colors duration-500">
              {T.cta}
            </span>
            <svg 
              className="relative z-10 w-5 h-5 transition-all duration-500 group-hover:translate-x-2 group-hover:text-white" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="absolute inset-0 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border border-gold/30 rounded-full flex justify-center p-1.5"
          >
            <div className="w-1 h-2 bg-gold/60 rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* Wave transition for luxury feel */}
      <div className="absolute bottom-0 inset-x-0 z-10 leading-[0]">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 lg:h-32 transform translate-y-1">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="var(--color-ivory)" />
        </svg>
      </div>
    </section>
  )
}

