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

export const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    errorElement: <Error404 />,
    children: [
    
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
        path: "/laboratory",
        element: <ProtectedRoute><LabLayout /></ProtectedRoute>,

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
