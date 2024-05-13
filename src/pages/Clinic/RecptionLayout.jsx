import {  Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
axiosClient
import { Alert, Snackbar } from "@mui/material";
import useApp from "../../hooks/useApp";
import axiosClient from "../../../axios-client";

function ReceptionLayout() {
  const [dialog, setDialog] = useState({
    showMoneyDialog:false,
    title:'',
    color:'success',
    open: false,
    openError: false,
    openLabReport: false,
    showDoctorsDialog : false,
    msg: "تمت الاضافه بنجاح",
  });
  const [foundedPatients, setFoundedPatients] = useState([]);
  const [searchByName, setSearchByName] = useState(null);
  const [searchByPhone, setSearchByPhone] = useState(null);
  const [containerData, setContainersData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [testsIsLoading, setTestsIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [specialists, setSpecialists] = useState([]);
  const [packages, setPackages] = useState([]);
  const [tests, setTests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [actviePatient, setActivePatient] = useState(null);
  useEffect(() => {
    Promise.all([
      axiosClient.get(`specialists/all`)
      .then(({data:data}) => {
        console.log(data,'specialists ')
        setSpecialists(data);
      }).catch((err)=>console.log(err)),
      axiosClient.get('doctors').then(({data:data})=>{
        setDoctors(data)
      }),
      fetch("http://127.0.0.1/projects/bootstraped/new/api.php?containers")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setContainersData(data.data);
        }),

      fetch("http://127.0.0.1/projects/bootstraped/new/api.php?packages")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPackageData(data.data);
        }),
    ]).finally(() => {
    });
  }, []);
 
    // useEffect(() => {
    //   axiosClient.get(`packages/all`)
    //     .then((dataPacks) => {
    //       dataPacks.forEach((element) => {
    //         element.tests.forEach((t) => {
    //           tests.forEach((requested) => {
    //             if (t.id == requested.id) {
    //               t.selected = true;
    //             }
    //           });
    //           return t;
    //         });
    //       });
    //       setPackages(dataPacks);
    //     });
    // }, [tests]);
  
  const {
    
    selectTestHandler,
    units,
    setActiveTestObj,
    activeTestObj,
    inputRef,
    setShowAddTest,
    setUnits,
    showUnitList,
    setShowUnitList,
    showAddTest,
  } = useApp();
  return (
    <div>
      {
        <Outlet
          context={{
            tests,
            setTests,
            showAddTest,
            selectTestHandler,
            showUnitList,
            testsIsLoading,
            setShowUnitList,
            units,
            setActiveTestObj,
            activeTestObj,
            searchInput: inputRef.current,
            containerData,
            packageData,
            setShowAddTest,
            setUnits,
            packages,
            doctors,
            actviePatient,
            setActivePatient,
             setDialog,
            setOpen,
            setError,
            open,
            dialog,
       
            setPackages,
            specialists,
            setDoctors,
            searchByName,
            setSearchByName,
            searchByPhone,
            setSearchByPhone,
            foundedPatients,
            setFoundedPatients
          }}
        />
      }
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
    </div>
  );
}

export default ReceptionLayout;
