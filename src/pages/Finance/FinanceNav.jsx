import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Item, cacheRtl, theme } from "../constants";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useStateContext } from "../../appContext";
import Login from "../Login";
import axiosClient from "../../../axios-client";
import {t} from "i18next"
function FinanceNav() {
  const [items,setItems] = useState()
 const [dialog, setDialog] = useState({
  showDialog:false,
  title:'',
  color:'success',
  open: false,
  openError: false,
  openLabReport: false,
  message: "تمت الاضافه بنجاح",
});
useEffect(()=>{
  axiosClient.get('items/all').then(({data})=>{
    setItems(data)
  }).catch((error)=>{
   
  })
},[])
  const handleClose = () => {
    
    setDialog((prev) => ({ ...prev, open: false }));
  };
  return (
    <>
      <ul className="inventroy-nav">
        <NavLink to={"account"}><Item> {t('newAccount')}</Item></NavLink>

        <NavLink to={"entries"}> <Item> {t('journalEntry')}</Item> </NavLink>
        <NavLink to={"ledger"}><Item>   {t('ledger')}</Item></NavLink>
        <NavLink to={"trialBalance"}><Item>  {t('trialBalance')}</Item></NavLink>
        <NavLink to={"section"}> <Item> {t('departments')}</Item></NavLink>
      </ul>

      {/* <ThemeProvider theme={theme}> */}
        {/* <CacheProvider value={cacheRtl}> { */}
          <Outlet context={{dialog, setDialog,items,setItems}}></Outlet>
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
              {dialog.message}
            </Alert>
          </Snackbar>
    </>
  );
}

export default FinanceNav;
