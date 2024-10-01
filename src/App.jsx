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

import { useEffect } from "react";
function App() {
  const { i18n } = useTranslation();
  const nav =  useNavigate()

  const { user,setUser,setToken } = useStateContext();
  useEffect(()=>{
   const timer =  setInterval(() => {
      console.log('checking user is valid',user)
      if (localStorage.getItem('ACCESS_TOKEN') == null) {
        console.log('user is invalid')
        nav('/login')
      }
  
    }, 10000);
    return ()=>{
      clearInterval(timer);
    }
  },[])
  let  image = ''
  if (user?.is_nurse) {
     image = `url("${nurse}")`;
    
  }
  if (user?.doctor) {
    image = `url("${heart}")`;
   
 }

  return (
    <>
      <div style={{background:'var(--clr-2)' ,backgroundImage:`${image} `,backgroundRepeat: 'repeat',minHeight:'99vh'} } className="app-container">
        <div className="app-container2">
          
        <Nav />
        {/* <Outlet key={i18n.language} /> */}
        <Outlet  />
        </div>
      </div>
    </>
  );
}
export default App;
