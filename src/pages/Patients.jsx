import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import dayjs from "dayjs";
import { webUrl } from "./constants";
import { useStateContext } from "../appContext";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";

function Patients() {
  const [openedDoctors, setOpenedDoctors] = useState([]);
  const { user } = useStateContext();
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    axiosClient.get("doctor/openedDoctorsShifts").then(({ data }) => {
      setOpenedDoctors(data);
      console.log(data, "opened doctors");
    });
  }, []);
  const searchHandler = () => {
    setLoading(true);
    const firstDayjs = firstDate.format("YYYY/MM/DD");
    const secondDayjs = secondDate.format("YYYY/MM/DD");
    axiosClient
      .post(`searchDeductsByDate`, {
        first: firstDayjs,
        second: secondDayjs,
      })
      .then(({ data }) => {
        console.log(data);
        // setDeducts(data);
        // setTemp(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
       <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              onChange={(val) => {
                setFirstDate(val);
              }}
              defaultValue={dayjs(new Date())}
              sx={{ m: 1 }}
              label="From"
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              onChange={(val) => {
                setSecondDate(val);
              }}
              defaultValue={dayjs(new Date())}
              sx={{ m: 1 }}
              label="To"
            />
          </LocalizationProvider>
          <LoadingButton
            onClick={searchHandler}
            loading={loading}
            sx={{ mt: 2 }}
            size="medium"
            variant="contained"
          >
            Go
          </LoadingButton>
        </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Lab</TableCell>
            <TableCell>Services</TableCell>
            <TableCell>Total Paid</TableCell>
            <TableCell>Reciet</TableCell>
          </TableRow>

          {/* Add more table headers here */}
        </TableHead>
        <TableBody>
        {openedDoctors.map((doctorShift) => {
        return doctorShift.visits.map((visit, i) => {
          console.log(visit.patient.labrequests.reduce((prev,curr)=>curr.name),'visit dfsdf')
          return (
           <TableRow key={visit.id}>
            <TableCell>{visit.patient.name}</TableCell>
            <TableCell>{dayjs(new Date(visit.patient.created_at)).format('DD/MM/YYYY H:m A')}</TableCell>
            <TableCell>{visit.patient.doctor.name}</TableCell>
            <TableCell>{visit.patient.labrequests.map((l)=>l.name).join('')}</TableCell>
            {/* <TableCell>{visit.services.reduce((prev,curr)=>`${prev} - ${curr.service.name}`)}</TableCell> */}
            <TableCell>{visit.patient.paid_lab}</TableCell>
            <TableCell>{visit.patient.total_paid_services}</TableCell>
            <TableCell>{visit.patient.total_paid_services + visit.patient.paid_lab}</TableCell>
            <TableCell>   <a href={`${webUrl}printLabReceipt/${visit?.id}/${user?.id}`}>Receipt</a>
           </TableCell>

           </TableRow>
          );
        });
      })}
        </TableBody>
      </Table>
  
    </div>
  );
}

export default Patients;
