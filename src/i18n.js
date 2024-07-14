import i18next from "i18next";
import i18nextBrowserLanguagedetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next.use(i18nextBrowserLanguagedetector).use(initReactI18next).init({
    debug: true,
    lng: "ar",
    resources :{
        ar:{
            translation:{
                define:'تعريف منتج',
                income:'فاتوره وارد جديد',
                
                sales:'المبيعات',
                items:'قائمه المنتجات',
                pos:'نافذه البيع',
                inventory:'المخزن',
                audit:'التدقيق',
                signup:'انشاء حساب ',
                login:'الدخول',
                lab:'المختبر',
                clinic:'العيادات',
                pharma:'الصيدليه',
                services:'الخدمات',
                 Addnewuser:'اضافه مستخدم',
                insurance:'التعاقدات',
                settings:'الاعدادات',
                dashboard:'الرئيسيه',
                name : "الاسم",
                phone : "الهاتف",
                item : "الصنف",
                date : "التاريخ",
                state : "الحاله",
                addShip:'اضافه شحنه',
                nameValidation :'يجب ادخال اسم',
                phoneValidation :'يجب ادخال الهاتف',
                supplierValidation :"يجب اختيار المورد",
                expenses:'المصروفات',
                supplier:'المورد',
                dateValidation :" يجب اختيار التاريخ  ",
                invoiceDate:"تاريخ الفاتوره",
                billNumber:'رقم الفاتوره',
                billNumberValidation:'يجب ادخال رقم الفاتوره',
                save:'حفظ',
                search:'بحث',
                pharmacy:'الصيدليه',
            }
        },
        en:{
            translation:{
                pharmacy:'pharmacy',

                invoiceDate:"Invoice Purchase Date",
                billNumberValidation:"Invoice Purchase Number must be provided",
                save:'save',
                search:'search',

                dateValidation :"Date must be provided",
                supplierValidation :"Supplier must be provided",
                supplier:'Supplier',
                expenses:'expenses',
                income:'New Purchase Invoice',
                sales:'sales',
                items:'items',
                define:'define item',
                pos:'POS',
                Addnewuser:'Add new user',
                signup:'Sign up',
                audit:'Finance Audit',

                name:'name',
                inventory:'inventory',
                login:'login',
                lab:'lab',
                clinic:'Clinic',
                pharma:'pharmacy',
                services:'services',
                insurance:'insurance',
                settings:'settings',
                dashboard:'dashboard',
                billNumber:'bill number',
            }
            
        },
        ch:{
            translation:{
                name : "姓名",
                phone : "电话",
                item : "物品",
                date : "日期",
                state : "状态",
                addShip:'藝術本身',
                nameValidation :'星空卫视',
                phoneValidation :'您必须输入电话号码',


            }
        }
    }
    

})

