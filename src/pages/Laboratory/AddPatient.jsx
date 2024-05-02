import "./addPatient.css";
import { useEffect, useState } from "react";
import Patient from "./Patient";
import PatientForm from "./PatientForm";
import PatientDetail from "./PatientDetail";
import { url } from "../constants";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Stack,
  styled,
  Paper,
  Skeleton,
} from "@mui/material";
import RequestedTests from "./RequestedTests";
import AddTestAutoComplete from "./AddTestAutoComplete";
import { Calculate, Mail, PersonAdd } from "@mui/icons-material";
import { Link, useOutletContext } from "react-router-dom";
import { useStateContext } from "../../appContext";
import axiosClient from "../../../axios-client";
import AddDoctorDialog from "../Dialogs/AddDoctorDialog";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function AddPatient() {

  const {setTests,actviePatient,setActivePatient,setOpen} =   useOutletContext()
  console.log(actviePatient)
  const { setOpenDrawer, openDrawer } = useStateContext();
  const [patients, setPatients] = useState([]);
  const [update, setUpdate] = useState(0);
  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    hideForm: false,
    testWidth: "400px",
    requestedDiv: "1.5fr",
    showTestPanel: false,
  });
  console.log(openDrawer, "open drawer");


  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {[
          { title: "تسجيل مريض", to: "/laboratory/add" },
          { title: "ادخال النتائج ", to: "" },
          { title: "سحب العينات", to: "" },
          { title: " اداره التحاليل", to: "" },
        ].map((item, index) => (
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
    axiosClient.get(`patients`).then(({ data: data }) => {
      console.log(data, "today patients");
      //add activeProperty to patient object
      data.forEach((patient) => {
        patient.active = false;
      });
      console.log(data);
      setPatients(data);
    });
  }, [update]);

  const setActivePatientHandler = (id) => {
    hideForm();
    setPatients(
      patients.map((patient) => {
        if (patient.id === id) {
          setActivePatient(patient);
          patient.active = true;
        } else {
          patient.active = false;
        }
        return patient;
      })
    );
  };

  const hideForm = () => {
    setLayout((prev) => {
      return {
        ...prev,
        form: "0fr",
        hideForm: true,
        tests: "2fr",
        testWidth: "500px",
        showTestPanel: false,
      };
    });
  };
  const showFormHandler = () => {
    setActivePatient(null);
    setLayout((prev) => {
      return { ...prev, form: "1fr", hideForm: false, tests: "1fr" };
    });
  };
  const fetchTests = () => {
    fetch(`${url}labRequest/${actviePatient.id}`, {
      headers: { "content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setTests(data.labrequests);
      });
  };

  return (
    <>
      <Drawer open={openDrawer}>{DrawerList}</Drawer>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "90vh",
          display: "grid",
          gridTemplateColumns: `0.1fr   ${layOut.form}  1fr    ${layOut.requestedDiv} 0.5fr    `,
        }}
      >
        <div>
          <AddDoctorDialog/>

        
         
        <Stack
        sx={{mr:1}}
            gap={"5px"}
            divider={<Divider orientation="vertical" flexItem />}
            direction={"column"}
            style={{ position: "absolute", left: "0" }}
          >
            <Item>
              <IconButton variant="contained" onClick={showFormHandler}>
                <RemoveRedEyeIcon />
              </IconButton>
            </Item>
            <Item>
              <IconButton variant="contained" onClick={()=>{
                setOpen(true)
              }}>
                <PersonAdd />
              </IconButton>
            </Item>
            <Item>
              <IconButton variant="contained" onClick={showFormHandler}>
                <Calculate />
              </IconButton>
            </Item>
          </Stack>
        </div>
        <div>
   
          

          {layOut.hideForm || actviePatient ? (
            ""
          ) : (
            <PatientForm
              setUpdate={setUpdate}
              hideForm={hideForm}
            />
          )}
        </div>
        <div style={{ overflow: "auto" }}>
          <AddTestAutoComplete
          setPatients = {setPatients}
          />
          <div className="patients">
            {patients.map((p) => (
              <Patient
                patient={p}
                onClick={setActivePatientHandler}
                key={p.id}
              />
            ))}
                <Skeleton variant="rectangular" width={210} height={118} />

          </div>
        </div>

        <div>
          {actviePatient && actviePatient.labrequests.length > 0 &&   (
            <RequestedTests setPatients={setPatients}
            />
          )}
        </div>
        <div>
          {/** add card using material   */}
          {actviePatient && (
            <PatientDetail
              setActivePatient={setActivePatient}
              patients={patients}
              setPatients={setPatients}
              key={actviePatient.id}
              patient={actviePatient}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AddPatient;
