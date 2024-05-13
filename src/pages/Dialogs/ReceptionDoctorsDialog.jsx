import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function ReceptionDoctorsDialog() {
    const [page,setPage] = useState(0)
    const [search,setSearch] = useState(null)
    const [searchedDoctors,setSearchedDoctors] = useState([])
  const { dialog, setDialog, doctors } = useOutletContext();
  console.log(doctors,'doctors from dialog')
  useEffect(()=>{
    if (doctors) {
        
        setSearchedDoctors(doctors)
    }
  },[doctors])
  console.log(dialog);
  const searchHandler = (val)=>{
    setSearchedDoctors((prev)=>{
        return doctors.filter((doctor)=>{
            return doctor.name.toLowerCase().includes(val.toLowerCase())
        })

    })
  }
  const openDoctorShiftHandler = (doctorId) => {
    axiosClient.get(`doctor/shift/open/${doctorId}`).then((res)=>{
        console.log(res)
    }); 
  }
  return (
    <div>
      <Dialog  open={dialog.showDoctorsDialog}>
        <Stack justifyContent={'end'} sx={{p:1}} direction={"row"} gap={3}>
          <TextField onChange={(e)=>searchHandler(e.target.value)} size="small" label="بحث" type="search"></TextField>
        </Stack>

        <DialogContent>
          <TableContainer>
            <Table style={{direction:'rtl'}} size="small">
              <thead>
                <TableRow>
                  <TableCell>اسم الطبيب</TableCell>
                  <TableCell>فتح</TableCell>
                  <TableCell>قفل</TableCell>
                </TableRow>
              </thead>
              <tbody>
                { searchedDoctors.slice(page, page + 10).map((doctor) => {
                  return (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>
                        <Button disabled={doctor.shifts.length > 0 && doctor.shifts[0].status === 1} onClick={()=>openDoctorShiftHandler(doctor.id)} variant="contained">فتح ورديه</Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" color="error">
                          قفل ورديه
                        </Button>{" "}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          </TableContainer>
          <Pagination  shape="rounded"  onChange={(e,number)=>setPage((number  * 10)- 10)} count={(doctors.length /10 ).toFixed(0) }  variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDialog((prev) => {
                return { ...prev, showDoctorsDialog: false };
              })
            }
          >
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ReceptionDoctorsDialog;
