import {  Outlet } from "react-router-dom";
import useApp from "./hooks/useApp";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

function LabLayout() {
  const [openSuccessDialog, setOpenSuccessDialog] = useState({
    open: false,
    msg: "تمت الاضافه بنجاح",
  });
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
            setOpenSuccessDialog,
            setOpen,
            setError,
            open,
            setPackages,
            specialists,
            setDoctors
          }}
        />
      }
    </div>
  );
}

export default LabLayout;
