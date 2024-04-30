import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { UserContextProvider } from "./appContext";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import { cacheRtl, theme } from "./pages/constants";

createRoot(document.querySelector("#root")).render(
  <UserContextProvider>
    <ThemeProvider theme={theme}>
      <CacheProvider value={cacheRtl}>
        <RouterProvider router={router} />
      </CacheProvider>
    </ThemeProvider>
  </UserContextProvider>
);
