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

 const [dialog, setDialog] = useState({
  showMoneyDialog:false,
  title:'',
  color:'success',
  open: false,
  openError: false,
  openLabReport: false,
  msg: "تمت الاضافه بنجاح",
});
  const handleClose = () => {
    
    setDialog((prev) => ({ ...prev, open: false }));
  };
  return (
    <>
      <ul className="inventroy-nav">
        <NavLink to={"client/create"}>عميل جديد</NavLink>

        <NavLink to={"supplier/create"}> مورد جديد</NavLink>
        <NavLink to={"item/create"}> صنف جديد</NavLink>
        <NavLink to={"item/state"}> حركه الاصناف</NavLink>
        <NavLink to={"section/create"}> قسم جديد</NavLink>
        <NavLink to={"income/create"}>اذن وارد</NavLink>
        <NavLink to={"income/deduct"}>اذن منصرف</NavLink>
        <NavLink to={"inventory/balance"}>المخزون</NavLink>
        <NavLink to={"item/statistics"}>الرسم البياني</NavLink>
      </ul>

      <ThemeProvider theme={theme}>
        <CacheProvider value={cacheRtl}> {<Outlet context={{dialog, setDialog}}></Outlet>}</CacheProvider>
      </ThemeProvider>
      <Snackbar
            open={dialog.open}
            autoHideDuration={2000}
            onClose={handleClose}
          >
            <Alert

              onClose={handleClose}
              severity={dialog.color}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {dialog.msg}
            </Alert>
          </Snackbar>
    </>
  );
}

export default InventoryNav;
