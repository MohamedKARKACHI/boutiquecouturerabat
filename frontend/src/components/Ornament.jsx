import React from 'react'

const StarSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0 C12.5 8.5 15.5 11.5 24 12 C15.5 12.5 12.5 15.5 12 24 C11.5 15.5 8.5 12.5 0 12 C8.5 11.5 11.5 8.5 12 0 Z" />
  </svg>
)

const Ornament = ({ icon, className = '' }) => (
  <div className={`flex items-center justify-center gap-4 ${className} w-full`}>
    <div className="h-[1px] shrink-0 w-12 md:w-24 bg-gradient-to-r from-transparent via-gold/40 to-gold/70" />
    <span className="text-gold flex items-center justify-center leading-none">
      {icon || <StarSVG />}
    </span>
    <div className="h-[1px] shrink-0 w-12 md:w-24 bg-gradient-to-l from-transparent via-gold/40 to-gold/70" />
  </div>
)

export default Ornament
