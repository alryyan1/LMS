import { Checkbox } from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MyCheckBox({ id, isbankak, setPatients }) {
  console.log(isbankak, "checked before");
  const [isChecked, setIsChecked] = useState(isbankak);
  console.log(isChecked, "checked after");
  const { actviePatient ,setActivePatient} = useOutletContext();
  const bankakChangeHandler = (val) => {
    console.log(val.target.checked, "checked handler");
    setIsChecked(val.target.checked);
    axiosClient
      .patch(`labRequest/bankak/${id}`, {
        id,
        val: val.target.checked,
      })
      .then(({ status }) => {
        if (status == 200) {
          setActivePatient((patient)=>{
            return {
             ...patient,
              labrequests: patient.labrequests.map((request) => {
                if (request.id == id) {
                  console.log("setting the test", request);
                  return {
                   ...request,
                    pivot: {
                     ...request.pivot,
                      is_bankak: val.target.checked,
                    },
                  };
                } else {
                  return request;
                }
              }),
            }
           })
          setPatients((prev) => {

      
            return prev.map((p) => {
              if (p.id === actviePatient.id) {
                const editedPatient = {
                  ...actviePatient,
                  labrequests: actviePatient.labrequests.map((request) => {
                    if (request.id == id) {
                      console.log("setting the test", request);
                      return {
                        ...request,
                        pivot: {
                          ...request.pivot,
                          is_bankak: val.target.checked,
                        },
                      };
                    } else {
                      return request;
                    }
                  }),
                };
                return editedPatient;
              } else {
                return p;
              }
            });
          });
        }
        // if (status > 400) {
        // }
      });
  };
  return (
    <Checkbox
      disabled={actviePatient.is_lab_paid === 0}
      key={actviePatient.id}
      onChange={bankakChangeHandler}
      checked={isChecked}
    ></Checkbox>
  );
}

export default MyCheckBox;
