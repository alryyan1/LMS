import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import {
  Box,
  Button,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { webUrl } from "./constants";
import { useStateContext } from "../appContext";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";

function Patients() {
  const [openedDoctors, setOpenedDoctors] = useState([]);
  const { user } = useStateContext();
  const [patients, setPatients] = useState([]);
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    axiosClient.get("doctor/openedDoctorsShifts").then(({ data }) => {
      // setOpenedDoctors(data);
      let patientsFromHandler = patientsHandler(data);
      console.log(patientsFromHandler, "patientsFromHandler");
      setPatients(patientsFromHandler);
      console.log(data, "opened doctors");
    });
  }, []);
  const searchHandler = () => {
    setLoading(true);
    const firstDayjs = firstDate.format("YYYY/MM/DD");
    const secondDayjs = secondDate.format("YYYY/MM/DD");
    axiosClient
      .post(`doctorVisitsByDate`, {
        first: firstDayjs,
        second: secondDayjs,
      })
      .then(({ data }) => {
        console.log(data, "searced data");
        const newData = patientsHandler(data);
        setPatients(newData);
        // setDeducts(data);
        // setTemp(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const patientsHandler = (data) => {
    let arr = [];
    data.map((doctorShift) => {
      return doctorShift.visits.map((visit, i) => {
        console.log(visit, "visit in handler");
        arr.push(visit);
      });
    });

    return arr;
  };
  return (
    <div>
      <Stack alignItems={'center'} alignContent={'center'} gap={2} direction={'row'}>
        <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            format="YYYY-MM-DD"
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
            format="YYYY-MM-DD"
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
    
      {patients.length> 0 &&<Button variant="contained" href={`${webUrl}patientsReport?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}>Report</Button>}
      </Stack>

      <TableContainer component={Card}>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Lab</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Reciet</TableCell>
            </TableRow>

            {/* Add more table headers here */}
          </TableHead>
          <TableBody>
            {patients.map((visit, i) => {
              console.log(visit, "doctor ");
              return (
                <TableRow key={visit.id}>
                  <TableCell>{visit.patient.name}</TableCell>
                  <TableCell>
                    {dayjs(new Date(visit.patient.created_at)).format(
                      "DD/MM/YYYY H:m A"
                    )}
                  </TableCell>
                  <TableCell>{visit.patient?.doctor?.name}</TableCell>
                  <TableCell>{visit.patient?.user.username}</TableCell>
                  <TableCell>
                    {visit.patient.labrequests.map((l) => l.name).join("")}
                  </TableCell>
                  <TableCell>
                    {visit.services.reduce(
                      (prev, curr) => `${prev} - ${curr.service.name}`,
                      ""
                    )}
                  </TableCell>

                  <TableCell>
                    {" "}
                    <a
                      href={`${webUrl}printLabAndClinicReceipt?doctor_visit=${visit.id}&user=${user?.id}`}
                    >
                      Receipt
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Patients;
