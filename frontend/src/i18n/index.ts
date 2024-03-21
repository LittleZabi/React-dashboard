import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // No change
import Backend from 'i18next-http-backend';
import enTran from './en.json'
import arTran from './ar.json'


const resources = {
  en: {
    translation: enTran,
  },
  ar: {
    translation: arTran,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources,
  });

export default i18n;
