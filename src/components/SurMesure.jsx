import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { HiOutlineChat, HiOutlineScissors, HiOutlineGlobe } from 'react-icons/hi'

/* ── Data constant ── */
const STEPS = [
  {
    id: 1,
    number: '01',
    icon: HiOutlineChat,
    titleFr: 'Consultation & Mesures',
    titleEn: 'Consultation & Measurements',
    description:
      'Partagez votre vision avec nous via WhatsApp. Envoyez vos mesures et choisissez parmi notre collection exclusive de tissus.',
    iconBg: 'bg-majorelle/15',
    iconColor: 'text-majorelle',
    borderColor: 'border-majorelle/20',
    gradient: 'from-majorelle/15 to-majorelle/5',
    accent: 'bg-majorelle',
  },
  {
    id: 2,
    number: '02',
    icon: HiOutlineScissors,
    titleFr: 'Confection Artisanale',
    titleEn: 'Artisanal Crafting',
    description:
      'Votre vêtement est méticuleusement confectionné dans notre atelier à Marrakech, selon des techniques ancestrales transmises de génération en génération.',
    iconBg: 'bg-emerald/15',
    iconColor: 'text-emerald',
    borderColor: 'border-emerald/20',
    gradient: 'from-emerald/15 to-emerald/5',
    accent: 'bg-emerald',
  },
  {
    id: 3,
    number: '03',
    icon: HiOutlineGlobe,
    titleFr: 'Livraison Mondiale',
    titleEn: 'Worldwide Shipping',
    description:
      'Votre création sur-mesure est soigneusement emballée et expédiée partout dans le monde. Suivez votre commande à chaque étape.',
    iconBg: 'bg-terracotta/15',
    iconColor: 'text-terracotta',
    borderColor: 'border-terracotta/20',
    gradient: 'from-terracotta/15 to-terracotta/5',
    accent: 'bg-terracotta',
  },
]

export default function SurMesure() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="surmesure" className="py-16 md:py-24 bg-cream relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-majorelle/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-gold/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="section-container relative z-10">
        {/* ── Header ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-20"
        >
          <p className="font-accent text-sm tracking-[0.4em] text-gold uppercase mb-2">Notre Processus</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal font-semibold mb-4">
            L'Art du <span className="text-gold-dark italic">Sur-Mesure</span>
          </h2>
          <p className="font-accent text-base md:text-lg text-smoke max-w-xl mx-auto leading-relaxed">
            De votre vision à votre garde-robe — une expérience sur-mesure sans faille
          </p>
          <div className="ornament mt-5"><span className="text-gold">✦</span></div>
        </motion.div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 44 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.18 }}
              className={`relative group rounded-3xl border border-white/50 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] p-6 lg:p-8 hover:shadow-[0_20px_50px_rgba(212,168,67,0.1)] transition-all duration-500`}
            >
              {/* Watermark number — absolutely positioned, not interfering with text */}
              <span
                className="absolute top-4 right-5 font-display text-[4rem] md:text-[5rem] leading-none font-bold text-charcoal/[0.03] select-none pointer-events-none transition-colors duration-500 group-hover:text-gold/[0.05]"
                aria-hidden="true"
              >
                {step.number}
              </span>

              {/* Icon */}
              <div className={`relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${step.iconBg} flex items-center justify-center mb-5 md:mb-7 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className={`w-6 h-6 md:w-8 md:h-8 ${step.iconColor}`} />
              </div>

              {/* Text */}
              <h3 className="relative z-10 font-display text-xl md:text-2xl text-charcoal font-semibold leading-snug mb-2">
                {step.titleFr}
              </h3>
              <p className="relative z-10 font-accent text-[10px] md:text-xs text-gold-dark tracking-[0.2em] uppercase mb-3 md:mb-5">
                {step.titleEn}
              </p>
              <p className="relative z-10 text-smoke leading-relaxed text-sm md:text-[15px]">
                {step.description}
              </p>

              {/* Accent bar */}
              <div className={`relative z-10 mt-5 md:mt-7 h-[3px] w-10 md:w-14 ${step.accent} rounded-full opacity-60 group-hover:w-20 md:group-hover:w-24 transition-all duration-500`} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-14 md:mt-20"
        >
          <a
            href="https://wa.me/212666780147?text=Bonjour%2C%20je%20souhaite%20passer%20une%20commande%20sur-mesure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-dark to-gold text-charcoal font-semibold text-sm tracking-widest uppercase rounded-full hover:shadow-[0_0_40px_rgba(212,168,67,0.35)] transition-all duration-500"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            Commander Maintenant
          </a>
        </motion.div>
      </div>
    </section>
  )
}
