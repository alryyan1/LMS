import { createBrowserRouter } from "react-router-dom";
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

export const router = createBrowserRouter([
  {
    path: 'shipping/:id',
    element: (
        <FindShipping/>
       
    ),
  },
  {

    
    element: <App />,
    path: "/",
    errorElement: <Error404 />,
    children: [
  
  
      {
        element: <GuestLayout />,
       
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "/signup",
            element: <SignUp />,
          },
         
        ],
      },
      {
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
        ],
      },
      {

        element : <ProtectedRoute><Dashboard/></ProtectedRoute> ,
        path:"/dashboard",

      },
      {

        element : <ProtectedRoute><Doctor/></ProtectedRoute> ,
        path:"doctor/:id",

      },
      {

        element : <ProtectedRoute><Contracts/></ProtectedRoute> ,
        path:"/contracts",

      },
      {

        element :<ProtectedRoute>
          <Audit/>
        </ProtectedRoute>,
        path:"/audit",

      },
      {
        path: "/inventory",
        element: (
          <ProtectedRoute>
            <InventoryNav />
           </ProtectedRoute>
        ),
        children: [
          {
            path: "client/create",
            element: <Client />,
          },
          {
            path: "item/state",
            element: <ItemState />,
       
            
          },
          {
            path: "item/login",
            element: <LoginCardInventory />,
           
            
          },
          {
            path: "supplier/create",
            element: <Supplier />,
          },
          {
            path: "item/create",
       
            element: <Item />,
          },
          {
            path: "section/create",
            element: <Section />,
          },

          {
            path: "reports/income",
            element: <Report />,
          },
          {
            path: "reports/deduct",
            element: <DeductReport />,
          },
          {
            path: "income/request",
            loader: ({ request: { signal } }) => {
              //fetch all items
              return fetch(`${url}items/all`, { signal });
            },
            element: <DeductRequest />,
          },
          {
            path: "item/statistics",
            element: <ItemNavStatistics />,
            children: [
              {
                path: "line",
                element: <ItemStatisticsLine />,
                loader: ({ request: { signal } }) => {
                  //fetch all items
                  return fetch(`${url}items/all`, { signal });
                },
                
              },
              {
                path: "pie",
                element: <ItemStatisticsPie />,
                loader: ({ request: { signal } }) => {
                  //fetch all sections
                  return fetch(`${url}sections/all`, { signal });
                },
              
                
              },
            ],
          },
          {
            path: "income/create",
            loader: ({ request: { signal } }) => {
              //fetch all items
              return fetch(`${url}items/all`, { signal });
            },
            element: <InventoryIncome />,
          },
          {
            path: "income/deduct",
            loader: ({ request: { signal } }) => {
              //fetch all items
              return fetch(`${url}items/all`, { signal });
            },
            element: <DeductInventory />,
          },
          {
            path: "inventory/balance",

            element: <Balance />,
          },
        ],
      },
      {
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
          {
            path: "denos",
            element: (
              <ProtectedRoute>
                <CashDenos />
              </ProtectedRoute>
            ),
          },
        ],
      },


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
            path:'sell',
            element: (
              <ProtectedRoute>
                <SellDrug />
              </ProtectedRoute>
            ),
          },
          
          {
            path:'items',
            element: (
              <ProtectedRoute>
                <DrugItems />
              </ProtectedRoute>
            ),
          },
          {
            path:'reports',
            element: (
              <ProtectedRoute>
                <SalesReport />
              </ProtectedRoute>
            ),
          },
          {
            path:'inventory',
            element: (
              <ProtectedRoute>
                <ItemsInventory />
              </ProtectedRoute>
            ),
          },
          {
            path:'deposit',
            element: (
              <ProtectedRoute>
                <ItemDeposit />
              </ProtectedRoute>
            ),
          },
          {
            path: "denos",
            element: (
              <ProtectedRoute>
                <CashDenos />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "ship",
        element: <ShippingNav />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <AddShip/>
               
              </ProtectedRoute>
            ),
          },
         
        ],
      
      },
      
      {
        path: "/insurance",
        element: <InsuranceNav />,
        children: [
          {
            path: "create",
            element: <AddInsurance />,
          },
          {
            path: "subcomapny",
            element: <AddSubcompany/>,
          },
          {
            path: "relation",
            element: <AddRelation/>,
          },
          {
            path: "lab",
            element: <LabList />,
          },
          {
            path: "service",
            element: <ServiceList />,
          },
        ],
      },
      {
        path: "/services",
        element: <ServiceNav />,
        children: [
          {
            path: "create",
            element: <AddService />,
          },
          {
            path: "serviceGroup/create",
            element: <AddServiceGroup />,
          },
        ],
      },
      {
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

            element: 
            
            <AddPatient />,
          },
          {
            path: "result",

            element: 
            
            <Result />,
          },
          {
            path: "sample",

            element: <Sample />,
          },
          {
            path: "price",

            element: < PriceList/>,
          },
          
          {
            path: "cbc-lis",

            element: <CBCLIS/>,
          },
              
          {
            path: "chemistry-lis",

            element: <ChemistryLIS/>,
          },

        ],
      },
    ],
  },
]);
