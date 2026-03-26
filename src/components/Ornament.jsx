import React from 'react'

const Ornament = ({ icon = '✦', className = '' }) => (
  <div className={`ornament ${className}`}>
    <span className="text-gold text-xl leading-none">{icon}</span>
  </div>
)

export default Ornament
