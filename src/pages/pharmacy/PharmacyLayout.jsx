import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
axiosClient;
import { Alert, Snackbar } from "@mui/material";
import axiosClient from "../../../axios-client";
import { CacheProvider } from "@emotion/react";
import { cacheRtl } from "../constants";

function PharmacyLayout() {
  const [shiftIsLoading,setShiftIsLoading] = useState()
  const [activeSell, setActiveSell] = useState();
  const [dialog, setDialog] = useState({
    showMoneyDialog: false,
    title: "",
    color: "success",
    open: false,
    openError: false,
    openLabReport: false,
    showDoctorsDialog: false,
    msg: "تمت الاضافه بنجاح",
  });
  const [showDialogMoney, setShowDialogMoney] = useState(false);

  const [shift, setShift] = useState(null);
  const [drugCategory, setDrugCategory] = useState([]);
  const [pharmacyTypes, setPharmacyTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [deduct, setDeduct] = useState(null);
  useEffect(()=>{
    setShiftIsLoading(true);
    axiosClient.get(`shift/last`).then(({ data: data }) => {
        setShift(data.data);
  
    }).finally(()=>setShiftIsLoading(false));
    
    axiosClient.get(`items/all`).then(({ data: data }) => {
      setItems(data);
      if (data.status == false) {
        setDialog((prev)=>{
          return {...prev,open: true, msg: data.message}
        })
      }

  });
      axiosClient.get("drugCategory").then(({ data }) => {
        setDrugCategory(data);
      });
 
      axiosClient.get("pharmacyTypes").then(({ data }) => {
        setPharmacyTypes(data);
      });
 

  },[])
  

  return (
    <div>
      {
      <CacheProvider value={cacheRtl}> 
        <Outlet
          context={{
            deduct,
            setDeduct,
            dialog,
            setDialog,
            items,
            setItems,
            pharmacyTypes,
            setPharmacyTypes,
            drugCategory,
            setDrugCategory,
            shift,
            setShift,
            setShiftIsLoading,
            shiftIsLoading,
            activeSell, setActiveSell,
            showDialogMoney, setShowDialogMoney
          
          }}
        />
        </CacheProvider>
      }
      <Snackbar
        open={dialog.open}
        autoHideDuration={2000}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={dialog.color} variant="filled" sx={{ width: "100%" }}>
          {dialog.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PharmacyLayout;
