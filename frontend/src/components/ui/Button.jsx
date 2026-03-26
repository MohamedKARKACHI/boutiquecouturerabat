export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyles = 'font-bold uppercase tracking-widest transition-all rounded-xl inline-flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-charcoal text-white hover:bg-gold',
    secondary: 'bg-cream/50 text-gold-dark hover:bg-gold hover:text-white',
    outline: 'border border-gold/30 text-gold hover:bg-gold/10',
    ghost: 'text-smoke hover:bg-sand/20'
  }
  
  const sizes = {
    xs: 'px-4 py-2 text-[10px]',
    sm: 'px-5 py-3 text-xs',
    md: 'px-8 py-4 text-sm',
    lg: 'px-10 py-5 text-base'
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
