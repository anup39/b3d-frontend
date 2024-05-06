import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      fallbackLng: "da",
      lng: "da",
      debug: true,
      en: {
        translation: {
          Log_in: "Log in",
          Username: "Username",
          Password: "Password",
          Remember_me: "Remember me",
          Forgot_password: "Forgot password",
          Sign_up: "Sign up",
        },
      },
      da: {
        translation: {
          Log_in: "Se connecter",
          Username: "Brugernavn",
          Password: "Adgangskode",
          Remember_me: "Husk mig",
          Forgot_password: "Glemt kodeord",
          Sign_up: "Tilmeld dig",
        },
      },
    },

    // interpolation: {
    //   escapeValue: false,
    // },
  });
