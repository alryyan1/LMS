import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Error404 from "./Error404";
import LabTests from "./pages/LabTests";
import AddPatient from "./pages/AddPatient";
import Doctor from "./Doctor";
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
        path:'/doctor',
        element : <Doctor/>
      }
    ],
  },
]);
