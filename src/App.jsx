import "./app.css";
import "./index.css";
import "./pages/inventory/inventory.css";
import "./pages/Laboratory/tests.css";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";
import { useStateContext } from "./appContext";
import nurse from "./assets/images/nurse.jpg";
import heart from "./assets/images/heart.jpg";
import dental from "./assets/images/dental.jpg";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import SidebarNav from "./Sidebar";
import { Suspense } from "react";
import EmptyDialog from "./pages/Dialogs/EmptyDialog";
import { useAuthStore } from "./AuthStore";
import Login from "./pages/Login";
function App() {
  const location = useLocation();
  const { openLoginDialog, setCloseLoginDialog, setOpenLoginDialog } =
    useAuthStore((state) => state);

  const { user } = useStateContext();

  let image = "";
  if (user?.is_nurse) {
    image = `url("${nurse}")`;
  }
  if (user?.doctor) {
    image = `url("${heart}")`;
  }

  return (
    <>
      {/* <div
        style={{
          background: "var(--clr-2)",
          userSelect: "none",
          backgroundImage: `${dental} `,
          backgroundRepeat: "repeat",
        }}
        className="app-container"
      > */}
        {/* <div className="app-container2"> */}

        {/* <Outlet key={i18n.language} /> */}

        {/* </div> */}
        {/* </div> */}
        <div
          style={{
            display: "flex",
            height: "100vh",
            userSelect: "none",
            overflowX: "none",
          }}
        >
          {/* Sidebar */}
          {user && <SidebarNav />}

          {/* Main Content */}
          <div style={{ width: "100%", overflowX: "none", padding: "5px" }}>
            <ToastContainer />

            <Nav />

            <Outlet />
            <Suspense>
              <EmptyDialog
                show={location.pathname != "/login" && openLoginDialog}
                setShow={setOpenLoginDialog}
              >
                <Login />
              </EmptyDialog>
            </Suspense>
          </div>
        </div>
      {/* </div> */}
    </>
  );
}
export default App;
