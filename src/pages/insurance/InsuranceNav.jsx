import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { Alert, Snackbar } from "@mui/material";
function InsuranceNav() {
  const [companies, setCompanies] = useState([]);
    const [dialog, setDialog] = useState({
        showMoneyDialog:false,
        title:'',
        color:'success',
        open: false,
        openError: false,
        openLabReport: false,
        msg: "تمت الاضافه بنجاح",
      });

      useEffect(()=>{
        axiosClient.get('company/all').then(({data})=>setCompanies(data))
      },[])
  return (
    <>
      <ul className="inventroy-nav">
        <NavLink to={"create"}>تعاقد جديد</NavLink>
        <NavLink to={"lab"}>التحاليل الطبيه</NavLink>
        <NavLink to={"service"}>الخدمات الطبيه</NavLink>
        <NavLink to={"subcomapny"}> الجهات والعلاقات</NavLink>
        <NavLink to={"section/create"}>نسخ تعاقد</NavLink>
        <NavLink to={"income/create"}>المراجعه والتدقيق</NavLink>
        <NavLink to={"income/deduct"}>المطالبات</NavLink>
        <NavLink to={"inventory/balance"}>التقارير</NavLink>
      </ul>

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

export default InsuranceNav;
