import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Error404 from "./Error404";
import LabTests from "./pages/LabTests";
import AddPatient from "./pages/AddPatient";
import Doctor from "./Doctor";
import Client from "./pages/inventory/Client";
import InventoryNav from "./pages/inventory/InventoryNav";
import Supplier from "./pages/inventory/Supplier";
import Item from "./pages/inventory/Item";
import Section from "./pages/inventory/Section";
import { url } from "./pages/constants";
export const router = createBrowserRouter([
  {
    element: <App />,
    path : '/',
    errorElement: <Error404 />,
    children: [
    
      {
        path: "/tests",
        loader :()=>{
          return fetch("http://127.0.0.1/projects/bootstraped/new/api.php?all_tests=1")
        },
        element: <LabTests />,
        
      },
      {
        path:'/add',
      
        element : <AddPatient/>
      }
      ,
      {
        path:'/inventory',
        element : <InventoryNav/>,
        children :[
          {
            path:'client/create',
            element : <Client/>
          } ,
          {
            path:'supplier/create',
            element : <Supplier/>
          }  
          ,
          {
            path:'item/create',
            loader:({request:{signal}})=>{
              //fetch all sections
              return fetch(`${url}sections/all`,{signal})
            },
            element : <Item/>
          }  
          ,
          {
            path:'section/create',
            element : <Section/>
          }  
        ]
      }
    ],
  },
]);
