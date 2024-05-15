import React from "react";
import { Tabs, Tab, Box, Card, Paper, Autocomplete } from "@mui/material";
import TestGroupChildren from "../TestGroupChildren"
import { useOutletContext } from "react-router-dom";
import AddTestAutoComplete from "../Laboratory/AddTestAutoComplete";
import AddServiceAutocomplete from "./ServiceAutoComplete";
function ServiceGroup() {
const {serviceCategories,selectedServices,setSelectedServices} =  useOutletContext()

  const serviceAddHandler = (service) => {
    setSelectedServices((prev)=>{
        return [...prev,service]
    })
    console.log(service)
  }
  const [value, setValue] = React.useState(0);
 


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log("start fetching", "packages and their tests");

  return (
    <Paper sx={{p:2}}>
        <AddServiceAutocomplete/>
      <Tabs
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={handleChange}
        variant="scrollable"
      >
        {serviceCategories.map((group) => {
          return <Tab key={group.id} label={group.name} />;
        })}
      </Tabs>
      {serviceCategories.map((group, index) => {
        return (
          <TestGroupChildren key={group.id} index={index} value={value}>
            {group.services.map((service) => {
               const founedService =  selectedServices.find((s)=>s.id === service.id)
               
                return (
                    //test to add
                    <Card
                      onClick={()=>serviceAddHandler(service)}
                      sx={{ p: 1, minWidth: "80px",backgroundColor: ()=>{
                        return founedService ? 'green' : 'white'
                      }}}
                 
                      key={service.id}
                    >
                      {service.name}
                    </Card>
                  )
            })}
          </TestGroupChildren>
        );
      })}
    </Paper>
  );
}

export default ServiceGroup;
