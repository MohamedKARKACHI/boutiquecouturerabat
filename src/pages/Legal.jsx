import { motion } from 'framer-motion'
import Ornament from '../components/Ornament'
import { useLanguage } from '../context/LanguageContext'

const CONTENT = {
  FR: {
    title: "Informations Légales",
    subtitle: "Conditions d'Utilisation & Confidentialité",
    sections: [
      {
        title: "1. Propriété Intellectuelle (Copyright)",
        content: "Tout le contenu présent sur ce site, incluant les textes, images, logos et designs de caftans, est la propriété exclusive de Boutique Couture Rabat. Toute reproduction ou utilisation sans autorisation préalable est strictement interdite."
      },
      {
        title: "2. Conditions de Service (Sur-Mesure)",
        content: "Nos créations sont réalisées sur mesure selon les spécifications du client. Une fois la confection commencée, aucune modification majeure ne pourra être apportée. Les délais de livraison sont indicatifs et peuvent varier selon la complexité de la pièce."
      },
      {
        title: "3. Politique de Confidentialité",
        content: "Les données personnelles collectées (nom, téléphone via WhatsApp) sont utilisées uniquement pour le traitement de vos commandes et ne sont jamais partagées avec des tiers."
      },
      {
        title: "4. Licence d'Utilisation",
        content: "L'utilisation de ce site est réservée à un usage personnel et non commercial. Vous ne pouvez pas copier ou extraire des données de ce site à des fins publicitaires."
      }
    ]
  },
  EN: {
    title: "Legal Information",
    subtitle: "Terms of Service & Privacy",
    sections: [
      {
        title: "1. Intellectual Property (Copyright)",
        content: "All content on this site, including text, images, logos, and caftan designs, is the exclusive property of Boutique Couture Rabat. Any reproduction or use without prior authorization is strictly prohibited."
      },
      {
        title: "2. Terms of Service (Bespoke)",
        content: "Our creations are made-to-measure according to customer specifications. Once tailoring has begun, no major modifications can be made. Delivery times are indicative and may vary depending on the complexity of the piece."
      },
      {
        title: "3. Privacy Policy",
        content: "Personal data collected (name, phone via WhatsApp) is used only for processing your orders and is never shared with third parties."
      },
      {
        title: "4. Usage License",
        content: "The use of this site is for personal and non-commercial use only. You may not copy or extract data from this site for advertising purposes."
      }
    ]
  }
}

export default function Legal() {
  const { lang } = useLanguage()
  const T = CONTENT[lang]

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24">
      <div className="section-container max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="font-accent text-sm tracking-[0.4em] text-gold uppercase mb-2">Boussete Couture</p>
          <h1 className="font-display text-4xl md:text-5xl text-charcoal font-semibold mb-4">{T.title}</h1>
          <p className="text-smoke text-sm italic">{T.subtitle}</p>
          <div className="mt-6 flex justify-center">
            <Ornament icon="⚖️" />
          </div>
        </motion.div>

        <div className="space-y-12">
          {T.sections.map((section, idx) => (
            <motion.section 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-cream/30 p-8 md:p-10 rounded-3xl border border-sand"
            >
              <h2 className="font-display text-xl text-gold-dark font-bold mb-4 uppercase tracking-widest">
                {section.title}
              </h2>
              <p className="text-charcoal/80 leading-relaxed text-lg font-light">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        <div className="mt-20 text-center text-smoke text-sm">
          <p>© {new Date().getFullYear()} BOUTIQUE COUTURE RABAT. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </div>
  )
}
