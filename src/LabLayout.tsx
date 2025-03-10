import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Alert, Snackbar } from "@mui/material";
import { Company, Doctor, DoctorVisit } from "./types/Patient";
import { Container, LabPackage, MainTest } from "./types/Lab";
import { Specialist } from "./types/Shift";
import { Settings } from "./types/type";
export interface LabLayoutPros {
  dialog: {
    showMoneyDialog: boolean;
    title: string;
    color: string;
    open: boolean;
    openError: boolean;
    openLabReport: boolean;
    showHistory: boolean;
    message: string;
  };
  openEdit: boolean;
  foundedPatients: DoctorVisit[];
  childGroups: any[];
  searchByName: string | null;
  searchByPhone: string | null;
  containerData: Container[];
  packageData: LabPackage[];
  loading: boolean;
  error: boolean;
  open: boolean;
  specialists: Specialist[];
  tests: MainTest[];
  doctors: Doctor[];
  actviePatient: DoctorVisit | null;
  showUnitList: boolean;
  searchedTest: string;
  showSearchBox: boolean;
  units: any[];
  showAddTest: boolean;
  activeTestObj: any | null;
  setPatientsLoading : ()=>void;
  selectedTests : MainTest[];
  setSelectedTests: (tests:MainTest[])=>void;
  settings:any,
  userSettings:any,
  companies:Company[]
}
function LabLayout() {
  const [dialog, setDialog] = useState({
    showMoneyDialog: false,
    title: "",
    color: "success",
    open: false,
    openError: false,
    openLabReport: false,
    showHistory: false,
    message: "operation was successfull",
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
  const [settings, setSettings] = useState<Settings|null>(null);

  const [update, setUpdate] = useState(0);

  const [patientsLoading, setPatientsLoading] = useState(false);

  useEffect(() => {

   

    // setPatientsLoading(true)
    Promise.all([
      axiosClient.get("userSettings").then(({ data }) => {
        console.log(data, "user settings from axios");
        setUserSettings(data);
      }),
      axiosClient
      .get(`company/all`)
      .then(({ data }) => {
        setCompanies(data);
      })
      .catch((err) => {
        console.log(err);
      }),
      axiosClient.get("settings").then(({ data }) => {
        console.log(data, "data see");
        setSettings(data);
      }),

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
        console.log(data, "packages");
        setPackageData(data.data);
      }),
      axiosClient.get("childGroup").then((data) => {
        setChildGroups(data.data);
      }),
      axiosClient.get("units/all").then((data) => {
        console.log(data, "unists array");
        setUnits(data.data);
      }),

      axiosClient.get("tests").then((data) => {
        console.log(data, "test data");
        setTests(data.data);
        setLoading(false);
      }),
    ]).finally(() => {
      // setPatientsLoading(false);
    });
  }, []);

  function addChildTestHandler(id) {
    setLoading(true);
    axiosClient
      .post(`childTest/create/${id}`)
      .then(({ data }) => {
        console.log(data);
        setActiveTestObj(data.data)
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <div>
      {
        <Outlet
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
            update,
            setUpdate,
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
            updateTests,
            setUpdateTests,
            openEdit,
            setOpenEdit,
            userSettings,
            setUserSettings,
            patientsLoading,
            setPatientsLoading,
            settings,
            setSettings,
          }}
        />
      }

      <Snackbar
        open={dialog.open}
        autoHideDuration={2000}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={dialog.color}
          variant="filled"
          sx={{ width: "100%", direction: "rtl" }}
        >
          {dialog.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default LabLayout;
