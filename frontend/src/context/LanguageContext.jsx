import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'FR');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'FR' ? 'EN' : 'FR'));
  };

  // Helper to get translated content from DB objects
  const t = (obj, field) => {
    if (!obj) return '';
    if (lang === 'EN') {
      return obj[`${field}_en`] || obj[field]; // Fallback to default
    }
    return obj[field] || obj[`${field}_fr`];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
