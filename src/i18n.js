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
                pos2:'نافذه البيع',
                inventory:'المخزن',
                audit:'التدقيق',
                signup:'انشاء حساب ',
                login:'تسجيل الدخول',
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
                pos:'نظام نقاط البيع',
                usernameValidation :'استم المستخدم مطلوب',
                usernameValidationMessage :' يجب اسم المتسخدم ان يكون اكثر من 6 احرف',
                password:'كلمه السر',
                username:'اسم المستخدم',
                passwordValidationMessage :"الحقل مطلوب",
                passwordValidationMessageLength :'لا يمكن ان يكون الباسورد اقل من 8 احرف',
                doctors:'الاطباء',
                specialists:'التخصصات',
                users:'المستخدمين',
                permissions:'الصلاحيات',
                other:'اخري'
                
            }
        },
        en:{
            translation:{
                other:'other',
                permissions:'permissions',

                doctors:'doctors',
                users:'users',
                specialists:'Specialists',
                password: 'password',
                username:'username',
                passwordValidationMessageLength: "password must be 8 chrachters long",
                  passwordValidationMessage: "password is required",
                usernameValidationMessage: "username must be at least 6 characters long",
                usernameValidation:"username is required",
                pos:'Point of sales',

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
                pos2:'POS',
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

