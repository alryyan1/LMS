import { Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
import { ReceptionLayoutProps } from "../../types/CutomTypes";
import { DoctorVisit, RequestedService } from "../../types/Patient";
interface DiscountSelectServicePops{
  id: number;
  update: (visit:DoctorVisit)=>void;

  service:RequestedService
}
const DiscountSelectService = ({ id, update ,service}:DiscountSelectServicePops) => {
  const [discount, setDiscount] = useState(service.discount);
   const {setDialog} =    useOutletContext<ReceptionLayoutProps>()
  console.log('discount select rendered ')
  
  const changeDiscountHandler = async (id, dis) => {
    setDiscount(dis);
    try {
        const {data} = await axiosClient.patch(`requestedService/discount/${id}`,{ service_id: id, discount: dis });
    console.log(data)
    if (data.status) {
      console.log(data.patient);
      update(data.patient);
    }

  
    } catch ({response:{data}}) {
        setDialog((prev)=>{
          return {...prev, open: true,color:'error' ,message:data.message};
        })
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
      disabled={service.is_paid == 1}
      onChange={(e) => {
        changeDiscountHandler(id, e.target.value);
      }}
      value={service.discount}
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
