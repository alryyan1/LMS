import { Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { url } from "../constants";
import axiosClient from "../../../axios-client";
const DiscountSelect = ({ id, disc, actviePatient,setPatients }) => {
  const [discount, setDiscount] = useState(disc);
  
  const changeDiscountHandler = async (id, dis) => {
    setDiscount(dis);
    const {status} = await axiosClient.patch(`labRequest/${actviePatient.id}`,{ test_id: id, discount: dis });
    if (status == 200) {
        setPatients((prev)=>{
          return prev.map((p)=>{

            if (p.id === actviePatient.id) {
              console.log('founed')
              const editedPatient = {...actviePatient}
              editedPatient.labrequests.map((test)=>{
                console.log(test,'test')
                if (test.id === id) {
                  test.pivot.discount_per = dis;
                  return test
                }else{
                  return test
                }
              })
              console.log(editedPatient,'edited patient')
              return editedPatient
            }
            return p;
          })
        })
    }

  };

  return (
    <Select fullWidth sx={{border:'none'}}
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
