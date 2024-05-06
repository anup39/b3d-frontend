import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      fallbackLng: "en",
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
          Clients: "Clients",
          Classification: "Classification",
          Inspection_type: "Inspectiontype",
          About: "About",
          Contact: "Contact",
          Role: "Role",
          Create_client: "Create client",
          Open: "Open",
          Profile: "Profile",
          Dashboard: "Dashboard",
          Account: "Account",
          Logout: "Logout",
          Map_view: "Map view",
          Manage_class: "Manage class",
          Manage_users: "Manage users",
          Total_properties: "Total properties",
          Total_maps: "Total maps",
          Total_users: "Total users",
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
          Clients: "Klienter",
          Classification: "Klassifikation",
          Inspection_type: "Inspektionstype",
          About: "Om",
          Contact: "Kontakt",
          Role: "Rolle",
          Create_client: "Opret klient",
          Open: "Åben",
          Profile: "Profil",
          Dashboard: "Dashboard",
          Account: "Konto",
          Logout: "Log ud",
          Map_view: "Kortvisning",
          Manage_class: "Administrer klasse",
          Manage_users: "Administrer brugere",
          Total_properties: "Samlede egenskaber",
          Total_maps: "Samlede kort",
          Total_users: "Samlede brugere",
        },
      },
    },

    // interpolation: {
    //   escapeValue: false,
    // },
  });
