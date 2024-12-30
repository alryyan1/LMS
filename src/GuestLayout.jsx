import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "./appContext";
import { useEffect } from "react";
import axiosClient from "../axios-client";

function GuestLayout() {
  const { user,token,setUser,setToken } = useStateContext();
  // useEffect(() => {
  //   axiosClient.get("/user").then(({ data }) => {
  //     setUser(data);
  //     console.log(data,'user checked in theme context');
  //   }).catch((err)=>{
  //     console.log('error')
  //     setUser(null);
  //     setToken(null)
  //   });
  // }, []);
  console.log(token,'token');

  // alert(token);
  if (token) {

    if (user?.doctor_id != null) {
      return <Navigate to={`/doctor/${user.doctor_id}`} />;
    }
    if(user?.is_nurse){
      return <Navigate to='/nurse' />;

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
