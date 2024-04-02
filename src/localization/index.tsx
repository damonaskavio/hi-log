import i18next from "i18next";
import en_US from "./en_US";
import { initReactI18next } from "react-i18next";

const resources = { en: { translation: en_US } };

i18next
  .use(initReactI18next)
  .init({ resources, lng: "en", interpolation: { escapeValue: false } });

export default i18next;
