import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineDatabase, HiOutlinePhotograph, HiOutlineTag, HiOutlineLogout, HiOutlineLogin } from 'react-icons/hi'
import ProductAdmin from '../../components/Admin/ProductAdmin'
import CategoryAdmin from '../../components/Admin/CategoryAdmin'
import GalleryAdmin from '../../components/Admin/GalleryAdmin'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') { // Simple password for now
      setIsAuthenticated(true)
    } else {
      alert("Mot de passe incorrect")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-ivory rounded-3xl p-10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Boussete Couture</h1>
            <p className="text-smoke text-sm uppercase tracking-widest">Administration</p>
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-smoke">Mot de passe</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-sand rounded-xl py-3 px-4 focus:outline-none focus:border-gold"
                placeholder="Entrez le mot de passe..."
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-charcoal text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gold transition-colors"
            >
              Se connecter
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      setIsAuthenticated(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream/30 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal text-white flex flex-col p-6 shrink-0">
        <div className="mb-12">
          <h2 className="font-display text-xl font-bold mb-1">Admin Panel</h2>
          <p className="text-[10px] text-ivory/40 uppercase tracking-[0.2em]">Boussete Couture</p>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'hover:bg-white/5 text-ivory/60'}`}
          >
            <HiOutlineDatabase className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Produits</span>
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'categories' ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'hover:bg-white/5 text-ivory/60'}`}
          >
            <HiOutlineTag className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Catégories</span>
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'gallery' ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'hover:bg-white/5 text-ivory/60'}`}
          >
            <HiOutlinePhotograph className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Galerie</span>
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-bold uppercase tracking-widest text-xs"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
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
  )
}
