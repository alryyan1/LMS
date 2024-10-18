import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
axiosClient;
import { Alert, Snackbar } from "@mui/material";
import axiosClient from "../../../axios-client";

function ReceptionLayout() {
  const [dialog, setDialog] = useState({
    showMoneyDialog: false,
    title: "",
    color: "success",
    open: false,
    openError: false,
    openLabReport: false,
    showDoctorsDialog: false,
    showHistory:false,
    message: "Addition was successfull",
  });
  const [foundedPatients, setFoundedPatients] = useState([]);
  const [searchByName, setSearchByName] = useState(null);
  const [searchByPhone, setSearchByPhone] = useState(null);
  const [update, setUpdate] = useState(0);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [specialists, setSpecialists] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [actviePatient, setActivePatient] = useState(null);
  const [openedDoctors, setOpenedDoctors] = useState([]);
  const [activeShift, setActiveShift] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showPatientServices, setShowPatientServices] = useState(false);
  const [showServicePanel, setShowServicePanel] = useState(true);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [settings, setSettings] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [showLabTests,setShowLabTests] = useState(false);
  const [companies, setCompanies] = useState([]);
  useEffect(()=>{
    axiosClient.get("settings").then(({ data }) => {
      console.log(data,'data see')
      setSettings(data);
    });
  },[])
  useEffect(() => {
    axiosClient.get("company/all").then(({ data }) => {
      console.log(data, "comapnies");
      setCompanies(data);
    });
  }, []);
  useEffect(() => {
    Promise.all([
      axiosClient
        .get(`specialists/all`)
        .then(({ data: data }) => {
          console.log(data, "specialists ");
          setSpecialists(data);
        })
        .catch((err) => console.log(err)),
      axiosClient.get("doctors").then(({ data: data }) => {
        setDoctors(data);
      })
      ,
      axiosClient.get("packages/all").then((data) => {
        console.log(data,'packages');
        setPackageData(data.data);
      }),
      axiosClient
      .get(`serviceGroup/all`)
      .then(({ data: data }) => {
        console.log(data, "serviceGroup ");
        setServiceCategories(data);
      })
      .catch((err) => console.log(err)),
    ]).finally(() => {});
  }, []);

  

  return (
    <div>
      {
        <Outlet
          context={{
            companies,
            setCompanies,
            showPatientServices,
            setShowPatientServices,
            showServicePanel,
            setShowServicePanel,
            selectedServices,
            setSelectedServices,
            serviceCategories,
            setServiceCategories,
            update,
            setUpdate,
            activeShift,
            setActiveShift,

            openedDoctors,
            setOpenedDoctors,
           
            doctors,
            actviePatient,
            setActivePatient,
            setDialog,
            setOpen,
            setError,
            open,
            dialog,
            openEdit, setOpenEdit,
            specialists,
            setDoctors,
            searchByName,
            setSearchByName,
            searchByPhone,
            setSearchByPhone,
            foundedPatients,
            setFoundedPatients,
            settings,
            showTestPanel, setShowTestPanel,
            selectedTests, setSelectedTests,
            packageData, setPackageData,
            showLabTests,setShowLabTests
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

export default ReceptionLayout;
