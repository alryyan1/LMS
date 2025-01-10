import React, { useEffect, useState } from "react";
import { DoctorVisit } from "../../types/Patient";
import axiosClient from "../../../axios-client";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import dayjs from "dayjs";

interface LabHistoryProbs {
  doctorVisit: DoctorVisit;
  setActiveDoctorVisit: (visit: DoctorVisit) => void;
}
function LabHistory({ doctorVisit,setActiveDoctorVisit }: LabHistoryProbs) {
  const [patientWithFileHistory, setPatientWithFileHistory] =
    useState<DoctorVisit | null>(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setActiveDoctorVisit(event.target.value);
    console.log(event.target.value,'patient is select')
  };
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`labHistory/${doctorVisit.id}`)
      .then(({ data }) => {
        setPatientWithFileHistory(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [doctorVisit]);
  return (
    <div style={{width:'350px',overflow:'hidden',textAlign:'center'}}>
      {loading ? (
        <CircularProgress size={'30px'} />
      ) : (
        <>
          {patientWithFileHistory?.file.patients.length > 1 ? (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">History</InputLabel>

              <Select
              variant="standard"
                size="small"
                value={selectedValue}
                onChange={handleChange}
            
                displayEmpty
              >
                {patientWithFileHistory?.file.patients.filter((p)=>p.patient.labrequests.length > 0).map((p) => {
                  return (
                    <MenuItem color="red" key={p.id} value={p}>
                      {`${p.patient.name} ${dayjs(p.created_at).format('YYYY-MM-DD')}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          ) : (
            <div>No History Found</div>
          )}
        </>
      )}
    </div>
  );
}

export default LabHistory;
