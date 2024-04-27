import "./app.css";
import "./pages/inventory/inventory.css";
import "./tests.css";
import useApp from "./hooks/useApp";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Nav from "./Nav";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "./appContext";
function App() {
  const {token} = useStateContext()
  // Create rtl cache
  // if (!token) {
  //   console.log("redirect to login");
  //   return <Navigate to={'/login'}/>
  // }

  // console.log(data)
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
