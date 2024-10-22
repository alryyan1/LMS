import { Select, MenuItem } from "@mui/material";
import { useState } from "react";
import axiosClient from "../../../axios-client";
import { DoctorVisit } from "../../types/Patient";
interface DiscountSelectLabProps {
  id: number;
  disc: number;
  actviePatient: any;
  setDialog: (prev: any) => void;
  update:(doctorVisit:DoctorVisit)=>void;
 
}
const DiscountSelectLab = ({ id, disc, actviePatient,setDialog,update }:DiscountSelectLabProps) => {
  const [discount, setDiscount] = useState(disc);
  
  const changeDiscountHandler = async (id, dis) => {
    setDiscount(dis);
    try {
      const {data} = await axiosClient.patch(`labRequest/${id}/${actviePatient.id}`,{ test_id: id, discount: dis });
    console.log(data,'data from edit')
      update(data.data)
    } catch ({response:{data}}) {
      setDialog((prev)=>{
        return {...prev, open:true, message:data.message ,color:'error'}
      })
    }
    
  
       
    

  };
  const disabled =  actviePatient.is_lab_paid === 1 

  return (
    <Select fullWidth sx={{
   '& .MuiSelect-select': {
      paddingRight: 0.5,
      paddingLeft: 0.5,
      paddingTop: 0.5,
      paddingBottom: 0.5,
   }
 }}
      disabled={disabled}
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

export default DiscountSelectLab;
