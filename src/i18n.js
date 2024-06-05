import i18next from "i18next";
import i18nextBrowserLanguagedetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next.use(i18nextBrowserLanguagedetector).use(initReactI18next).init({
    debug: true,
    lng: "ar",
    resources :{
        ar:{
            translation:{
                name : "الاسم",
                phone : "الهاتف",
                item : "الصنف",
                date : "التاريخ",
                state : "الحاله",
                addShip:'اضافه شحنه'
            }
        },
        ch:{
            translation:{
                name : "姓名",
                phone : "电话",
                item : "物品",
                date : "日期",
                state : "状态",
                addShip:'藝術本身'

            }
        }
    }
    

})