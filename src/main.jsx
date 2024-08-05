import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { UserContextProvider } from "./appContext";
import { cacheRtl, theme } from "./pages/constants";
import './i18n'
import { ThemeContextProvider } from './ThemeContext';
import { CacheProvider } from '@emotion/react';
import MyCacheProvider from './MyCacheProvider';

// console.log = function() {}

createRoot(document.querySelector("#root")).render(
  <UserContextProvider>
    <ThemeContextProvider>
      {/* <CacheProvider value={cacheRtl}> */}
      <MyCacheProvider>

        <RouterProvider router={router} />
      </MyCacheProvider>

      {/* </CacheProvider> */}
    </ThemeContextProvider>
  </UserContextProvider>
);
