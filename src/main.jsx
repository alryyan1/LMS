import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { UserContextProvider } from "./appContext";
import { cacheRtl, theme } from "./pages/constants";
import "./i18n";
import { ThemeContextProvider } from "./ThemeContext";
import { CacheProvider } from "@emotion/react";
import MyCacheProvider from "./MyCacheProvider";
import App from "./App";
import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// console.log = function() {}

createRoot(document.querySelector("#root")).render(
  <Suspense
    fallback={
      <div
        style={{
          height: "100vh",
          display: "flex",
          padding:'10px',
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <CircularProgress />
      </div>
    }
  >    <DndProvider backend={HTML5Backend}>

    <UserContextProvider>
      <ThemeContextProvider>
        <CacheProvider value={cacheRtl}>
          <MyCacheProvider>
            <RouterProvider router={router}></RouterProvider>
          </MyCacheProvider>
        </CacheProvider>
      </ThemeContextProvider>
    </UserContextProvider>
    </DndProvider>
  </Suspense>
);
