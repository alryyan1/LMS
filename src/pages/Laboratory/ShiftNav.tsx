import "./addPatient.css";

import {
  Stack,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";
import urgentSound from "../../assets/sounds/urgent.mp3";
import { useState } from "react";
import { Shift } from '../../types/Shift';
function ShiftNav({shift,setShift,setPatients}) {
    const [loading ,setLoading] = useState(false)
  return (
    <Stack justifyContent={"space-around"} direction={"row"}>
      <LoadingButton
        loading={loading}
        disabled={shift?.id == 1}
        onClick={() => {
          if (shift.id == 1) {
            return;
          }
          setLoading(true);
          axiosClient
            .get(`shiftById/${shift.id - 1}`)
            .then(({ data }) => {
              setShift(data.data);
              setPatients(data.data.patients)
            })
            .finally(() => setLoading(false));
        }}
      >
        <ArrowBack />
      </LoadingButton>
      <LoadingButton
        loading={loading}
        disabled={shift?.id == shift?.maxShiftId}
        onClick={() => {
          // if (shift.id == 1) {
          //   return
          // }
          setLoading(true);
          axiosClient
            .get(`shiftById/${shift.id + 1}`)
            .then(({ data }) => {
              setShift(data.data);
              setPatients(data.data.patients)

            })
            .finally(() => setLoading(false));
        }}
      >
        <ArrowForward />
      </LoadingButton>
    </Stack>
  );
}

export default ShiftNav;
