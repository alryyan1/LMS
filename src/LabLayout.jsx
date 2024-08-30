import {  Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Alert, Snackbar } from "@mui/material";

function LabLayout() {
  const [dialog, setDialog] = useState({
    showMoneyDialog:false,
    title:'',
    color:'success',
    open: false,
    openError: false,
    openLabReport: false,
    msg: "تمت الاضافه بنجاح",
  });
  const [openEdit, setOpenEdit] = useState(false);

  const [foundedPatients, setFoundedPatients] = useState([]);
  const [childGroups, setChildGroups] = useState([]);
  const [searchByName, setSearchByName] = useState(null);
  const [searchByPhone, setSearchByPhone] = useState(null);
  const [containerData, setContainersData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [specialists, setSpecialists] = useState([]);
  const [tests, setTests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [actviePatient, setActivePatient] = useState(null);
  const [showUnitList, setShowUnitList] = useState(false);
  const [searchedTest, setSearchedTest] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [units, setUnits] = useState([]);
  const [showAddTest, setShowAddTest] = useState(false);
  const [activeTestObj, setActiveTestObj] = useState();
  const [updateTests, setUpdateTests] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [userSettings, setUserSettings] = useState(null);

  const [update, setUpdate] = useState(0);

  const [patientsLoading, setPatientsLoading] = useState(false);

  useEffect(() => {

    setPatientsLoading(true)
    Promise.all([
        axiosClient.get("userSettings").then(({ data }) => {
          console.log(data, "user settings from axios");
          // setUserSettings(data);
        }),
      
      axiosClient.get("company/all").then(({ data }) => {
        console.log(data, "comapnies");
        // setCompanies(data);
      }),
      axiosClient
        .get(`specialists/all`)
        .then(({ data: data }) => {
          console.log(data, "specialists ");
          // setSpecialists(data);
        })
        .catch((err) => console.log(err)),
      axiosClient.get("doctors").then(({ data: data }) => {
        // setDoctors(data);
      }),
      axiosClient.get("containers/all").then((data) => {
        console.log(data, "containers data");
        // setContainersData(data.data);
      }),

      axiosClient.get("packages/all").then((data) => {
        console.log(data,'packages');
        // setPackageData(data.data);
      }),
      axiosClient.get("childGroup").then((data) => {
        // setChildGroups(data.data);
      }),
      axiosClient.get("units/all")
      .then((data) => {
        console.log(data, "unists array");
        // setUnits(data.data);
      }),
     
      axiosClient.get("tests").then((data) => {
        console.log(data,'test data');
        // setTests(data.data);
        setLoading(false)
    
      })
    ]).finally(() => {
      setPatientsLoading(false);
    });
  }, []);
  // useEffect(() => {
  //   console.log("start fetching units");
   
  // }, []);


// useEffect(()=>{
//   setLoading(true)
  
// },[updateTests])
 
  
  function addChildTestHandler(id) {
    setLoading(true)
    axiosClient.post(
      `childTest/create/${id}`
    )
      .then(({data}) => {
        console.log(data)
        setActiveTestObj((prev) => {
          return { ...prev, child_tests: [...prev.child_tests, data] };
        });
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      });
  }
  return (
    
    <div>
      
         {<Outlet
          context={{
            childGroups,
            setChildGroups,
            addChildTestHandler,
            tests,
            setTests,
            showAddTest,
            showUnitList,
            loading,
            setShowUnitList,
            units,
            setActiveTestObj,
            activeTestObj,
            containerData,
            packageData,
            setShowAddTest,
            setUnits,
            selectedTests,
            setSelectedTests,
            doctors,
            actviePatient,
            setActivePatient,
            setDialog,
            setOpen,
            setError,
            update,setUpdate,
            open,
            dialog,
            companies,
            setCompanies,
            specialists,
            setDoctors,
            searchByName,
            setSearchByName,
            searchByPhone,
            setSearchByPhone,
            foundedPatients,
            setFoundedPatients,
            updateTests,setUpdateTests,
            openEdit, setOpenEdit,
            userSettings, setUserSettings,patientsLoading,setPatientsLoading
          }}
        />}

    
      <Snackbar
        open={dialog.open}
        autoHideDuration={2000}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
      >
        <Alert  severity={dialog.color} variant="filled" sx={{ width: "100%" ,direction:'rtl'}}>
          {dialog.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default LabLayout;
