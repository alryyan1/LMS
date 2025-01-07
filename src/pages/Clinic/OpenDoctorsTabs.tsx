import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Badge } from "@mui/material";
import { DoctorShift, User } from "../../types/Patient";

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
    user : User
  

}
export default function OpenDoctorTabs({ user, openedDoctors,selectDoctorHandler ,activeShift}:openDoctorTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    alert('s')
    setValue(newValue);
    console.log(newValue,'new val')
  };

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
              if(user.isAccountant || user.isAdmin){
                return true;
              }else{
                shift.user_id == user?.id
              }
            })
            .map((shift,index) => {
              // console.log(shift, "shift");
              return (
                <Badge
                style={{

                    minHeight:'15px!important',minWidth:"15px!important",height:'15px!important',width:'15px!important'
                  }}
                   
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "bottom",
                    }}
                  color="secondary"
                  badgeContent={shift.visits.length}
                  key={shift.id}
                >
                  <Tab
                    value={index}
                    title={shift.doctor.specialist.name}
                    

                
                //   value={shift.doctor_id}
                  onClick={()=>{
                    setValue(index)
                     console.log(shift.id)
                     console.log(shift,'selected shift')
                    selectDoctorHandler(shift)
                  }}
                    className={
                      activeShift && activeShift.id === shift.id
                        ? "activeDoctor doctor"
                        : "doctor"
                    }
                    label={shift.doctor.name}
                    {...a11yProps(0)}
                  />

                </Badge>
              );
            })}
        </Tabs>
      </Box>
    </Box>
  );
}
