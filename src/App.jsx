import "./app.css";
import "./index.css";
import "./pages/inventory/inventory.css";
import "./pages/Laboratory/tests.css";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import NewNavbar from "./NewNavbar";
import { useStateContext } from "./appContext";
import nurse from "./assets/images/nurse.jpg";
import heart from "./assets/images/heart.jpg";
function App() {
  const { i18n } = useTranslation();

  let  image = ''
  const { user } = useStateContext();
  if (user?.is_nurse) {
     image = `url("${nurse}")`;
    
  }
  if (user?.doctor) {
    image = `url("${heart}")`;
   
 }

  return (
    <>
      <div style={{background:'var(--clr-2)', height:'99vh' ,backgroundImage:`${image} `} } className="app-container">
        <div className="app-container2">
          
        <Nav />
        <Outlet key={i18n.language} />
        </div>
      </div>
    </>
  );
}
export default App;
