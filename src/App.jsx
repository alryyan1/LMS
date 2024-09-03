import "./app.css";
import "./index.css";
import "./pages/inventory/inventory.css";
import "./pages/Laboratory/tests.css";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import NewNavbar from "./NewNavbar";
function App() {
  const { i18n } = useTranslation();

  return (
    <>
      <div className="app-container">
        <Nav />
        <Outlet key={i18n.language} />
      </div>
    </>
  );
}
export default App;
