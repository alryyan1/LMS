import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";
import { Doctor, DoctorShift, Patient, User } from "../types/Patient";

type autoProps =  {
  options : DoctorShift[],
  val:Doctor,
  setDoctor : (doctor: Doctor|undefined|null) => void,
  user: User | null,
  activeShift: DoctorShift | null,
  patient:Patient

}

const  MyAutocomepleteHistory:React.FC<autoProps> = ({ options,val,setDoctor ,user,activeShift,patient }) => {
  const doctorsFilteredByUserOpened = options.filter((shift)=>shift.user_id == user?.id).map((shift) => {
    
    return shift.doctor;
  })
  const [selected, setSelected] = useState<Doctor|undefined|null>();
  //   ()=>{
  //  const doc =  doctorsFilteredByUserOpened.find((d)=>{
  //       return d.id == patient?.doctor?.id
  //   })

  //   setDoctor(doc)
  //   return doc
  // }


  console.log(selected,'selected doctor')
  // console.log(activeShift?.doctor.id == patient?.doctor?.id ? activeShift.doctor : null,'comparison','active shift doctor = ',activeShift?.doctor,' patient doctor = ',patient?.doctor?.id)
  return (
    <Autocomplete
    sx={{width:'150px'}}
      value={selected}
      onChange={(e, data) => {
        setSelected(data);
        setDoctor(data);
      }}
   
      getOptionKey={(op) => op.id}
      getOptionLabel={(option) => option.name}
      options={doctorsFilteredByUserOpened}
      //fill isOptionEqualToValue

      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderInput={(params) => {
        // console.log(params)

        return <TextField variant="standard" {...params} label="الطبيب" />;
      }}
    />
  );
}

export default MyAutocomepleteHistory;
