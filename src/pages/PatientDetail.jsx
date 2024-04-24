import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
 
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function PatientDetail({ patient ,patients,setPatients,setActivePatient}) {
  console.log(patient,'patient in patient details')

  
  const appData = useOutletContext();
  const [open, setOpen] = useState();
  const [details,setDetails] = useState({name:patient.name,phone:patient.phone,doctor:patient.doctor_id})
  const date = new Date(patient.created_at);
  function handleSave(){
    fetch(`${url}patients/edit/${patient.id}`,{
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      body:new URLSearchParams(details)
    }).then((res)=>res.json()).then((data)=>{
      if (data.status) {
        setPatients(patients.map((p)=>{
          if (p.id == patient.id) {
            return {...p,name:details.name,phone:details.phone,doctor_id:details.doctor }
          }
          return p
        }))
        setOpen(false)
        setActivePatient((p)=>{

          const doctor   = appData.doctors.find((val)=>{
            console.log(val)
              return val.id == details.doctor
          })
          console.log(doctor,'founded doctor')


          return {...p,name:details.name,phone:details.phone,doctor_id:details.doctor,doctor:doctor}
        })
        
      }
    })
  }
  const handleEdit = () => {
    setOpen(true);
  };
  return (
    <>
      <Paper elevation={3} sx={{ padding: "10px" }}>
        <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
          تفاصيل المريض
        </Typography>
        {/** add card body   */}
        <div className="form-control">
          <div>{patient.name}</div>
          <div>اسم المريض </div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{patient.doctor.name}</div>
          <div>الطبيب</div>
        </div>
        <Divider />

        <div className="form-control">
          <div>
            {
              //print iso date
              date.toLocaleDateString()
            }
          </div>
          <div>التاريخ</div>
        </div>
        <Divider />
        <div className="form-control">
          <div>
            {
              //print iso date
              patient.phone
            }
          </div>
          <div>الهاتف</div>
        </div>
        <Divider />
        <div className="form-control">
          <div>
            {
              //print iso date
              date.toLocaleTimeString()
            }
          </div>
          <div>الزمن</div>
        </div>
        <Divider />
        <Grid container sx={{ m: 2, p: 2 }}>
          <Grid item xs={6}>
            <Button onClick={handleEdit} variant="contained">
              Edit
            </Button>
          
          </Grid>
          <Grid item xs={6}>
            <Button color="warning" variant="contained">Print</Button>
          </Grid>
        </Grid>
        <Dialog key={patient.id} sx={{ p: 2 }} open={open == undefined ? false:open}>
          <DialogTitle>تعديل البيانات</DialogTitle>
          <DialogContent  dividers>
            <FormControl color="error">
              <TextField onChange={(newVal)=>{
                setDetails((prev)=>{
                  return {...prev,name:newVal.target.value}
                })
              }}   sx={{mb:1}} variant="standard" value={details.name} label={"اسم المريض"}></TextField>
              <TextField onChange={(newVal)=>{
                setDetails((prev)=>{
                  return {...prev,phone:newVal.target.value}
                })
              }} sx={{mb:1}}  variant="standard" value={details.phone} label={"رقم الهاتف"}></TextField>
              <Select sx={{mb:1}}  color="secondary" value={details.doctor} onChange={(val)=>{
                // console.log(val.target.value)
                setDetails((prev)=>{
                  return {
                   ...prev,
                    doctor:val.target.value
                  }
                })
              }}>
                  {appData.doctors.map((doc)=>{
                    return <MenuItem value={doc.id} key={doc.id}>{doc.name}</MenuItem>
                  })}
              </Select>

            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={()=>{
              setOpen(false)
            }}>close</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}

export default PatientDetail;
