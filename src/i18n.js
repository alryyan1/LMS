import i18next from "i18next";
import i18nextBrowserLanguagedetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next.use(i18nextBrowserLanguagedetector).use(initReactI18next).init({
    debug: true,
    lng: "en",
    resources :{
        eng:{
            translation:{
                hello : "hello",
            }
        },
        ar:{
            translation:{
                hello : "مرحبا",
            }
        }
    }
    

})