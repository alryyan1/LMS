import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "./appContext";

function GuestLayout() {
  const { user,token } = useStateContext();
  console.log(token);
  // alert(token);
  if (token) {
    // alert(token);
    // user.routes[0].route.name
    return <Navigate to={"/pos/sell"} />;
  }
  return (
    <div>
      {<Outlet />}
    </div>
  );
}

export default GuestLayout;
