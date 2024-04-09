import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

function RequestedTests({ actviePatient }) {
  console.log("patient tests rendered");
  const [tests, setTests] = useState([]);
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/labRequest/${actviePatient.id}`, {
      headers: { "content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.labrequests);
        setTests(data.labrequests);
      });
  }, [actviePatient]);

  const deleteTest = (id)=>{
    console.log(id)
    fetch(`http://127.0.0.1:8000/api/labRequest/${actviePatient.id}`, {
      method: "DELETE",
      body : new URLSearchParams({id}),
      headers: { "content-type": "application/x-www-form-urlencoded" },
    })
     .then((res) => res.json())
     .then((data) => {
        if (data.status) {
         setTests(tests.filter((test)=>test.id != id))
        }
      });
  }
  return (
    <>
      <List>
        {tests.map((test) => {
          //filter not selected tests

          return (
            <ListItem key={test.id}>
              <ListItemButton>
                <ListItemIcon onClick={()=>{
                  deleteTest(test.id)
                }}>
                  <DeleteIcon  />
                </ListItemIcon>
                <ListItemText primary={test.main_test_name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <div className="total-price">
        <div className="sub-price">
          <div className="title">Total</div>
          <div>{tests.reduce((accum,test)=>{
            return accum + test.price
          },0)}</div>
        </div>
        <div className="sub-price">
          <div className="title">Paid</div>
          <div>100</div>
        </div>{" "}
      </div>
    </>
  );
}

export default RequestedTests;
