import { useState, useRef, useCallback } from 'react'
import { HiPlus, HiX, HiPhotograph } from 'react-icons/hi'

/**
 * ImageDropZone — Premium drag & drop image upload component
 * 
 * Props:
 *   multiple: boolean — allow multiple files
 *   value: File | File[] | null — current files
 *   existingUrl: string — URL of existing image (for edit mode)
 *   onChange: (files) => void — callback when files change
 *   onRemove: () => void — callback to remove current image
 *   label: string — zone label
 *   className: string — additional classes
 */
export default function ImageDropZone({ 
  multiple = false, 
  value, 
  existingUrl,
  onChange, 
  onRemove,
  label = 'Image',
  className = '',
  accept = 'image/jpeg,image/png,image/webp'
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef(null)

  const hasImage = value || existingUrl

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length > 0) {
      onChange(multiple ? files : files[0])
    }
  }, [multiple, onChange])

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      onChange(multiple ? files : files[0])
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const getPreviewUrl = () => {
    if (value instanceof File) return URL.createObjectURL(value)
    if (existingUrl) return existingUrl
    return null
  }

  const previewUrl = getPreviewUrl()

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !hasImage && inputRef.current?.click()}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-gold bg-gold/10 shadow-[0_0_30px_rgba(212,168,67,0.2)] scale-[1.02]' 
            : hasImage 
              ? 'border-transparent' 
              : 'border-[var(--a-border-hover)] hover:border-gold/40 hover:bg-[var(--a-sub-hover)]'
          }
          ${!hasImage ? 'aspect-video' : ''}
        `}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt={label} 
              className="w-full h-full object-cover rounded-2xl aspect-video"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 rounded-2xl">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                className="p-3 bg-[var(--a-hover-4)] backdrop-blur-sm rounded-xl text-[var(--a-text)] hover:bg-[var(--a-hover-5)] transition-all"
                title="Changer l'image"
              >
                <HiPhotograph className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove?.() }}
                className="p-3 bg-red-500/80 backdrop-blur-sm rounded-xl text-[var(--a-text)] hover:bg-red-500 transition-all"
                title="Supprimer"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${isDragOver ? 'bg-gold/20 text-gold' : 'bg-[var(--a-hover-1)] text-[var(--a-text)]/30'}`}>
              <HiPlus className="w-7 h-7" />
            </div>
            <p className={`text-sm font-medium mb-1 transition-colors ${isDragOver ? 'text-gold' : 'text-[var(--a-text)]/50'}`}>
              {isDragOver ? 'Déposer ici' : 'Glisser-déposer ou cliquer'}
            </p>
            <p className="text-[10px] text-[var(--a-text)]/25 tracking-wider uppercase">
              JPEG, PNG, WebP · Max 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * MultiImageDropZone — for gallery images (multiple file drop zone)
 */
export function MultiImageDropZone({ 
  files = [], 
  existingImages = [],
  onAdd, 
  onRemoveNew, 
  onRemoveExisting,
  label = 'Galerie'
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (newFiles.length > 0) onAdd(newFiles)
  }, [onAdd])

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files)
    if (newFiles.length > 0) onAdd(newFiles)
    e.target.value = ''
  }

  const totalCount = existingImages.length + files.length

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
        onDrop={handleDrop}
        className={`
          grid gap-3 p-4 rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[140px]
          ${totalCount > 0 ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5' : ''}
          ${isDragOver 
            ? 'border-gold bg-gold/10 shadow-[0_0_30px_rgba(212,168,67,0.15)]' 
            : 'border-[var(--a-border-hover)] bg-[var(--a-sub-hover)]'
          }
        `}
      >
        {/* Existing images */}
        {existingImages.map((img, idx) => (
          <div key={`existing-${img.id || idx}`} className="relative aspect-square rounded-xl overflow-hidden group">
            <img src={img.url || img.path} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => onRemoveExisting(img.id)}
                className="p-2 bg-red-500 text-[var(--a-text)] rounded-lg hover:scale-110 transition-transform"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* New files */}
        {files.map((file, idx) => (
          <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group border-2 border-gold/30">
            <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
            <span className="absolute top-1.5 left-1.5 text-[8px] font-bold bg-gold text-charcoal px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => onRemoveNew(idx)}
                className="p-2 bg-red-500 text-[var(--a-text)] rounded-lg hover:scale-110 transition-transform"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`
            aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all
            ${isDragOver ? 'border-gold text-gold' : 'border-[var(--a-border-hover)] text-[var(--a-text)]/25 hover:border-gold/40 hover:text-gold/60'}
          `}
        >
          <HiPlus className="w-6 h-6" />
          <span className="text-[8px] uppercase tracking-widest font-bold">Ajouter</span>
        </button>
      </div>
    </div>
  )
}
