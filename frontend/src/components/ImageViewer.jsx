import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { HiMagnifyingGlassPlus, HiMagnifyingGlassMinus } from 'react-icons/hi2'

export default function ImageViewer({ isOpen, images = [], startIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setCurrentIndex(startIndex)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [startIndex, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [images.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [images.length])

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4))
  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.5, 1)
      if (newScale === 1) setPosition({ x: 0, y: 0 })
      return newScale
    })
  }

  const handleWheel = (e) => {
    e.preventDefault()
    if (e.deltaY < 0) handleZoomIn()
    else handleZoomOut()
  }

  const handlePointerDown = (e) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handlePointerMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
  }

  const handlePointerUp = () => setIsDragging(false)

  const handleDoubleTap = () => {
    if (scale > 1) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setScale(2.5)
    }
  }

  // Touch swipe support for navigation
  const [touchStartX, setTouchStartX] = useState(0)
  const handleTouchStart = (e) => {
    if (scale > 1) return // disable swipe when zoomed
    setTouchStartX(e.touches[0].clientX)
  }
  const handleTouchEnd = (e) => {
    if (scale > 1) return
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 60) {
      if (diff > 0) goToNext()
      else goToPrev()
    }
  }

  if (!images.length) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
        >
          {/* Top Control Bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 md:p-6 z-50">
            <div className="flex items-center gap-2">
              <button onClick={handleZoomOut} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white">
                <HiMagnifyingGlassMinus className="w-5 h-5" />
              </button>
              <span className="text-white/70 text-xs font-mono">{Math.round(scale * 100)}%</span>
              <button onClick={handleZoomIn} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white">
                <HiMagnifyingGlassPlus className="w-5 h-5" />
              </button>
            </div>

            <span className="text-white/60 text-xs tracking-widest uppercase font-bold">
              {currentIndex + 1} / {images.length}
            </span>

            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white">
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white"
              >
                <HiChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white"
              >
                <HiChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div
            className="flex-1 w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleTap}
          >
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-[90vw] max-h-[80vh] object-contain select-none pointer-events-none"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
              draggable={false}
            />
          </div>

          {/* Bottom Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 bg-black/50 backdrop-blur-lg rounded-full px-3 py-2 md:px-5 md:py-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIndex(i); setScale(1); setPosition({ x: 0, y: 0 }) }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentIndex ? 'border-white shadow-lg scale-110' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
