import { Select, MenuItem } from "@mui/material";
import { useState } from "react";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
const DiscountSelectService = ({ id, disc, actviePatient ,service}) => {
  const [discount, setDiscount] = useState(disc);
  const {setActivePatient,setActiveShift,setUpdate} = useOutletContext()
  
  const changeDiscountHandler = async (id, dis) => {
    setDiscount(dis);
    const data = await axiosClient.patch(`patient/service/discount/${actviePatient.id}`,{ service_id: id, discount: dis });
    console.log(data)
    setUpdate(prev => prev + 1)

  
    

  };

  return (
    <Select fullWidth sx={{
   '& .MuiSelect-select': {
      paddingRight: 0.5,
      paddingLeft: 0.5,
      paddingTop: 0.5,
      paddingBottom: 0.5,
   }
 }}
      disabled={service.pivot.is_paid == 1}
      onChange={(e) => {
        changeDiscountHandler(id, e.target.value);
      }}
      value={discount}
    >
      <MenuItem value={0}>0%</MenuItem>
      <MenuItem value={10}>10%</MenuItem>
      <MenuItem value={20}>20%</MenuItem>
      <MenuItem value={30}>30%</MenuItem>
      <MenuItem value={40}>40%</MenuItem>
      <MenuItem value={50}>50%</MenuItem>
      <MenuItem value={60}>60%</MenuItem>
      <MenuItem value={70}>70%</MenuItem>
      <MenuItem value={80}>80%</MenuItem>
      <MenuItem value={90}>90%</MenuItem>
      <MenuItem value={100}>100%</MenuItem>
    </Select>
  );
};

export default DiscountSelectService;
