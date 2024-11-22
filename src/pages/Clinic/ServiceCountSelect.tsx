import { Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { DoctorVisit } from "../../types/Patient";
interface ServiceCountSelectPros {
  id: number;
  service: { count: number };
  disabled: boolean;
  update : (dv:DoctorVisit)=>void;
 
}
const ServiceCountSelect = ({ id ,update,service,disabled}:ServiceCountSelectPros) => {
  const [count, setCount] = useState(service.count);
  console.log('servce in count select',service)
  
  const changeHandler = async (id, count) => {
    setCount(count);
    const {data} = await axiosClient.patch(`requestedService/count/${id}`,{ service_id: id, serviceCount: count });
    console.log(data)
    if (data.status) {
      console.log(data.patient);
        update(data.patient)
    }

  
    

  };

  return (
<>
<Select variant="standard" label='العدد'   fullWidth sx={{
  color:'black',
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
      value={service.count}
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
<label htmlFor="">العدد</label>

</>
  );
};

export default ServiceCountSelect;
