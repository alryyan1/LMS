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
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(null);
  const [searchedDoctors, setSearchedDoctors] = useState([]);
  const { dialog, setDialog, doctors, setOpenedDoctors,openedDoctors } = useOutletContext();
  console.log(doctors, "doctors from dialog");
  useEffect(() => {
    if (doctors) {
      setSearchedDoctors(doctors);
    }
  }, [doctors]);
  
  const searchHandler = (val) => {
    setSearchedDoctors((prev) => {
      return doctors.filter((doctor) => {
        return doctor.name.toLowerCase().includes(val.toLowerCase());
      });
    });
  };
  const openDoctorShiftHandler = (doctor) => {
    console.log(openedDoctors)
    console.log(doctor);
    axiosClient.get(`doctor/shift/open/${doctor.id}`).then(({ data }) => {
      if (data.status) {
        console.log(data)
        setOpenedDoctors((prev) => {
          return [
            ...prev,
            data.shift
          ];
        });
        setSearchedDoctors((prev)=>{
         return prev.map((d)=>{
           if(d.id === doctor.id){
             return {...d,last_shift:{...data.shift}}
           }else{
             return d
           }
         })
        })
      }else{
      setDialog((prev)=>({...prev,openError:true,msg:data.msg}))
      }
    });
  };
  const closeDoctorShift = (doctor) => {
    axiosClient.get(`doctor/shift/close/${doctor.id}`).then(({ data }) => {
      if (data.status) {
        setOpenedDoctors((prev) => {
          return prev.filter((shift) => {
            return shift.doctor.id !== doctor.id;
          });
        });
        setSearchedDoctors((prev)=>{
           return prev.map((d)=>{
             if(d.id === doctor.id){
               return {...d,last_shift:{...d.last_shift,status:0}};
             }else{
               return d
             }
           })
        })
      }
    });
  };
  return (
    <div>
      <Dialog open={dialog.showDoctorsDialog}>
        <Stack justifyContent={"end"} sx={{ p: 1 }} direction={"row"} gap={3}>
          <TextField
            onChange={(e) => searchHandler(e.target.value)}
            size="small"
            label="بحث"
            type="search"
          ></TextField>
        </Stack>

        <DialogContent>
          <TableContainer>
            <Table style={{ direction: "rtl" }} size="small">
              <thead>
                <TableRow>
                  <TableCell>اسم الطبيب</TableCell>
                  <TableCell>فتح</TableCell>
                  <TableCell>قفل</TableCell>
                </TableRow>
              </thead>
              <tbody>
                {searchedDoctors.slice(page, page + 10).map((doctor) => {
                  return (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>
                        <Button
                          disabled={
                            doctor.last_shift &&
                            doctor.last_shift.status === 1
                          }
                          onClick={() => openDoctorShiftHandler(doctor)}
                          variant="contained"
                        >
                          فتح ورديه
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          disabled={
                            doctor.last_shift &&
                            doctor.last_shift.status === 0
                          }
                          onClick={() => closeDoctorShift(doctor)}
                          variant="contained"
                          color="error"
                        >
                          قفل ورديه
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          </TableContainer>
          <Pagination
            shape="rounded"
            onChange={(e, number) => setPage(number * 10 - 10)}
            count={Math.ceil(doctors.length/10)}
            variant="outlined"
          />
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
