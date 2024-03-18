import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import translations from "./translations";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

const i18n = i18next
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: translations,
  });


// moment.updateLocale("de", {
//   relativeTime: {
//     future: "in %s",
//     past: "vor %s",
//     s: "einem Augenblick",
//     ss: "%d Sekunden",
//     m: "einer Minute",
//     mm: "%d Minuten",
//     h: "einer Stunde",
//     hh: "%d Stunden",
//     d: "einem Tag",
//     dd: "%d Tagen",
//     w: "einer Woche",
//     ww: "%d Wochen",
//     M: "einem Monat",
//     MM: "%d Monaten",
//     y: "einem Jahr",
//     yy: "%d Jahren",
//   },
// });

export default i18n;
