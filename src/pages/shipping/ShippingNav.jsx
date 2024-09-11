import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { Alert, Snackbar } from "@mui/material";
function ShippingNav() {
  const [companies, setCompanies] = useState([]);
    const [dialog, setDialog] = useState({
        showMoneyDialog:false,
        title:'',
        color:'success',
        open: false,
        openError: false,
        openLabReport: false,
        msg: "Addition was successfull",
      });

      useEffect(()=>{
        axiosClient.get('company/all').then(({data})=>setCompanies(data))
      },[])
  return (
    <>
    
      <Outlet context={{dialog,setDialog,companies}} />
      <Snackbar
    
            open={dialog.open}
            autoHideDuration={2000}
            onClose={()=>setDialog((prev)=>({...prev,open:false}))
          
          }
          >
            <Alert
            
               
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

export default ShippingNav;
