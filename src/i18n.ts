import i18n, { use } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const getCurrentHost = import.meta.env.MODE === "development" ? "http://localhost:8080" : "";

use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      debug: import.meta.env.MODE === "development",
      initAsync: false,
      fallbackLng: ["no"],
      lng: "no",
      supportedLngs: ["no", "en"],
      interpolation: {
        escapeValue: false,
      },
      saveMissing: true,
      saveMissingTo: "all",
      backend: {
        addPath: `${getCurrentHost}/locales/{{lng}}/missing.json`,
        loadPath: `${getCurrentHost}/locales/{{lng}}/{{ns}}.json`,
      },
    },
    (err) => {
      if (err) {
        console.warn({ err });
      }
    },
  );

export default i18n;
