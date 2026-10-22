import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TRANSLATIONS } from '../lib/i18n';

interface LanguageContextType {
  lang: Language;
  t: typeof TRANSLATIONS.en;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('matter_room_lang');
    return (saved === 'vi' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('matter_room_lang', lang);
  }, [lang]);

  const value = {
    lang,
    t: TRANSLATIONS[lang],
    setLanguage: (newLang: Language) => setLang(newLang)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
