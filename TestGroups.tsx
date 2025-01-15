import React from "react";
import { Tabs, Tab, Box, Card, Button } from "@mui/material";
import TestGroupChildren from "./src/pages/TestGroupChildren";
import { url } from "./src/pages/constants";
import { useOutletContext } from "react-router-dom";
import { LabLayoutPros } from "./src/LabLayout";
function TestGroups() {
const {packageData,actviePatient,setError,setOpen, selectedTests, setSelectedTests} =  useOutletContext<LabLayoutPros>()
console.log(packageData,'packages in groups')

  const handleTestAdd = (p,t) => {

   
    setSelectedTests((prev)=>{
      const founded = prev.find((old)=>old.id==t.id)
      if (founded) {
      return [...prev.filter((old)=>old.id != t.id)]
        
      }else{
        return [...prev,t]

      }
    })
  }
  const [value, setValue] = React.useState(0);
 


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log("start fetching", "packages and their tests");

  return (
    <Box>
      
      <Tabs
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={handleChange}
        variant="scrollable"
      >
        {packageData.map((p) => {
          return <Tab key={p.package_id} label={p.package_name} />;
        })}
      </Tabs>
      {packageData.map((p, index) => {
        return (
          <TestGroupChildren key={p.package_id} index={index} value={value}>
            {p.tests.map((t) =>{ 
             const founded =  selectedTests.find((ts)=>ts.id == t.id)

              return <Button 
              // variant="text"
              variant="contained"
              color="inherit"
              sx={{
                m: 1,
                textOverflow:'ellipsis',
                width: 200,
                cursor: "pointer",
                textTransform: "capitalize",
                fontSize: "0.8rem",
                height: "2rem",
                borderRadius: 5,
                backgroundColor: "white",
                color: "black",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
                "&:active": {
                  backgroundColor: "#e0e0e0",
                },
                "&:focus": {
                  backgroundColor: "#d0d0d0",
                },
                "&:focus-visible": {
                  backgroundColor: "#c0c0c0",
                },
              }}
              square
                onClick={()=>handleTestAdd(p,t)}
                className={`testGroupItem test card p-1 shadow-sm  ${actviePatient?.patient.labrequests.map((t)=>t.main_test.id).includes(t.id) ? 'active' :''}` }
                
                // sx={{ p: 1, minWidth: "80px" ,cursor:'pointer' }}
                style={  founded ? {
                  borderBottom:"4px solid blue",
                }:null}
                 
                key={t.id}
              >
              <span title= {t.main_test_name}> {t.main_test_name}</span> 
              </Button>}
            )}
          </TestGroupChildren>
        );
      })}
    </Box>
  );
}

export default TestGroups;
