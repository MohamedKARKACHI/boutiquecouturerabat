import React from 'react'

const Ornament = ({ icon = '✦', className = '' }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    <div className="h-[0.5px] w-12 md:w-24 bg-gradient-to-r from-transparent via-gold/40 to-gold/70" />
    <span className="text-gold text-xl leading-none opacity-80">{icon}</span>
    <div className="h-[0.5px] w-12 md:w-24 bg-gradient-to-l from-transparent via-gold/40 to-gold/70" />
  </div>
)

export default Ornament
