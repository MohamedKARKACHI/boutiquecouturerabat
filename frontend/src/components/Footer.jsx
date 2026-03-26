import { Link, useLocation } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa'

const FOOTER_LINKS = [
  { label: 'Accueil', path: '/', id: 'hero' },
  { label: 'Collections', path: '/shop', id: 'collection' },
  { label: 'Sur-Mesure', path: '/', id: 'surmesure' },
  { label: 'Galerie', path: '/', id: 'gallery' },
  { label: 'Contact', path: '/', id: 'contact' },
]

const SOCIALS = [
  { icon: FaInstagram, href: 'https://www.instagram.com/', label: 'Instagram' },
  { icon: FaFacebookF, href: 'https://www.facebook.com/', label: 'Facebook' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const location = useLocation()

  const handleNav = (l) => {
    if (location.pathname === '/' && l.id !== 'collection') {
      document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-charcoal">
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Link to="/" onClick={() => window.scrollTo(0,0)}>
                <span className="font-display text-xl font-bold tracking-[0.18em] text-gold">
                  BOUTIQUE COUTURE
                </span>
                <br />
                <span className="font-accent text-xs tracking-[0.3em] text-gold-light/50">RABAT</span>
              </Link>
            </div>
            <p className="text-ivory/35 text-sm leading-relaxed max-w-xs">
              Bespoke Moroccan elegance since generations. Master Tailor Aziz Bousseta crafts luxury
              traditional wear in the heart of Marrakech.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm tracking-widest text-gold/70 uppercase mb-5">Navigation</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.path}
                    onClick={() => handleNav(l)}
                    className="text-ivory/35 hover:text-gold text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm tracking-widest text-gold/70 uppercase mb-5">Contact</h4>
            <div className="space-y-2 text-ivory/35 text-sm">
              <p>Médina de Marrakech</p>
              <p>Marrakech, Morocco</p>
              <a href="tel:+212666780147" className="block hover:text-gold transition-colors">
                +212 666 780 147
              </a>
              <a
                href="https://wa.me/212666780147"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald hover:text-emerald-light transition-colors mt-2"
              >
                <FaWhatsapp size={16} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm tracking-widest text-gold/70 uppercase mb-5">Légal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/legal" className="text-ivory/35 hover:text-gold text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-ivory/35 hover:text-gold text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-ivory/35 hover:text-gold text-sm transition-colors">
                  License & Copyright
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-ivory/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ivory/20 text-xs tracking-wider">
            © {year} BOUTIQUE COUTURE RABAT. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-ivory/20 hover:text-gold transition-colors"
              >
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
