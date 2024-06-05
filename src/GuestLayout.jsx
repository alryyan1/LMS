import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "./appContext";

function GuestLayout() {
  const { token } = useStateContext();
  console.log(token);

  if (token) {
    return <Navigate to={"/ship"} />;
  }
  return (
    <div>
      GuestLayout
      {<Outlet />}
    </div>
  );
}

export default GuestLayout;
