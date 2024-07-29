import { Tab, Tabs } from "@mui/material";
import React from "react";
import OrganismChildPanel from "./OrganismChildPanel";
import { useOutletContext } from "react-router-dom";

function OrganismPanel({ selectedTest,setShift }) {
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
            <OrganismChildPanel  setShift={setShift} value={value} index={index} organism={o} key={o.id }/>
        )
      })}
    </>
  );
}

export default OrganismPanel;
