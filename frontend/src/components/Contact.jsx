import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlinePhone } from 'react-icons/hi'
import Ornament from './Ornament'
import { useLanguage } from '../context/LanguageContext'

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

/* ── Data constant ── */
const getInfoCards = (lang) => [
  {
    id: 1,
    icon: HiOutlineLocationMarker,
    title: lang === 'FR' ? 'Adresse' : 'Address',
    lines: ['Souk des Teinturiers', 'Médina de Marrakech', 'Marrakech, Morocco'],
  },
  {
    id: 2,
    icon: HiOutlineClock,
    title: lang === 'FR' ? 'Horaires' : 'Hours',
    lines: lang === 'FR' 
      ? ['Lundi – Samedi', '9h00 – 19h00', 'Dimanche : Sur rendez-vous']
      : ['Monday – Saturday', '9:00 AM – 7:00 PM', 'Sunday: By appointment'],
  },
  {
    id: 3,
    icon: HiOutlinePhone,
    title: lang === 'FR' ? 'Contact' : 'Contact',
    lines: ['+212 666 780 147', lang === 'FR' ? 'WhatsApp disponible' : 'WhatsApp available', 'boutiquecouturerabat@gmail.com'],
  },
]

export default function Contact() {
  const { lang } = useLanguage()
  const T = TRANSLATIONS[lang]
  const INFO_CARDS = getInfoCards(lang)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

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
          <Ornament icon="◆" />
        </motion.div>

        {/* ── 2-column layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: info cards + CTA */}
          <div className="space-y-6">
            {INFO_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="flex gap-5 p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-sand hover:border-gold/30 hover:shadow-lg transition-all duration-300"
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

            {/* CTA */}
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

          {/* Right: Map — fixed height, rounded */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <iframe
              title="BOUTIQUE COUTURE RABAT"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.068!2d-7.9893!3d31.6295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM3JzQ2LjIiTiA3wrA1OSczMS45Ilc!5e0!3m2!1sfr!2sma!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
            {/* Map overlay badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-charcoal/80 backdrop-blur-sm rounded-xl p-4 border border-gold/20 pointer-events-none">
              <p className="font-display text-sm text-gold font-semibold">BOUTIQUE COUTURE RABAT</p>
              <p className="text-ivory/50 text-xs mt-1">Médina de Marrakech, Morocco</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
