import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiOutlineViewGrid, HiOutlineShoppingBag, HiOutlineTag, 
  HiOutlinePhotograph, HiOutlineLogout, HiMenuAlt2, HiX,
  HiOutlineSun, HiOutlineMoon
} from 'react-icons/hi'
import { ToastProvider } from '../../components/Admin/AdminToast'
import AdminStats from '../../components/Admin/AdminStats'
import ProductAdmin from '../../components/Admin/ProductAdmin'
import CategoryAdmin from '../../components/Admin/CategoryAdmin'
import GalleryAdmin from '../../components/Admin/GalleryAdmin'
import { fetchProducts, fetchCategories, fetchGallery } from '../../api'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { key: 'products', label: 'Produits', icon: HiOutlineShoppingBag },
  { key: 'categories', label: 'Catégories', icon: HiOutlineTag },
  { key: 'gallery', label: 'Galerie', icon: HiOutlinePhotograph },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({ products: 0, categories: 0, gallery: 0 })
  const [theme, setTheme] = useState(() => localStorage.getItem('adminTheme') || 'dark')

  useEffect(() => {
    localStorage.setItem('adminTheme', theme)
  }, [theme])

  useEffect(() => {
    if (isAuthenticated) loadStats()
  }, [isAuthenticated])

  const loadStats = async () => {
    try {
      const [prods, cats, gal] = await Promise.all([fetchProducts(), fetchCategories(), fetchGallery()])
      setStats({ products: prods.length, categories: cats.length, gallery: gal.length })
    } catch (err) { console.error(err) }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      // Shake animation feedback
      const form = e.target
      form.classList.add('animate-shake')
      setTimeout(() => form.classList.remove('animate-shake'), 500)
    }
  }

  const handleNavigate = (tab) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  // ── LOGIN SCREEN ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--a-bg)] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Moroccan pattern background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Brand */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--a-input)] border border-[var(--a-border)] mb-6">
              <div className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--a-text)]/40">Administration</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-[var(--a-text)] mb-2">Boutique Couturier</h1>
            <p className="text-[var(--a-text)]/30 text-sm">Rabat · Marrakech</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--a-text)]/30">Mot de passe</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--a-input)] border border-[var(--a-border-std)] rounded-xl py-3.5 px-4 text-[var(--a-text)] placeholder-[var(--a-text-20)] focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-gold text-charcoal py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
            >
              Se connecter
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // ── MAIN DASHBOARD ──
  return (
    <ToastProvider>
      <div className={`min-h-screen bg-[var(--a-bg)] flex ${theme === 'light' ? 'admin-light' : 'admin-dark'}`}>
        <style dangerouslySetInnerHTML={{__html: `
          .admin-dark {
            --a-bg: #0d0d14;
            --a-panel: rgba(255, 255, 255, 0.03);
            --a-input: rgba(255, 255, 255, 0.04);
            --a-sub: rgba(255, 255, 255, 0.05);
            --a-sub-hover: rgba(255, 255, 255, 0.02);
            --a-hover-1: rgba(255, 255, 255, 0.05);
            --a-hover-2: rgba(255, 255, 255, 0.1);
            --a-hover-3: rgba(255, 255, 255, 0.15);
            --a-hover-4: rgba(255, 255, 255, 0.2);
            --a-hover-5: rgba(255, 255, 255, 0.3);
            --a-border: rgba(255, 255, 255, 0.06);
            --a-border-std: rgba(255, 255, 255, 0.08);
            --a-border-hover: rgba(255, 255, 255, 0.1);
            --a-border-focus: rgba(255, 255, 255, 0.2);
            --a-text: #ffffff;
            --a-text-90: rgba(255, 255, 255, 0.9);
            --a-text-80: rgba(255, 255, 255, 0.8);
            --a-text-70: rgba(255, 255, 255, 0.7);
            --a-text-60: rgba(255, 255, 255, 0.6);
            --a-text-50: rgba(255, 255, 255, 0.5);
            --a-text-40: rgba(255, 255, 255, 0.4);
            --a-text-30: rgba(255, 255, 255, 0.3);
            --a-text-25: rgba(255, 255, 255, 0.25);
            --a-text-20: rgba(255, 255, 255, 0.2);
            --a-text-10: rgba(255, 255, 255, 0.1);
            --a-text-5: rgba(255, 255, 255, 0.05);
          }
          .admin-light {
            --a-bg: #f9f6f2;
            --a-panel: #ffffff;
            --a-input: #ffffff;
            --a-sub: #f0ebe4;
            --a-sub-hover: #f5f1ec;
            --a-hover-1: rgba(139, 90, 43, 0.03);
            --a-hover-2: rgba(139, 90, 43, 0.06);
            --a-hover-3: rgba(139, 90, 43, 0.1);
            --a-hover-4: rgba(139, 90, 43, 0.15);
            --a-hover-5: rgba(139, 90, 43, 0.2);
            --a-border: rgba(139, 90, 43, 0.15);
            --a-border-std: rgba(139, 90, 43, 0.2);
            --a-border-hover: rgba(139, 90, 43, 0.3);
            --a-border-focus: rgba(139, 90, 43, 0.4);
            --a-text: #1a1a1a;
            --a-text-90: #2a2a2a;
            --a-text-80: #3a3a3a;
            --a-text-70: #4a4a4a;
            --a-text-60: #5a4a42;
            --a-text-50: #7a6a5f;
            --a-text-40: #8a7a6f;
            --a-text-30: #9a8a7f;
            --a-text-25: #aa9a8f;
            --a-text-20: #b0a59a;
            --a-text-10: #d0c5ba;
            --a-text-5: #e0d5ca;
          }
        `}} />
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-5 left-5 z-50 lg:hidden p-3 bg-[var(--a-sub)] backdrop-blur-xl rounded-xl border border-[var(--a-border-std)] text-[var(--a-text)]"
        >
          {sidebarOpen ? <HiX className="w-5 h-5" /> : <HiMenuAlt2 className="w-5 h-5" />}
        </button>

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ── */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[var(--a-bg)] border-r border-[var(--a-border)] flex flex-col p-6
          transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Brand */}
          <div className="mb-10 mt-2">
            <h2 className="font-display text-lg font-bold text-[var(--a-text)] tracking-wide">Boutique Couturier</h2>
            <p className="text-[9px] text-[var(--a-text)]/25 uppercase tracking-[0.3em] mt-1">Panel Admin</p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1.5 flex-1">
            {NAV_ITEMS.map(item => (
              <button 
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.key 
                    ? 'bg-gold/15 text-gold border border-gold/20' 
                    : 'text-[var(--a-text)]/40 hover:text-[var(--a-text)]/70 hover:bg-[var(--a-panel)] border border-transparent'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Theme Toggle & Logout */}
          <div className="mt-auto flex flex-col gap-2">
            <button 
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--a-text)]/60 hover:text-[var(--a-text)] hover:bg-[var(--a-panel)] transition-all text-sm font-semibold"
            >
              {theme === 'dark' ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            </button>
            <button 
              onClick={() => {
                if (window.confirm('Se déconnecter ?')) setIsAuthenticated(false)
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/80 hover:text-red-600 hover:bg-red-500/10 transition-all text-sm font-semibold"
            >
              <HiOutlineLogout className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto min-h-screen">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <AdminStats stats={stats} onNavigate={handleNavigate} />
              </motion.div>
            )}
            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ProductAdmin />
              </motion.div>
            )}
            {activeTab === 'categories' && (
              <motion.div key="categories" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <CategoryAdmin />
              </motion.div>
            )}
            {activeTab === 'gallery' && (
              <motion.div key="gallery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <GalleryAdmin />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ToastProvider>
  )
}
