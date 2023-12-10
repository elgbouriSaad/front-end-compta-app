import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import App from "./App";
import en from "./translations/en";
import fr from "./translations/fr";

i18n.init({
  lng: "fr",
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  fallbackLng: "fr",
  debug: false,
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);

