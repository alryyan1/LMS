import React from "react";
import { Tabs, Tab, Box, Card } from "@mui/material";
import TestGroupChildren from "./src/pages/TestGroupChildren";
import { url } from "./src/pages/constants";
import { useOutletContext } from "react-router-dom";
function TestGroups() {
const {packageData,actviePatient,setError,setOpen, selectedTests, setSelectedTests} =  useOutletContext()
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

              return <Card
                onClick={()=>handleTestAdd(p,t)}
                sx={{ p: 1, minWidth: "80px" ,cursor:'pointer' }}
                style={  founded ? {
                  borderBottom:"4px solid blue",
                  fontWeight:"bolder",
                }:null}
                key={t.id}
              >
                {t.main_test_name}
              </Card>}
            )}
          </TestGroupChildren>
        );
      })}
    </Box>
  );
}

export default TestGroups;
