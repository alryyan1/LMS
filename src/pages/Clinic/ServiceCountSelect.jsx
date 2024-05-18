import { Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
const ServiceCountSelect = ({ id, actviePatient ,service,disabled}) => {
  const [count, setCount] = useState(service.pivot.discount);
  const {setActivePatient,setActiveShift} = useOutletContext()
  console.log('discount select rendered ')
  
  const changeHandler = async (id, count) => {
    setCount(count);
    const {data} = await axiosClient.patch(`patient/service/count/${actviePatient.id}`,{ service_id: id, serviceCount: count });
    console.log(data)
    if (data.status) {
      console.log(data.patient);
      setActivePatient(data.patient);
    }

  
    

  };

  return (
    <Select  fullWidth sx={{
   '& .MuiSelect-select': {
      paddingRight: 0.5,
      paddingLeft: 0.5,
      paddingTop: 0.5,
      paddingBottom: 0.5,
   }
 }}
      disabled={disabled}
      onChange={(e) => {
        changeHandler(id, e.target.value);
      }}
      value={service.pivot.discount}
    >
      <MenuItem value={1}>1</MenuItem>
      <MenuItem value={2}>2</MenuItem>
      <MenuItem value={3}>3</MenuItem>
      <MenuItem value={4}>4</MenuItem>
      <MenuItem value={5}>5</MenuItem>
      <MenuItem value={6}>6</MenuItem>
      <MenuItem value={7}>7</MenuItem>
      <MenuItem value={8}>8</MenuItem>
      <MenuItem value={9}>9</MenuItem>
      <MenuItem value={10}>10</MenuItem>
    </Select>
  );
};

export default ServiceCountSelect;
