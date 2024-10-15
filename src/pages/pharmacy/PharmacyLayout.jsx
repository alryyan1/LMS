import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
axiosClient;
import { Alert, Snackbar } from "@mui/material";
import axiosClient from "../../../axios-client";
import { CacheProvider } from "@emotion/react";
import { cacheRtl } from "../constants";

function PharmacyLayout() {
  const [shiftIsLoading,setShiftIsLoading] = useState()
  const [itemsIsLoading,setItemsIsLoading] = useState(false)
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
    msg: "Addition was successfull",
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
  const [depositLoading, setDepositLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [excelLoading,setExeclLoading] = useState(false)
  const [links,setLinks] = useState([])
  const [updateSummery,setUpdateSummery] = useState(0)

  useEffect(() => {
    setDepositLoading(true)
    axiosClient.get("inventory/deposit/all").then(({ data }) => {
      
      setInvoices(data);
     
    }).finally(()=>setDepositLoading(false));
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
    axiosClient.get(`shiftWith?with=deducts`).then(({ data: data }) => {
        setShift(data);
  
    }).finally(()=>setShiftIsLoading(false));
    
    setItemsIsLoading(true)
      axiosClient.get(`items/all`).then(({ data: data }) => {
        setItems(data);
        if (data.status == false) {
  
          setDialog((prev)=>{
            return {...prev,open: true, msg: data.message}
          })
        }
  
    }).finally(()=>setItemsIsLoading(false));
  
    
  
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
            itemsIsLoading,setItemsIsLoading,
            invoices, setInvoices,
            selectedInvoice, setSelectedInvoice,depositLoading,excelLoading,setExeclLoading,links,setLinks,
            updateSummery,setUpdateSummery
            
          
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
