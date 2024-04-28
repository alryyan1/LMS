import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { cacheRtl, theme } from "../constants";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useStateContext } from "../../appContext";
import Login from "../Login";
import axiosClient from "../../../axios-client";
function InventoryNav() {
 const {setToken,setUser } =useStateContext()
 const [openSuccessDialog, setOpenSuccessDialog] = useState({
  color:'success',
  open: false,
  msg: "تمت الاضافه بنجاح",
});

const { token } = useStateContext();
const location = useLocation()
useEffect(()=>{
// console.log(location,'location')
axiosClient.get('/user').then(({data})=>{
  console.log(data,'setting user data')
  setUser(data)
}).catch(({response})=>{
  if (response.status == 401) {
    setUser(null)
    setToken(null)
  }
})
 const token = localStorage.getItem('ACCESS_TOKEN')
 if (token == null) {
    setToken(null)
 }
},[location])
console.log(token,'token')
console.log("lab layout rendered");
if (!token) {
  console.log("redirect to login");
  return <Navigate to={'/login'}/>
}
  const handleClose = () => {
    
    setOpenSuccessDialog((prev) => ({ ...prev, open: false }));
  };
  return (
    <>
      <ul className="inventroy-nav">
        <NavLink to={"client/create"}>انشاءعميل جديد</NavLink>

        <NavLink to={"supplier/create"}>انشاء مورد جديد</NavLink>
        <NavLink to={"item/create"}>انشاء صنف جديد</NavLink>
        <NavLink to={"section/create"}>انشاء قسم جديد</NavLink>
        <NavLink to={"income/create"}>اذن وارد</NavLink>
        <NavLink to={"income/deduct"}>اذن منصرف</NavLink>
        <NavLink to={"inventory/balance"}>المخزون</NavLink>
      </ul>

      <ThemeProvider theme={theme}>
        <CacheProvider value={cacheRtl}> {<Outlet context={[openSuccessDialog, setOpenSuccessDialog]}></Outlet>}</CacheProvider>
      </ThemeProvider>
      <Snackbar
            open={openSuccessDialog.open}
            autoHideDuration={2000}
            onClose={handleClose}
          >
            <Alert

              onClose={handleClose}
              severity={openSuccessDialog.color}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {openSuccessDialog.msg}{" "}
            </Alert>
          </Snackbar>
    </>
  );
}

export default InventoryNav;
