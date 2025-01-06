import { Checkbox } from "@mui/material";
import { useState } from "react";
import axiosClient from "../../../axios-client";
import { DoctorVisit } from "../../types/Patient";

interface MyCheckboxReceptionProps {
  id: number;
  disabled: boolean;
  checked: boolean;
  setAllMoneyUpdated:()=>void;
  update: (prev:DoctorVisit) => void;
 
}
function MyCheckboxReception({ id,disabled ,checked,update,setAllMoneyUpdated}:MyCheckboxReceptionProps) {
  const [isChecked, setIsChecked] = useState(checked);
  console.log(isChecked, "checked after");
  const changeHandler = (val) => {
    setIsChecked(val.target.checked);
    axiosClient.patch(`requestedService/bank/${id}?val=${Number(val.target.checked)}`).then(({data}) => {
      console.log(data,'data')
        update(data.patient)
        setAllMoneyUpdated((prev)=>prev+1)
    });
 
  };
  return (
    <Checkbox
      disabled={disabled}
      key={id}
      onChange={changeHandler}
      checked={isChecked}
    ></Checkbox>
  );
}

export default MyCheckboxReception;
