import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import keyStorage from "@/configs/storage";
import translationEN from "../i18n/en/en.json";
import translationVI from "../i18n/vi/vi.json";
import validationVI from "../i18n/vi/validation.json";
import validationEN from "../i18n/en/validation.json";

// the translations
const resources = {
  en: { translation: translationEN, validation: validationEN },
  vi: { translation: translationVI, validation: validationVI },
};

const json = localStorage.getItem(keyStorage.key);
let dataStorage: { language?: string } = {};
if (json) dataStorage = JSON.parse(json);

if (!dataStorage.language) {
  dataStorage = { ...dataStorage, language: "en" };
  localStorage.setItem(keyStorage.key, JSON.stringify(dataStorage));
}

const language = dataStorage.language!;

i18next.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  ns: ["translation", "validation"],
  defaultNS: "translation",
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

export default i18next;
