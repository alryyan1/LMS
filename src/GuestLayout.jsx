import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "./appContext";

function GuestLayout() {
  const { user,token } = useStateContext();
  console.log(token);

  if (token) {
    // user.routes[0].route.name
    return <Navigate to={"/laboratory/add"} />;
  }
  return (
    <div>
      {<Outlet />}
    </div>
  );
}

export default GuestLayout;
