import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import SurMesure from './components/SurMesure'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ShopCollection from './components/ShopCollection'

function App() {
  const [currentPage, setCurrentPage] = useState('home') // 'home' or 'collection'

  return (
    <div className="min-h-screen bg-ivory relative w-full overflow-x-hidden">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main>
        {currentPage === 'home' ? (
          <>
            <Hero />
            <Categories />
            <SurMesure />
            <Gallery />
            <Contact />
          </>
        ) : (
          <ShopCollection />
        )}
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
