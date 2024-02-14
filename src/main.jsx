import { createRoot } from "react-dom/client";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error404 from "./Error404";
const router = createBrowserRouter([{ element: <App /> , path: '/',errorElement :<Error404/> }]);

createRoot(document.querySelector("#root")).render(
  <RouterProvider router={router}>
    <App />
  </RouterProvider>
);
