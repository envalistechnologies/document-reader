import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../../locales/en.json';
import hi from '../../locales/hi.json';
import es from '../../locales/es.json';
import fr from '../../locales/fr.json';
import de from '../../locales/de.json';
import ar from '../../locales/ar.json';
import fa from '../../locales/fa.json';
import zh from '../../locales/zh.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  ar: { translation: ar },
  fa: { translation: fa },
  zh: { translation: zh },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    compatibilityJSON: 'v4', // Required for React Native
    lng: 'en', // Default language, will be overridden by Zustand store
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
