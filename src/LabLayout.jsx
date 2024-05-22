import { NavLink, Outlet } from "react-router-dom";
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
  const [foundedPatients, setFoundedPatients] = useState([]);
  const [searchByName, setSearchByName] = useState(null);
  const [searchByPhone, setSearchByPhone] = useState(null);
  const [containerData, setContainersData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [specialists, setSpecialists] = useState([]);
  const [packages, setPackages] = useState([]);
  const [tests, setTests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [actviePatient, setActivePatient] = useState(null);
  const [showUnitList, setShowUnitList] = useState(false);
  const [searchedTest, setSearchedTest] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [units, setUnits] = useState([]);
  const [showAddTest, setShowAddTest] = useState(false);
  const [activeTestObj, setActiveTestObj] = useState();
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
      }),
      axiosClient.get("containers/all").then((data) => {
        console.log(data, "containers data");
        setContainersData(data.data);
      }),

      axiosClient.get("packages/all").then((data) => {
        console.log(data);
        setPackageData(data.data);
      }),
      axiosClient.get("tests").then((data) => {
        console.log(data,'test data');
        setTests(data.data);
      }),
    ]).finally(() => {});
  }, []);
  useEffect(() => {
    console.log("start fetching units");
    axiosClient.get("units/all")
      .then((data) => {
        console.log(data, "unists array");
        setUnits(data.data);
      });
  }, []);



  const searchHandler = (e) => {
    if (e.target.value != "") {
      setShowSearchBox(true);
      setShowAddTest(false);
    } else {
      setShowSearchBox(false);
    }
    setSearchedTest(e.target.value);
  };
  
  function addChildTestHandler() {
    fetch(
      `http://127.0.0.1/projects/bootstraped/new/api.php?addChild=1&main=${activeTestObj.id}`
    )
      .then((res) => res.json())
      .then((results) => {
        // console.log(data)
        // console.log(results.data)

        setActiveTestObj((prev) => {
          return { ...prev, children: [...prev.children, results.data] };
        });
      })
      .catch(() => {})
      .finally(() => {});
  }
  return (
    <div>
      
      {
        <Outlet
          context={{
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

export default LabLayout;
