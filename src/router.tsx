import { createBrowserRouter,createHashRouter, RouteObject } from "react-router-dom";
import App from "./App";
import LabTests from "./pages/Laboratory/LabTests";
import AddPatient from "./pages/Laboratory/AddPatient";
import Client from "./pages/inventory/Client";
import InventoryNav from "./pages/inventory/InventoryNav";
import Supplier from "./pages/inventory/Supplier";
import Item from "./pages/inventory/Item";
import Section from "./pages/inventory/Section";
import { url } from "./pages/constants";
import InventoryIncome from "./pages/inventory/InventoryIncome";
import DeductInventory from "./pages/inventory/DeductInventory";
import Balance from "./pages/inventory/Balance";
import Login from "./pages/Login";
import GuestLayout from "./GuestLayout";
import SignUp from "./pages/Singeup";
import LabLayout from "./LabLayout";
import Report from "./pages/inventory/Report";
import ProtectedRoute from "./ProtectedRoute";
import AddInsurance from "./pages/insurance/AddInsurance";
import InsuranceNav from "./pages/insurance/InsuranceNav";
import LabList from "./pages/insurance/LabList";
import ServiceNav from "./pages/services/ServiceNav";
import AddService from "./pages/services/AddService";
import AddServiceGroup from "./pages/services/addServiceGroup";
import ServiceList from "./pages/insurance/ServiceList";
import DeductReport from "./pages/inventory/DeductReport";
import Reception from "./pages/Clinic/Reception";
import ReceptionLayout from "./pages/Clinic/RecptionLayout";
import SettingsNav from "./pages/settings/SettingsNav";
import Doctors from "./pages/settings/Doctors";
import Specialists from "./pages/settings/Specialists";
import ItemState from "./pages/inventory/ItemState";
import ItemNavStatistics from "./pages/inventory/ItemNavStatistics";
import ItemStatisticsLine from "./pages/inventory/ItemStatisticsLine";
import ItemStatisticsPie from "./pages/inventory/ItemStatisticsPie";
import DeductRequest from "./pages/inventory/DeductRequest";
import PriceList from "./pages/Laboratory/PriceList";
import LoginCardInventory from "./loginCardInventory";
import Error404 from "./pages/Dialogs/Error404";
import Dashboard from "./Dashboard";
import AddSubcompany from "./pages/insurance/AddSubcompany";
import AddRelation from "./pages/insurance/AddRelation";
import AddShip from "./pages/shipping/AddShip";
import ShippingNav from "./pages/shipping/ShippingNav";
import FindShipping from "./pages/shipping/FindShipping";
import Permissions from "./pages/settings/Permissions";
import Users from "./pages/settings/Users";
import DoctorsCredits from "./pages/Clinic/DoctorsCredits";
import CashDenos from "./pages/Clinic/CashDenos";
import Result from "./pages/Laboratory/Result";
import CBCLIS from "./pages/Laboratory/CBCLIS";
import ChemistryLIS from "./pages/Laboratory/ChemistryLis";
import Sample from "./pages/Laboratory/Sample";
import PaperConfig from "./pages/settings/PaperConfig";
import PharmacyLayout from "./pages/pharmacy/PharmacyLayout";
import AddDrug from "./pages/pharmacy/AddDrug";
import SellDrug from "./pages/pharmacy/Sell";
import DrugItems from "./pages/pharmacy/DrugItems";
import SalesReport from "./pages/pharmacy/SalesReport";
import ItemsInventory from "./pages/pharmacy/ItemsInventory";
import ItemDeposit from "./pages/pharmacy/ItemDeposit";
import Audit from "./pages/Audit";
import Contracts from "./pages/Contracts";
import Doctor from "./pages/doctor/doctor";
import MoneyIncome from "./pages/Finance/MoneyIncome";
import MoneyExpenses from "./pages/Finance/MoneyExpenses";
import FinanceNav from "./pages/Finance/FinanceNav";
import FinanceSection from "./pages/Finance/FinanceSection";
import FinanceAccount from "./pages/Finance/FinanceAccount";
import AccountEntries from "./pages/Finance/AccountEntries";
import Ledger from "./pages/Finance/Ledger";
import CopyContract from "./pages/insurance/CopyContract";
import HormoneLis from "./pages/Laboratory/HormoneLis";
import TrialBalance from "./pages/Finance/TrialBalance";
import PaymentSuppliers from "./pages/pharmacy/PaymentSuppliers";
import AddNewEmployee from "./pages/hr/AddNewEmployee";
import Chemwell from "./pages/Chemwell";
import MyTree from "./pages/Finance/Tree";
import Nurse from "./pages/doctor/Nurse";
import Patients from "./pages/Patients";
import Reclaim from "./pages/insurance/Reclaim";
import ToothChart from "./pages/Dentist/ToothChart";
import SalesTable from "./pages/inventory/SalesTable";
import AllReports from "./AllReports";
import PhramacyReclaim from "./PhramacyReclaim";
import Error from "./pages/Error";
import Expense from "./pages/Finance/Expense";
import Gallary from "./pages/Finance/Gallary";
import IncomeStatement from "./pages/Finance/IncomeStatement";
import BalanceSheet from "./pages/Finance/BalanceSheet";
import TreeTwo from "./pages/Finance/Tree2";
import DoctorScheduleManager from "./pages/booking/book";
import DoctorFinanceLink from "./pages/Finance/DocotrAccountingLink";
import CompanyAccountingLink from "./pages/Finance/ComanyiesAccounting";
import Stats from "./pages/settings/Stats";


const  guest:RouteObject =    {
  element: <GuestLayout />,

  children: [
    {
      
      path: "login",
      element: <Login  />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
  ],
}
const tooth:RouteObject = {
  path: "/tooth",
  element: <ToothChart/> ,
}
const settings:RouteObject = {
  path: "/settings",
  element: (
    <ProtectedRoute>
      <SettingsNav />
    </ProtectedRoute>
  ),
  children: [
    {
      path: "doctors",
      element: <Doctors />,
    },
    
    {
      path: "specialists",
      element: <Specialists />,
    },
    {
      path: "tests",
      element: <Specialists />,
    },
    {
      path: "permissions",
      element: <Permissions />,
    },
    {
      path: "users",
      element: <Users />,
    },
    {
      path: "paperConfig",
      element: <PaperConfig />,
    },
    {
      path: "create",
      element: <AddService />,
    },
    {
      path: "serviceGroup/create",
      element: <AddServiceGroup />,
    },
  ],
}
const reports:RouteObject = {
  path: "allReports",
  element: (
    <ProtectedRoute>
      <AllReports />
    </ProtectedRoute>
  ),
}
const denos:RouteObject =  {
  path: "denos",
  element: (
    <ProtectedRoute>
      <CashDenos />
    </ProtectedRoute>
  ),
}
const dashboard:RouteObject =   {
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
  path: "/dashboard",
}
const stats:RouteObject =   {
  element: (
    <ProtectedRoute>
      <Stats />
    </ProtectedRoute>
  ),
  path: "/stats",
}
const patients:RouteObject =    {
  element: (
    <ProtectedRoute>
      <Patients />
    </ProtectedRoute>
  ),
  path: "/patients",
}
const doctors:RouteObject =  {
  element: (
    <ProtectedRoute>
      <Doctor />
    </ProtectedRoute>
  ),
  path: "/doctor",
}
const doctor:RouteObject = 
{
  element: (
    <ProtectedRoute>
      <Doctor />
    </ProtectedRoute>
  ),
  path: "doctor/:id",
}
const nurse:RouteObject =  {
  element: (
    <ProtectedRoute>
      <Nurse />
    </ProtectedRoute>
  ),
  path: "nurse",
}
const contracts:RouteObject     ={
  element: (
    <ProtectedRoute>
      <Contracts />
    </ProtectedRoute>
  ),
  path: "/contracts",
}
const income:RouteObject = {
  element: (
    <ProtectedRoute>
      <MoneyIncome />
    </ProtectedRoute>
  ),
  path: "/moneyIncome",
}
const doctorSchedule:RouteObject = {
  element: (
    <ProtectedRoute>
      <DoctorScheduleManager />
    </ProtectedRoute>
  ),
  path: "/doctorSchedule",
}
const audit:RouteObject =    {
  element: (
    <ProtectedRoute>
      <Audit />
    </ProtectedRoute>
  ),
  path: "/audit",
}
const finance:RouteObject =   {
        path: "/finance",
        element: (
          <ProtectedRoute>
            <FinanceNav />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "account",
            element: <FinanceAccount />,
          },

          {
            path: "entries",
            element: <AccountEntries />,
          },
          {
            path: "ledger",
            element: <Ledger />,
          }
          ,
          {
            path: "trialBalance",
            element: <TrialBalance />,
          },
          {
            path: "tree",
            element: <MyTree />,
          },
          {
            path: "tree2",
            element: <TreeTwo />,
          },
          {
            path: "doctor-accounting-link",
            element: <DoctorFinanceLink />,
          },
          {
            path: "company-accounting-link",
            element: <CompanyAccountingLink />,
          },
          {
            path: "section",
            element: <FinanceSection />,
          },
          {
            path: "expense",
            element: <Expense />,
          },
          {
            path: "gallary",
            element: <Gallary />,
          },
          {
            path: "incomeStatement",
            element: <IncomeStatement />,
          },
          {
            path: "balanceSheet",
            element: <BalanceSheet />,
          },
        ],
      };

const clinic:RouteObject =  {
  path: "clinic",
  element: <ReceptionLayout />,
  children: [
    {
      index: true,
      element: (
        <ProtectedRoute>
          <Reception />
        </ProtectedRoute>
      ),
    },
    {
      path: "doctors",
      element: (
        <ProtectedRoute>
          <DoctorsCredits />
        </ProtectedRoute>
      ),
    },
  
  ],
}
const pharmacy:RouteObject =
{
  path: "/pharmacy",
  element: <PharmacyLayout />,
  children: [
    {
      path: "add",

      element: (
        <ProtectedRoute>
          <AddDrug />
        </ProtectedRoute>
      ),
    },
    {
      path: "client/create",
      element: <Client />,
    },
    {
      path: "supplier/create",
      element: <Supplier />,
    },
    {
      path: "sell",
      element: (
        <ProtectedRoute>
          <SellDrug />
        </ProtectedRoute>
      ),
    },
    {
      path: "salesTable",
      element: (
        <ProtectedRoute>
          <SalesTable />
        </ProtectedRoute>
      ),
    },
    {
      path: "reclaim",
      element: (
        <ProtectedRoute>
          <PhramacyReclaim />
        </ProtectedRoute>
      ),
    },
    {
      path: "items/:id?",
      element: (
        <ProtectedRoute>
          <DrugItems />
        </ProtectedRoute>
      ),
    },
    {
      path: "reports",
      element: (
        <ProtectedRoute>
          <SalesReport />
        </ProtectedRoute>
      ),
    },
    {
      path: "quantities",
      element: (
        <ProtectedRoute>
          <ItemsInventory />
        </ProtectedRoute>
      ),
    },
    {
      path: "deposit/:id?",
      element: (
        <ProtectedRoute>
          <ItemDeposit />
        </ProtectedRoute>
      ),
    },
   
  ],
}

const insurance:RouteObject=   {
  path: "/insurance",
  element: <InsuranceNav />,
  children: [
    {
      path: "create",
      element: <AddInsurance />,
    },
    {
      path: "reclaim",
      element: <Reclaim />,
    },
    {
      path: "subcomapny",
      element: <AddSubcompany />,
    },
    {
      path: "relation",
      element: <AddRelation />,
    },
    {
      path: "lab",
      element: <LabList />,
    },
    {
      path: "service",
      element: <ServiceList />,
    },
    {
      path: "copy",
      element: <CopyContract />,
    },
  ],
}
const lab:RouteObject = {
  path: "/laboratory",
  element: (
    <ProtectedRoute>
      <LabLayout />
    </ProtectedRoute>
  ),

  children: [
    {
      path: "tests",

      element: <LabTests />,
    },
    {
      path: "add",

      element: <AddPatient />,
    },
    {
      path: "result",

      element: <Result />,
    },
    {
      path: "sample",

      element: <Sample />,
    },
    {
      path: "price",

      element: <PriceList />,
    },

    {
      path: "cbc-lis",

      element: <CBCLIS />,
    },

    {
      path: "chemistry-lis",

      element: <ChemistryLIS />,
    },
   
    {
      path: "hormone-lis",

      element: <HormoneLis/>,
    },
  ],
}
const Authorized: RouteObject = {
  path: "/",
  element: <App />,
  errorElement: <Error />,
  children:[
    guest,
    tooth,
    settings,
    reports,denos, 
    dashboard,
    patients,
    doctors,
    doctor,
    nurse,
    contracts,income,
    audit,
    finance,pharmacy
    ,insurance,lab,clinic,doctorSchedule,stats
    
    
  ]
};
export const router = createHashRouter([

  Authorized
]);
