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
  const [suppliers, setSuppliers] = useState([]);
  const [itemsTobeAddedToChache, setItemsTobeAddedToChache] = useState([]);

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
  const [showSummery, setShowSummery] = useState(false);
  
  const [opendDrugDialog,setOpendDrugDialog] = useState(false);
  const [openClientDialog,setOpenClientDialog] = useState(false);
  const [shift, setShift] = useState(null);
  const [drugCategory, setDrugCategory] = useState([]);
  const [pharmacyTypes, setPharmacyTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [deduct, setDeduct] = useState(null);
  const [clients, setClients] = useState([]);
  useEffect(() => {
    //fetch all clients
    axiosClient(`client/all`)
      .then(({data}) => {
        setClients(data);
        console.log(data);
      });
  }, []);
  useEffect(() => {
    //fetch all suppliers
    axiosClient.get(`suppliers/all`).then(({ data }) => {
      //set suppliers
      setSuppliers(data);
      // console.log(data);
    });
  }, []);
  useEffect(()=>{
    setShiftIsLoading(true);
    axiosClient.get(`shift/last`).then(({ data: data }) => {
        setShift(data.data);
  
    }).finally(()=>setShiftIsLoading(false));
    
  
      axiosClient.get(`items/all`,{
        onDownloadProgress: progressEvent => {
          console.log(progressEvent)
          console.log(progressEvent.event.currentTarget.response.length,'length')
          console.log(progressEvent.loaded,'loaded')
          console.log(progressEvent.bytes,'bytes')
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('percentage',percentage)

        }
      }).then(({ data: data }) => {
        setItems(data);
        console.log('items fetched',items)
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
            showDialogMoney, setShowDialogMoney,
            opendDrugDialog,setOpendDrugDialog,
            suppliers, setSuppliers,
            openClientDialog,setOpenClientDialog,
            showSummery, setShowSummery,
            itemsTobeAddedToChache, setItemsTobeAddedToChache,
            
            clients, setClients
          }}
        />
  
      }
      <Snackbar
        open={dialog.open}
        autoHideDuration={5000}
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
