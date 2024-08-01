import { Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../axios-client";
const SaleDiscountSelect = ({ id, disc,setSelectedSale ,disabled}) => {
  const [discount, setDiscount] = useState(disc);
 
  
  const changeDiscountHandler = async (id, dis) => {
    setDiscount(dis);
    try {
      const {data} = await axiosClient.patch(`deductedItem/${id}`,{colName : 'discount' ,val : dis });
    console.log(data,'changed')
    setSelectedSale(data.data)
 
    } catch ({response:{data}}) {
      
    }
    
  
       
    

  };

  return (
    <Select disabled={disabled} fullWidth sx={{
   '& .MuiSelect-select': {
      paddingRight: 0.5,
      paddingLeft: 0.5,
      paddingTop: 0.5,
      paddingBottom: 0.5,
   }
 }}
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

export default SaleDiscountSelect;
