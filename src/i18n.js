import i18next from "i18next";
import i18nextBrowserLanguagedetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next.use(i18nextBrowserLanguagedetector).use(initReactI18next).init({
    debug: true,
    lng: "ar",
    resources :{
        ar:{
            translation:{
                finance:'الحسابات',
                print_time:'زمن الطباعه',
                register_lab_patient:'التسجيل  ',
                patient_name:'اسم المريض',
                patientNameValidation:'يجب ادخال اسم المريض',
                cardNoValidation:"يجب ادخال رقم البطاقه",
                register:'التسجيل',
                define:'تعريف منتج',
                income:'فاتوره وارد جديد',
                quantities:'حركه المخزون',
                
                sales:'الطلبات',
                oms:'نظام اداره الطلبات',
                items:'قائمه المنتجات',
                pos:' طلب جديد',
                inventory:'اداره المخزن',
                audit:'التدقيق',
                signup:'انشاء حساب ',
                login:'تسجيل الدخول',
                lab:'المختبر',
                clinic:'العيادات',
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
                other:'اخري',
                cardNo:'رقم البطاقه',
                guarantor_name:'اسم الضامن',
                sub_company:'الجهه',
                relation_name:'العلاقه',
                phoneLengthValidation:"يجب ان يكون رقم الهاتف مكون من 10 ارقام",
                doctor_name:'اسم الطبيب  ',
                yearValildation:"يجب ادخال العمر بالسنه",
                ageInYear:'السنه',
                ageInMonth :'الشهر',
                ageInDays :'اليوم',
                male:"ذكر",
                female:"انثي",
                company:'الشركه',
                doctor:'الطبيب',
                time:'الزمن',
                registered_by:'سجل بواسطه',
                age:'العمر',
                copy_patient :'نسخ مريض',
                gender:'النوع',
                booking:'الحجز',
                result_entry:'ادخال النتائج',
                sample_collection:'سحب العيات',
                test_management:'اداره التحاليل',
                price_list:'قائمه الاسعار ',
                doctor_reclaim:'استحقاق الاطباء',
                cash_count:'حساب الفئات',
                moneyIncome:" الايرادات",
                MoneyExpenses:"المصروفات ",
                pharma:'نظام اداره الطلبات',
                
            }
        },
        en:{
            translation:{
                pharma:'OMS',
                quantities:'quantities',
                oms:'Orders Management System',

                moneyIncome:"Money Income",
                MoneyExpenses:"Money Expenses",
                cash_count:'Cash count' ,
                print_time:'print time',
                finance:'finance',

                booking:'booking',
                doctor_reclaim:"doctor_reclaim",
                test_management:'Test management',
                price_list:' Price List ',

                sample_collection:'sample collection',
                gender:'gender',
                register_lab_patient:'Lab Register',
                result_entry:'Result Entry',

                doctor:'doctor',
                female:"female",
                male:"male",
                name:'name',
                registered_by:'Registered By',
                age:'age',
                copy_patient :'copy_patient',
                ageInMonth :'Month',
                ageInDays :'Days',
                ageInYear:'Year',
                yearValildation:"Patient age in Years",

                doctor_name:'Doctor Name ',
                patientNameValidation:' Patient Name must be provied  ',
                patient_name:'Patient name',

                phoneLengthValidation:"phone length must be equal 10 digits",

                phoneValidation :'phone must be valid',
                cardNoValidation:"Card number must be provided   ",
                cardNo:'Insurance No',
                guarantor_name:'Guarantor Name',
                sub_company:'sub_company',
                company:'company',
                relation_name:'relation name',

                register:'Register',
                other:'other',
                permissions:'permissions',

                doctors:'doctors',
                users:'users',
                specialists:'Specialists',
                password: 'password',
                username:'username',
                time:'time',
                passwordValidationMessageLength: "password must be 8 chrachters long",
                  passwordValidationMessage: "password is required",
                usernameValidationMessage: "username must be at least 6 characters long",
                usernameValidation:"username is required",

                invoiceDate:"Invoice Purchase Date",
                billNumberValidation:"Invoice Purchase Number must be provided",
                save:'save',
                search:'search',
                date:'date',

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

                inventory:'inventory Mangement',
                login:'login',
                lab:'lab',
                clinic:'Clinic',
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

