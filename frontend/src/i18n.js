// frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en.json';
import mr from './translations/mr.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        mr: { translation: mr }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;