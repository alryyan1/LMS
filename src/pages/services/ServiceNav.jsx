import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import axiosClient from "../../../axios-client";
function ServiceNav() {
  const [updateServiceGroup, setUpdateServiceGroup] = useState(0);
  const [serviceGroups, setServiceGroups] = useState([]);
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
        axiosClient.get('serviceGroup/all').then(({data})=>{
          console.log(data,'service groups')
          setServiceGroups(data)
        })
      },[updateServiceGroup])
  return (
    <>
      <ul className="inventroy-nav">
        <NavLink to={"create"}>تعريف خدمه</NavLink>
        <NavLink to={"serviceGroup/create"}>تعريف قسم</NavLink>
      </ul>

      <Outlet context={{dialog,setDialog,serviceGroups,setUpdateServiceGroup}} />
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

export default ServiceNav;
