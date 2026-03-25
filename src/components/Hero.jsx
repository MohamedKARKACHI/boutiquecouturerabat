import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

import slide1 from '../assets/slide1.jpg' // Landscape
import slide2 from '../assets/slide2.jpg' // Landscape
import slide3 from '../assets/slide3.jpg' // Landscape
import slide4 from '../assets/slide4.jpg' // Landscape
import slide5 from '../assets/slide5.jpg' // Landscape
import slide6 from '../assets/slide6.jpg' // Portrait
import slide7 from '../assets/slide7.jpg' // Portrait
import slide8 from '../assets/slide8.jpg' // Portrait

const desktopSlides = [slide1, slide2, slide3, slide4, slide5]
const mobileSlides = [slide6, slide7, slide8, slide4] // added slide4 as it crops well vertically too

export default function Hero() {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeSlides.length])

  // Reset index if it goes out of bounds when switching arrays
  useEffect(() => {
    if (current >= activeSlides.length) {
      setCurrent(0)
    }
  }, [isMobile, current, activeSlides.length])

  return (
    <section
      id="hero"
      className="relative h-[100dvh] md:min-h-screen flex items-center justify-center overflow-hidden bg-ink"
    >
      {/* ── Background: Mobile 2x2 Editorial Grid ── */}
      <div className="md:hidden absolute inset-0 z-0 grid grid-cols-2 grid-rows-2 gap-[1px] bg-charcoal">
        {mobileSlides.slice(0, 4).map((img, idx) => (
          <div key={idx} className="relative w-full h-full overflow-hidden">
            <img
              src={img}
              alt={`Gallery ${idx}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
      </div>

      {/* ── Background: Desktop Slider ── */}
      <div className="hidden md:block absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={`d-${current}`}
            src={desktopSlides[current]}
            alt={`Moroccan Elegance Slide ${current + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
      </div>

      {/* Universal Overlay for all viewports */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/80" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-20 section-container text-center w-full flex flex-col items-center justify-center h-full pt-16">
        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-4 md:mb-6 w-full flex flex-col items-center"
        >
          <div className="ornament mb-3 w-full">
            <span className="text-gold text-xl leading-none">✦</span>
          </div>
          <div className="relative flex items-center justify-center font-accent text-[10px] md:text-sm uppercase text-gold-light/80 w-full h-4 md:h-5">
            <span className="absolute right-1/2 mr-2 md:mr-3 tracking-[0.4em]">MARRAKECH</span>
            <span className="absolute left-1/2 -translate-x-1/2 opacity-80">·</span>
            <span className="absolute left-1/2 ml-2 md:ml-3 tracking-[0.4em] pl-[0.4em]">MOROCCO</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white leading-tight mb-4 md:mb-6 max-w-4xl mx-auto text-balance"
        >
          Authentic Moroccan{' '}
          <span className="shimmer-text">Elegance</span>,
          <span className="block mt-1 md:mt-2">
            Tailored to <span className="italic font-accent font-light">You</span>
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="font-accent text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed text-balance"
        >
          Bespoke traditional wear crafted by Master Tailor{' '}
          <span className="text-gold font-semibold tracking-wide">Aziz Bousseta</span>{' '}
          in the heart of Marrakech.
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
            <span className="relative z-10 transition-colors duration-500 group-hover:text-gold-light">Discover the Collection</span>
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
