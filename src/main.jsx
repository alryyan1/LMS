import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { UserContextProvider } from "./appContext";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import { cacheRtl, theme } from "./pages/constants";
import './i18n'
// console.log = function() {}

createRoot(document.querySelector("#root")).render(
  <UserContextProvider>
    <ThemeProvider theme={theme}>
      <CacheProvider value={cacheRtl}>
        <RouterProvider router={router} />
      </CacheProvider>
    </ThemeProvider>
  </UserContextProvider>
);
