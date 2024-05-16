import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Error404 from "./Error404";
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


export const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    errorElement: <Error404 />,
    children: [
      {
        path: "*",
        element: <Login />,
      },
      {
        element: <GuestLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/signup",
            element: <SignUp />,
          },
        ],
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
            path: "supplier/create",
            element: <Supplier />,
          },
          {
            path: "item/create",
            loader: ({ request: { signal } }) => {
              //fetch all sections
              return fetch(`${url}sections/all`, { signal });
            },
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
        element:<ReceptionLayout/>,
        children: [
          {
            index:true ,
            element: (
              <ProtectedRoute>
                <Reception />
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
            loader: () => {
              return fetch(
                "http://127.0.0.1/projects/bootstraped/new/api.php?all_tests=1"
              );
            },
            element: <LabTests />,
          },
          {
            path: "add",

            element: <AddPatient />,
          },
        ],
      },
    ],
  },
]);
