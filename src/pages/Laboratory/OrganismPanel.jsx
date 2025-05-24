import { Tab, Tabs } from "@mui/material";
import React from "react";
import OrganismChildPanel from "./OrganismChildPanel";

function OrganismPanel({ selectedTest,setActivePatient,biotics, setBiotics,patient }) {
  const [value, setValue] = React.useState(0);
    
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
      
      >
        {selectedTest.requested_organisms.map((o) => {
          return <Tab key={o.id} label={o.organism}></Tab>;
        })}
      </Tabs>

      {selectedTest.requested_organisms.map((o,index) => {
        return (
            <OrganismChildPanel patient={patient} biotics={biotics} patient={patient}  setBiotics={setBiotics}  setActivePatient={()=>{}} value={value} index={index} organism={o} key={o.id }/>
        )
      })}
    </>
  );
}

export default OrganismPanel;
