import "./app.css";
import "./index.css";
import "./pages/inventory/inventory.css";
import "./pages/Laboratory/tests.css";
import Nav from "./Nav";
import {  Outlet, } from "react-router-dom";
import { useStateContext } from "./appContext";
import nurse from "./assets/images/nurse.jpg";
import heart from "./assets/images/heart.jpg";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import SidebarNav from "./Sidebar";
function App() {
 

  const { user } = useStateContext();

  let  image = ''
  if (user?.is_nurse) {
     image = `url("${nurse}")`;
    
  }
  if (user?.doctor) {
    image = `url("${heart}")`;
   
 }

  return (
    <>
      {/* <div style={{background:'var(--clr-2)',userSelect:'none' ,backgroundImage:`${image} `,backgroundRepeat: 'repeat'} } className="app-container"> */}
        {/* <div className="app-container2"> */}

        {/* <Outlet key={i18n.language} /> */}

        {/* </div> */}
      {/* </div> */}
      <div style={{ display: 'flex', height: '100vh'}}>
      {/* Sidebar */}
     {user&& <SidebarNav/>}

      {/* Main Content */}
      <div style={{  padding: '5px',margin:'15px auto',width:'95%' }}>
     
        <ToastContainer />

        <Nav />

        <Outlet  />

      </div>
    </div>
    </>
  );
}
export default App;
