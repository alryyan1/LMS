import "./app.css";
import "./pages/inventory/inventory.css";
import "./pages/Laboratory/tests.css";
import Nav from "./Nav";
import {  Outlet } from "react-router-dom";
function App() {

  
  return (
    <>
      <div className="app-container">
        <Nav />
        <Outlet />
      </div>
    
    </>
  );
}
export default App;
