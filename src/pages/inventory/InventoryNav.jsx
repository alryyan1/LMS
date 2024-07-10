import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Item, cacheRtl, theme } from "../constants";
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
  message: "تمت الاضافه بنجاح",
});
  const handleClose = () => {
    
    setDialog((prev) => ({ ...prev, open: false }));
  };
  return (
    <>
      <ul className="inventroy-nav">
        <NavLink to={"client/create"}><Item>عميل جديد </Item></NavLink>

        <NavLink to={"supplier/create"}> <Item>مورد جديد</Item> </NavLink>
        <NavLink to={"item/create"}><Item> صنف جديد</Item></NavLink>
        <NavLink to={"item/state"}> <Item>حركه الاصناف</Item></NavLink>
        <NavLink to={"section/create"}> <Item>قسم جديد</Item></NavLink>
        <NavLink to={"income/request"}><Item>اذن  طلب</Item></NavLink>
        <NavLink to={"income/create"}><Item>اذن وارد</Item></NavLink>
        <NavLink to={"income/deduct"}><Item>اذن منصرف</Item></NavLink>
        <NavLink to={"inventory/balance"}><Item>المخزون</Item></NavLink>
        <NavLink to={"item/statistics"}><Item>الرسم البياني</Item></NavLink>
      </ul>

      {/* <ThemeProvider theme={theme}> */}
        {/* <CacheProvider value={cacheRtl}> { */}
          <Outlet context={{dialog, setDialog}}></Outlet>
          {/* </CacheProvider> */}
      {/* </ThemeProvider> */}
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
