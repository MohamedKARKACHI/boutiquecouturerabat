import React from 'react'

const Ornament = ({ icon = '✦', className = '' }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent via-gold/50 to-gold" />
    <span className="text-gold text-xl leading-none">{icon}</span>
    <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent via-gold/50 to-gold" />
  </div>
)

export default Ornament
