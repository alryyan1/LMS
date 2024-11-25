import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  ListItemButton,
  Badge,
  Typography,
  Divider,
  Snackbar,
  Alert,
  ListItemIcon,
  Stack,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { webUrl } from "./constants";
import PatientServicesDialog from "./Dialogs/PatientServicesDialog";
import AuditClinics from "./AuditClinics";
import AuditCost from "./AuditCost";
import AuditLab from "./AuditLab";
import { LoadingButton } from "@mui/lab";
import AuditPanel from "../components/AuditPanel";
import { Shift } from "../types/Shift";

function Audit() {
  const [date, setDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    showMoneyDialog: false,
    title: "",
    color: "success",
    open: false,
    openError: false,
    openLabReport: false,
    message: "Addition was successfull",
  });
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    document.title = "المراجعه";
  }, []);
  const [selectedShift, setSelectedShift] = useState<Shift|null>(null);
  const [showServices, setShowServices] = useState(false);
  const [selectedDoctorShift, setSelectedDoctorShift] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const searchShiftByDateHandler = () => {
    setLoading(true);
    axiosClient
      .get(`getShiftByDate?date=${date.format("YYYY-MM-DD")}`)
      .then(({ data }) => {
        console.log(data);
        setShifts(data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    axiosClient.get("company/all").then(({ data }) => {
      console.log(data, "comapnies");
      setCompanies(data);
    });
  }, []);
  return (
    <>
      <div className="all-report">
        <div className="grid-item grid-item-1">
          {" "}
          <Box sx={{ direction: "ltr" }}>
            {/* <SimpleMediaQuery/> */}
            <Stack
              direction={"row"}
              alignContent={"center"}
              alignItems={"center"}
              display={"inline-flex"}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                  format="YYYY/MM/DD"
                  onChange={(val) => {
                    setDate(val);
                  }}
                  value={date}
                  defaultValue={dayjs(new Date())}
                  sx={{ m: 1 }}
                  label="تاريخ"
                />
              </LocalizationProvider>
              <LoadingButton
                loading={loading}
                onClick={searchShiftByDateHandler}
                size="medium"
                variant="contained"
              >
                بحث
              </LoadingButton>
            </Stack>
          </Box>
          <Snackbar
            open={dialog.open}
            autoHideDuration={2000}
            onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
          >
            <Alert
              severity={dialog.color}
              variant="filled"
              sx={{ width: "100%", direction: "rtl" }}
            >
              {dialog.message}
            </Alert>
          </Snackbar>
          {showServices && (
            <PatientServicesDialog
              setDialog={setDialog}
              activeShift={selectedDoctorShift}
              setActivePatient={setSelectedVisit}
              companies={companies}
              patient={selectedVisit}
              showServices={showServices}
              setShowServices={setShowServices}
            />
          )}
        </div>
        <div className="grid-item grid-item-2">
        {" "}
          {selectedShift && (
            <AuditPanel
              lab={<AuditLab />}
              cost={
                <AuditCost
                  selectedShift={selectedShift}
                  setSelectedShift={setSelectedShift}
                />
              }
              clinics={
                <AuditClinics
                  selectedDoctorShift={selectedDoctorShift}
                  setSelectedVisit={setSelectedVisit}
                  setShowServices={setShowServices}
                  setSelectedDoctorShift={setSelectedDoctorShift}
                  selectedShift={selectedShift}
                  selectedVisit={selectedVisit}
                />
              }
            />
          )}
          {" "}
         
        </div>
        <div className="grid-item grid-item-3">
        {shifts.length > 0 && (
            <Stack
              textAlign={"center"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={1}
              direction={"column"}
            >
              {shifts.map((shift, index) => (
                <Button

                  variant={selectedShift?.id == shift.id ? 'contained':'outlined'}
                  onClick={() => {
                    setSelectedShift(shift);
                    setSelectedDoctorShift(null)
                  }}
                  key={index}
                >
                  {dayjs(Date.parse(shift.created_at)).format(
                    "YYYY-MM-DD H:m A"
                  )}
                </Button>
              ))}

              {selectedShift && (
                <Box>
                  <a href={`${webUrl}clinics/all?shift=${selectedShift.id}`}>
                    التقرير العام للورديه رقم {selectedShift.id}
                  </a>

                  <Divider></Divider>
                  <a href={`${webUrl}lab/report?shift=${selectedShift.id}`}>
                    تقرير المختبر {selectedShift.id}
                  </a>
                  <Divider></Divider>
                  <a
                    href={`${webUrl}insurance/report?shift=${selectedShift.id}`}
                  >
                    تقرير التامين {selectedShift.id}
                  </a>
                </Box>
              )}
            </Stack>
          )}
        </div>
      </div>
    </>
  );
}

export default Audit;
