import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import keyStorage from "@/configs/storage";
import translationEN from "../i18n/en/en.json";
import translationVI from "../i18n/vi/vi.json";

// the translations
const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI },
};

const json = localStorage.getItem(keyStorage.key);
let dataStorage = {};
if (json) dataStorage = JSON.parse(json);

if (!dataStorage.language) {
  dataStorage = { ...dataStorage, language: "en" };
  console.log(dataStorage);
  localStorage.setItem(keyStorage.key, JSON.stringify(dataStorage));
}

const language = dataStorage.language;

i18next.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
