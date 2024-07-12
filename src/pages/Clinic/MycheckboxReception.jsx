import { Checkbox } from "@mui/material";
import { useState } from "react";
import axiosClient from "../../../axios-client";

function MyCheckboxReception({ id, isbankak,disabled ,checked,setUpdate}) {
  console.log(isbankak, "checked before");
  const [isChecked, setIsChecked] = useState(checked);
  console.log(isChecked, "checked after");
  const changeHandler = (val) => {
    setIsChecked(val.target.checked);
    axiosClient.patch(`requestedService/bank/${id}?val=${Number(val.target.checked)}`).then(() => {
        setUpdate((prev)=>prev+1)
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
