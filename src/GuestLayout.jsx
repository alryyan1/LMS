import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "./appContext";

function GuestLayout() {
  const { token } = useStateContext();
  console.log(token);

  if (token) {
    return <Navigate to={"/laboratory/add"} />;
  }
  return (
    <div>
      GuestLayout
      {<Outlet />}
    </div>
  );
}

export default GuestLayout;
