import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { UserContextProvider } from "./appContext";


createRoot(document.querySelector("#root")).render(
  <UserContextProvider>
    <RouterProvider router={router}/>
  </UserContextProvider>

    
);
