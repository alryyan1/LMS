import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "./appContext";

function GuestLayout() {
  const { token } = useStateContext();
  console.log(token);

  if (token) {
    return <Navigate to={"/pharmacy/add"} />;
  }
  return (
    <div>
      {<Outlet />}
    </div>
  );
}

export default GuestLayout;
