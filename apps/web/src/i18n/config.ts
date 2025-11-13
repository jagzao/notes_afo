import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

// Get saved language or browser language
const savedLanguage = localStorage.getItem('keep-plus-plus-language');
const browserLanguage = navigator.language.split('-')[0]; // 'en-US' -> 'en'
const defaultLanguage = savedLanguage || (browserLanguage === 'es' ? 'es' : 'en');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
