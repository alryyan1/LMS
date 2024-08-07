import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "./appContext";

function GuestLayout() {
  const { user,token } = useStateContext();
  console.log(token);
  // alert(token);
  if (token) {

    if (user?.doctor_id != null) {
      return <Navigate to={`/doctor/${user.doctor_id}`} />;
    }
    // alert(token);
    // user.routes[0].route.name
    // alert(user?.sub_routes[0].route.name)
    if (user?.sub_routes?.length > 0) {
      return <Navigate to={user?.sub_routes[0].sub_route.path} />;
    }else{
      return <Navigate to='/' />;

    }
  }
  return (
    <div>
      {<Outlet />}
    </div>
  );
}

export default GuestLayout;
