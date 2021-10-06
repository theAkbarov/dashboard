import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";

import { defaultValue } from "constants/language";

import localeEN from "services/i18n/locales/en.json";
import localeUZ from "services/i18n/locales/uz.json";
import localeRU from "./locales/ru.json";

const resources = {
  ru: {
    translation: localeRU,
  },
  "uz-Cyrl": {
    translation: localeUZ,
  },
  "uz-Latn": {
    translation: localeUZ,
  },
  en: {
    translation: localeEN,
  },
};

i18n.use(detector).use(initReactI18next).init({
  resources,
  lng: defaultValue,
  fallbackLng: defaultValue,
});

export default i18n;
