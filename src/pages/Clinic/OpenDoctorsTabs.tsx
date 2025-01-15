import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Badge } from "@mui/material";
import { DoctorShift, DoctorVisit, User } from "../../types/Patient";
import axiosClient from "../../../axios-client";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface openDoctorTabsProps {
    openedDoctors: DoctorShift[];
    selectDoctorHandler: (shift: DoctorShift) => void;
    activeShift: DoctorShift|null;
    user : User;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    setOpenedDoctors: React.Dispatch<React.SetStateAction<DoctorShift[]>>;
    setActiveShift: React.Dispatch<React.SetStateAction<DoctorShift|null>>;
    setPatients: React.Dispatch<React.SetStateAction<DoctorVisit[]>>;


  

}
export default function OpenDoctorTabs({setPatients,setLoadingDoctorPatients, user, openedDoctors,selectDoctorHandler ,activeShift,value, setValue,setOpenedDoctors,setActiveShift}:openDoctorTabsProps) {

  const tabRefs = React.useRef([]); // Create a ref array to hold all tab refs.

  console.log(tabRefs,'tabRefs')
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // alert(newValue)
    setValue(newValue);
    console.log(newValue,'new val')
        // Scroll the active tab into view
    
    

  };
  React.useEffect(()=>{
    // alert(value)
    if (tabRefs.current[value]) {
      tabRefs.current[value].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center", // Ensures horizontal scrolling.
      });
    }
    //update latest patients for doctor
    const controller = new AbortController()
    if(value){
    setLoadingDoctorPatients(true)

      axiosClient.get(`getDoctorShiftById?id=${value}`,{
        signal: controller.signal,
      }).then(({data})=>{
        console.log(data,'getDoctorShiftById')
        setActiveShift(data);
        setPatients(data.visits)
        setOpenedDoctors((prev)=>{
         return  prev.map((doctorShift)=>{
            if(doctorShift.id == value){
              return data;
            }
            return doctorShift;
          })
        })
      }).finally(()=>setLoadingDoctorPatients(false))
    }
    return () => controller.abort() // Clean up the abort controller when component unmounts.
   
  },[value])
  // alert(value)
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {openedDoctors
            .filter((shift) => {
              if(user?.isAccountant || user?.isAdmin){
                return true;
              }else{
               return shift.user_id == user?.id
              }
            })
            .map((shift,index) => {
              // console.log(shift, "shift");
              return (

                  <Tab
                   
                              ref={(el) => (tabRefs.current[shift.id] = el)} // Assign ref to each tab.

                    value={shift.id}
                    title={shift.doctor.specialist.name}

                    

                
                //   value={shift.doctor_id}
                  onClick={()=>{
                    setValue(shift.id)
                     console.log(shift.id)
                     console.log(shift,'selected shift')
                    selectDoctorHandler(shift)
                  }}
                  // sx={
                  //   activeShift && activeShift.id === shift.id
                  //       ? {backgroundColor:'green'}
                  //       : null
                  // }
                    className={
                      activeShift && activeShift.id === shift.id
                        ? "activeDoctor doctor"
                        : "doctor"
                    }
                    label={shift.doctor.name}
                    {...a11yProps(0)}
                  />

             
              );
            })}
        </Tabs>
      </Box>
    </Box>
  );
}
