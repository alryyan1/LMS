import { Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { url } from "../constants";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
const DiscountSelect = ({ id, disc, actviePatient,setPatients,setDialog }) => {
  const [discount, setDiscount] = useState(disc);
  const {setActivePatient} =  useOutletContext()
  
  const changeDiscountHandler = async (id, dis) => {
    setDiscount(dis);
    try {
      const {data} = await axiosClient.patch(`labRequest/${id}`,{ test_id: id, discount: dis });
    console.log(data,'changed')
    setActivePatient(data.data)
    setPatients((prev)=>{
      return prev.map((p)=>{
        if (p.id === actviePatient.id) {
          return {...data.data,active:true}
        } else {
          return p;
        }
      })
    })
    } catch ({response:{data}}) {
      setDialog((prev)=>{
        return {...prev, open:true, message:data.message ,color:'error'}
      })
    }
    
  
       
    

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
      disabled={actviePatient.is_lab_paid == 1}
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

export default DiscountSelect;
