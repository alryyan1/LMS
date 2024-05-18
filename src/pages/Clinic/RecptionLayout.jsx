import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
axiosClient;
import { Alert, Snackbar } from "@mui/material";
import useApp from "../../hooks/useApp";
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
    msg: "تمت الاضافه بنجاح",
  });
  const [foundedPatients, setFoundedPatients] = useState([]);
  const [searchByName, setSearchByName] = useState(null);
  const [searchByPhone, setSearchByPhone] = useState(null);
  const [update, setUpdate] = useState(0);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [specialists, setSpecialists] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [actviePatient, setActivePatient] = useState(null);
  const [openedDoctors, setOpenedDoctors] = useState([]);
  const [activeShift, setActiveShift] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showPatientServices, setShowPatientServices] = useState(false);
  const [showServicePanel, setShowServicePanel] = useState(true);
  
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

            specialists,
            setDoctors,
            searchByName,
            setSearchByName,
            searchByPhone,
            setSearchByPhone,
            foundedPatients,
            setFoundedPatients,
          }}
        />
      }
      <Snackbar
        open={dialog.open}
        autoHideDuration={2000}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={dialog.color} variant="filled" sx={{ width: "100%" }}>
          {dialog.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ReceptionLayout;
