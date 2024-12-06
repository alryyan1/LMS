import "./app.css";
import "./index.css";
import "./pages/inventory/inventory.css";
import "./pages/Laboratory/tests.css";
import Nav from "./Nav";
import { Navigate, Outlet, redirect } from "react-router-dom";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import NewNavbar from "./NewNavbar";
import { useStateContext } from "./appContext";
import nurse from "./assets/images/nurse.jpg";
import heart from "./assets/images/heart.jpg";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
function App() {
  const { i18n } = useTranslation();

  const { user,setUser,setToken } = useStateContext();

  let  image = ''
  if (user?.is_nurse) {
     image = `url("${nurse}")`;
    
  }
  if (user?.doctor) {
    image = `url("${heart}")`;
   
 }

  return (
    <>
      <div style={{background:'var(--clr-2)',userSelect:'none' ,backgroundImage:`${image} `,backgroundRepeat: 'repeat'} } className="app-container">
        <div className="app-container2">
        <ToastContainer />

        <Nav />
        {/* <Outlet key={i18n.language} /> */}
        <Outlet  />
        </div>
      </div>
    </>
  );
}
export default App;
