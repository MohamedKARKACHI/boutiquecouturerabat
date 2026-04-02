import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import MainLayout from './components/Layout/MainLayout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Legal from './pages/Legal'

// Lazy load admin dashboard — not needed for public visitors
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/shop/*" element={<MainLayout><Shop /></MainLayout>} />
        <Route path="/legal" element={<MainLayout><Legal /></MainLayout>} />
        
        {/* Admin Route (Handles sub-paths like /admin/colors) */}
        <Route path="/admin/*" element={
          <Suspense fallback={
            <div className="min-h-screen bg-charcoal flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
                <span className="text-gold/60 text-xs tracking-[0.3em] uppercase font-bold">Loading Admin...</span>
              </div>
            </div>
          }>
            <AdminDashboard />
          </Suspense>
        } />
      </Routes>
    </Router>
  )
}

export default App
