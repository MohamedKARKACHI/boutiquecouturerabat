import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlinePhone } from 'react-icons/hi'
import Ornament from './Ornament'
import { useLanguage } from '../context/LanguageContext'
import { fetchSettings } from '../api'

const TRANSLATIONS = {
  FR: {
    badge: 'Visitez Nous',
    title: <>Nous <span className="italic text-majorelle">Trouver</span></>,
    cta: 'Réserver une Consultation',
    whatsappMsg: 'Bonjour, je souhaite réserver une consultation'
  },
  EN: {
    badge: 'Visit Us',
    title: <>Find <span className="italic text-majorelle">Us</span></>,
    cta: 'Book a Consultation',
    whatsappMsg: 'Hello, I would like to book a consultation'
  }
}

export default function Contact() {
  const { lang } = useLanguage()
  const T = TRANSLATIONS[lang]
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    fetchSettings()
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching settings:', err)
        setLoading(false)
      })
  }, [])

  const INFO_CARDS = [
    {
      id: 1,
      icon: HiOutlineLocationMarker,
      title: lang === 'FR' ? 'Adresse' : 'Address',
      lines: settings ? [settings[`contact_address_${lang.toLowerCase()}`]] : ['Dar Pacha, Arset Aouzal', 'Médina de Marrakech 40030', 'Marrakech, Maroc'],
    },
    {
      id: 2,
      icon: HiOutlineClock,
      title: lang === 'FR' ? 'Horaires' : 'Hours',
      lines: settings ? [settings[`opening_hours_${lang.toLowerCase()}`]] : (lang === 'FR' ? ['Tous les jours', '10h00 – 22h00'] : ['Every day', '10:00 AM – 10:00 PM']),
    },
    {
      id: 3,
      icon: HiOutlinePhone,
      title: lang === 'FR' ? 'Contact' : 'Contact',
      lines: settings ? [settings.contact_phone, settings.contact_email] : ['+212 666 780 147', 'boutiquecouturerabat@gmail.com'],
    },
  ]


  return (
    <section id="contact" className="py-16 md:py-24 bg-cream zellige-pattern">
      <div className="section-container relative z-10">
        {/* ── Header ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-accent text-sm tracking-[0.4em] text-gold uppercase mb-2">{T.badge}</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal font-semibold mb-4">
            {T.title}
          </h2>
          <Ornament />
        </motion.div>

        {/* ── Grid Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-6 lg:gap-y-8 items-stretch">
          
          {/* Left: Info Cards */}
          <div className="flex flex-col gap-6">
            {INFO_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="flex gap-5 p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-sand hover:border-gold/30 hover:shadow-lg transition-all duration-300 flex-1"
              >
                <div className="w-12 h-12 rounded-xl bg-majorelle/10 flex items-center justify-center shrink-0">
                  <card.icon className="w-6 h-6 text-majorelle" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-charcoal font-semibold mb-2">{card.title}</h3>
                  {card.lines.map((line, j) => (
                    <p key={j} className="text-smoke text-sm leading-relaxed">{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Map — matches height of info cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-cream via-sand/30 to-cream group"
          >
            {/* Fallback/Background for AdBlockers */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <Ornament />
            </div>

            <iframe
              title="Boutique Couturier Rabat — Marrakech"
              src="https://maps.google.com/maps?q=Boutique%20couturier%20rabat,%20Marrakech&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-90"
            />

            {/* Map Overlay Badge with Directions Button */}
            <div className="absolute bottom-4 left-4 right-4 bg-charcoal/90 backdrop-blur-2xl rounded-2xl p-5 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-xs text-gold font-bold uppercase tracking-[0.2em] mb-1">Boutique Couturier</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Dar Pacha, Arset Aouzal — Marrakech</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
                  <HiOutlineLocationMarker className="w-4 h-4 text-gold" />
                </div>
              </div>
              
              <button
                onClick={() => window.open("https://www.google.com/maps/dir/?api=1&destination=Boutique+Couturier+Rabat+Marrakech", "_blank", "noopener,noreferrer")}
                className="w-full py-4 bg-gold text-charcoal rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-3 active:scale-[0.98] select-none touch-manipulation relative z-[60]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.447-1.838L9 7m6 13l5.447-2.724A2 2 0 0021 15.382V5.618a2 2 0 00-1.447-1.838L15 7m-6 13V7m6 13V7" />
                </svg>
                Itinéraire
              </button>
            </div>

          </motion.div>

          {/* CTA Row (spans only under the cards on desktop) */}
          <div className="md:col-start-1 mt-2">
            <motion.a
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45 }}
              href={`https://wa.me/212666780147?text=${encodeURIComponent(T.whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-dark to-emerald text-ivory font-semibold text-sm tracking-widest uppercase rounded-full hover:shadow-[0_0_30px_rgba(13,107,75,0.3)] transition-all duration-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              {T.cta}
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}
