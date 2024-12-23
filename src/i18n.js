import i18next from "i18next";
import i18nextBrowserLanguagedetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next
  .use(i18nextBrowserLanguagedetector)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: "ar",
    resources: {
      ar: {
        translation: {
          salesTable:'المبيعات والارباح',
          reports:'التقارير',
          allReports:'التقارير',
          finance: "الحسابات",
          print_time: "زمن الطباعه",
          register_lab_patient: "التسجيل  ",
          patient_name: "اسم المريض",
          patientNameValidation: "يجب ادخال اسم المريض",
          cardNoValidation: "يجب ادخال رقم البطاقه",
          register: "التسجيل",
          define: "تعريف منتج",
          income: "  المشتروات",
          quantities: "حركه المخزون",

          sales: "المبيعات",
          items: "قائمه المنتجات",
          pos: "نافذه البيع",
          inventory: "المخزن",
          audit: "التدقيق",
          signup: "انشاء حساب ",
          login: "تسجيل الدخول",
          lab: "المختبر",
          clinic: "العيادات",
          pharma: "الصيدليه",
          services: "الخدمات",
          Addnewuser: "اضافه مستخدم",
          insurance: "التعاقدات",
          settings: "الاعدادات",
          dashboard: "الرئيسيه",
          name: "الاسم",
          phone: "الهاتف",
          item: "الصنف",
          date: "التاريخ",
          state: "الحاله",
          addShip: "اضافه شحنه",
          nameValidation: "يجب ادخال اسم",
          phoneValidation: "يجب ادخال الهاتف",
          supplierValidation: "يجب اختيار المورد",
          expenses: "المصروفات",
          supplier: "المورد",
          dateValidation: " يجب اختيار التاريخ  ",
          invoiceDate: "تاريخ الفاتوره",
          billNumber: "رقم الفاتوره",
          billNumberValidation: "يجب ادخال رقم الفاتوره",
          save: "حفظ",
          search: "بحث",
          pharmacy: "الصيدليه",
          usernameValidation: "استم المستخدم مطلوب",
          usernameValidationMessage: " يجب اسم المتسخدم ان يكون اكثر من 6 احرف",
          password: "كلمه السر",
          username: "اسم المستخدم",
          passwordValidationMessage: "الحقل مطلوب",
          passwordValidationMessageLength:
            "لا يمكن ان يكون الباسورد اقل من 8 احرف",
          doctors: "الاطباء",
          specialists: "التخصصات",
          users: "المستخدمين",
          permissions: "الصلاحيات",
          other: "اخري",
          cardNo: "رقم البطاقه",
          guarantor_name: "اسم الضامن",
          sub_company: "الجهه",
          relation_name: "العلاقه",
          phoneLengthValidation: "يجب ان يكون رقم الهاتف مكون من 10 ارقام",
          doctor_name: "اسم الطبيب  ",
          yearValildation: "يجب ادخال العمر بالسنه",
          ageInYear: "السنه",
          ageInMonth: "الشهر",
          ageInDays: "اليوم",
          male: "ذكر",
          female: "انثي",
          company: "الشركه",
          doctor: "الطبيب",
          time: "الزمن",
          registered_by: "سجل بواسطه",
          age: "العمر",
          copy_patient: "نسخ مريض",
          gender: "النوع",
          booking: "الحجز",
          result_entry: "ادخال النتائج",
          sample_collection: "سحب العيات",
          test_management: "اداره التحاليل",
          price_list: "قائمه الاسعار ",
          doctor_reclaim: "استحقاق الاطباء",
          cash_count: "حساب الفئات",
          moneyIncome: " الايرادات",
          MoneyExpenses: "المصروفات ",
          supplierInvoices: "المشتروات ",
          clients: "العملاء ",
          suppliers: "الموردون ",
          govIdValidation:'يجب ادخال الحقل',
          servicesPanel: 'قائمه الخدمات',
          newAccount:'حساب جديد',
          price:'السعر',
          paid:'المدفوع',
          bank:'البنك',
          pay:'دفع',
          country:'الجنسيه',
          paycheckMsg:'هل توكد استلامك مبلغ قدره ',
          fileId:'رقم الملف',
          requestedBy:'اضيفه بواسطه',
          address:'العنوان',
          journalEntry:'قيود اليوميه',
          ledger:'الدفتر الاستاذ',
          trialBalance:'ميزان المراجعه',
          departments:'الاقسام',
          govId:' رقم بطاقه مدنيه ',
          patients:'المرضي',
          city:'المدينه',
          zipCode:'الرمز البريدي',
          accountNumber:'رقم الحساب',
          bankName:'ا��م البنك',
          denos :'الحاسبه',
          pharmacyReclaim:'المطالبه'

          

        },

      },
      en: {
        translation: {
          

           reports:'reports',
          finance: "finance",
          patients:'patients',
         address:'Address',
         country:'Country',
          journalEntry:'Journal Entry',
          ledger:'Ledger',
          trialBalance:'Trial Balance',
          departments:'Departments',
          paycheckMsg:'are you sure you recieved this amount?',
          newAccount:'New Account',
          govIdValidation:'required field',
            clients: "clients ",
          suppliers: "suppliers ",
          supplierInvoices: "Puchases ",
          allReports:'System Reports',
          salesTable:'Sales &  Profit',

          quantities: "quantities",
          denos :'Money Calculator',
          moneyIncome: "Money Income",
          MoneyExpenses: "Money Expenses",
          cash_count: "Cash count",

          booking: "booking",
          doctor_reclaim: "doctor_reclaim",
          test_management: "Test management",
          price_list: " Price List ",

          sample_collection: "sample collection",
          gender: "Gender",
          register_lab_patient: "Lab Register",
          result_entry: "Result Entry",

          doctor: "doctor",
          female: "female",
          male: "male",
          name: "name",
          registered_by: "Registered By",
          age: "age",
          copy_patient: "copy_patient",
          ageInMonth: "Month",
          ageInDays: "Days",
          ageInYear: "Year",
          yearValildation: "Patient age in Years",

          doctor_name: "Doctor Name ",
          patientNameValidation: " Patient Name must be provied  ",
          patient_name: "Patient name",

          phoneLengthValidation: "phone length must be equal 10 digits",

          phoneValidation: "phone must be valid",
          cardNoValidation: "Card number must be provided   ",
          cardNo: "Insurance No",
          guarantor_name: "Guarantor Name",
          sub_company: "sub_company",
          company: "company",
          relation_name: "relation name",

          register: "Register",
          other: "other",
          permissions: "permissions",

          doctors: "doctors",
          users: "users",
          specialists: "Specialists",
          password: "password",
          username: "username",
          time: "time",
          passwordValidationMessageLength: "password must be 8 chrachters long",
          passwordValidationMessage: "password is required",
          usernameValidationMessage:
            "username must be at least 6 characters long",
          usernameValidation: "username is required",
          pharmacy: "pharmacy",

          invoiceDate: "Invoice Purchase Date",
          billNumberValidation: "Invoice Purchase Number must be provided",
          save: "save",
          search: "search",
          date: "date",

          dateValidation: "Date must be provided",
          supplierValidation: "Supplier must be provided",
          supplier: "Supplier",
          expenses: "expenses",
          income: "New Purchase Invoice",
          sales: "sales",
          
          items: "items",
          define: "define item",
          pos: "POS",
          Addnewuser: "Add new user",
          signup: "Sign up",
          audit: "Finance Audit",
          govId:'Cevil ID',
          inventory: "inventory",
          login: "login",
          lab: "lab",
          clinic: "Clinic",
          pharma: "pharmacy",
          services: "services",
          insurance: "insurance",
          settings: "settings",
          dashboard: "dashboard",
          billNumber: "bill number",
          pharmacyReclaim:'Insurance Reclaim'

        },
      },
      ch: {
        translation: {
          name: "姓名",
          phone: "电话",
          item: "物品",
          date: "日期",
          state: "状态",
          addShip: "藝術本身",
          nameValidation: "星空卫视",
          phoneValidation: "您必须输入电话号码",
        },
      },
    },
  });
