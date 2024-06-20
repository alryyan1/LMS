import { Link, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Alert, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar } from "@mui/material";
import { Mail } from "@mui/icons-material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

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
  const [openDrawer, setOpenDrawer] = useState(false);

  const [update, setUpdate] = useState(0);

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {[
          { title: "تسجيل مريض", to: "/laboratory/add" },
          { title: "ادخال النتائج ", to: "/laboratory/result" },
          { title: "سحب العينات", to: "" },
          { title: " اداره التحاليل", to: "/laboratory/tests" },
          { title: "قائمه الاسعار", to: "/laboratory/price" },
          { title: "CBC LIS", to: "/laboratory/cbc-lis" },
          { title: "Chemistry LIS", to: "/laboratory/chemistry-lis" },
        ].map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              onClick={() => setOpenDrawer(false)}
              LinkComponent={Link}
              to={item.to}
            >
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  useEffect(() => {

    Promise.all([

      axiosClient.get("company/all").then(({ data }) => {
        console.log(data, "comapnies");
        setCompanies(data);
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
        console.log(data,'packages');
        setPackageData(data.data);
      }),
      axiosClient.get("childGroup").then((data) => {
        setChildGroups(data.data);
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


useEffect(()=>{
  setLoading(true)
  axiosClient.get("tests").then((data) => {
    console.log(data,'test data');
    setTests(data.data);
    setLoading(false)

  })
},[updateTests])
  const searchHandler = (e) => {
    if (e.target.value != "") {
      setShowSearchBox(true);
      setShowAddTest(false);
    } else {
      setShowSearchBox(false);
    }
    setSearchedTest(e.target.value);
  };
  
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
      <Drawer open={openDrawer}>{DrawerList}</Drawer>

       <IconButton
            onClick={() => {
              console.log("clicked");
              setOpenDrawer(true);
            }}
            color="success"
          >
            <FormatListBulletedIcon />
          </IconButton>
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
            openDrawer,
            DrawerList
          }}
        />
      }
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
