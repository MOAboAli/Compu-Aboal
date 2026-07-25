import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const saved = localStorage.getItem('lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en.en },
    ar: { translation: ar.ar },
  },
  lng: saved,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  return i18n.changeLanguage(lang);
}

document.documentElement.lang = saved;
document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';

export default i18n;
