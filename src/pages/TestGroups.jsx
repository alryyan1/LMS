import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Card } from "@mui/material";
import TestGroupChildren from "./TestGroupChildren";

function TestGroups({packages,setPackages,setRequestedTests,actviePatient,error,setError,setOpen}) {
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
        {packages.map((p) => {
          return <Tab key={p.package_id} label={p.package_name} />;
        })}
      </Tabs>
      {packages.map((p, index) => {
        return (
          <TestGroupChildren key={p.package_id} index={index} value={value}>
            {p.tests.map((t) => (
              <Card 
                onClick={() => {
                  setPackages((prevPack) => {
                   return prevPack.map((pack) => {
                      if (pack.package_id === p.package_id) {
                        pack.tests.map((test) => {
                          if (test.id === t.id) {
                            let urlParams = new URLSearchParams({
                              "main_test_id": test.id,
                               "pid" : actviePatient.id
                                 
                            })
                            console.log('add test')
                            fetch(`http://127.0.0.1:8000/api/labRequest/add/${actviePatient.id}`,{method:'POST',body:urlParams,headers:{ "Content-Type": "application/x-www-form-urlencoded"}}).then((res)=>{
                              return res.json()
                            }).then((result)=>{
                              if (result.code) {
                                console.log(result.message)
                                setError(result.message)
                                setOpen(true)
                                throw new Error(result.error)
                               
                              }
                              setRequestedTests((preTests)=>{
                                return [...preTests,test.id]  
                              })

                            }).catch((err)=>{
                            
                              
                              console.log(err)
                            })
                         
                            console.log('found',`test id is ${test.id} and matching id is${t.id}`)
                            test.selected = !test.selected;
                          }
                          return test;
                        });
                      }
                      return pack;
                    });
                  });
                }}
                sx={{ p: 1, minWidth: "80px" }}
                className={t.selected ? 'active test' :'test'}
                key={t.id}
              >
                {t.main_test_name}
              </Card>
            ))}
          </TestGroupChildren>
        );
      })}

      
    </Box>
  );
}

export default TestGroups;
