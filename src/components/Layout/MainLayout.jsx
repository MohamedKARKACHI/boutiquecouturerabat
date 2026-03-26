import Navbar from '../Navbar'
import Footer from '../Footer'
import WhatsAppButton from '../WhatsAppButton'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-ivory relative w-full overflow-x-hidden">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
