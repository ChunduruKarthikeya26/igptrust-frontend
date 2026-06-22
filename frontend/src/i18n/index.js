import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import hi from './locales/hi.json'
import te from './locales/te.json'
import ta from './locales/ta.json'
import kn from './locales/kn.json'
import bn from './locales/bn.json'
import mr from './locales/mr.json'
import gu from './locales/gu.json'
import ml from './locales/ml.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te },
      ta: { translation: ta },
      kn: { translation: kn },
      bn: { translation: bn },
      mr: { translation: mr },
      gu: { translation: gu },
      ml: { translation: ml },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'ml'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'consentmgr_lang',
    },
    interpolation: { escapeValue: false },
  })

export default i18n
