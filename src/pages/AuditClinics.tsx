import { Print } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { webUrl } from "./constants";
import PatientDetail from "./Laboratory/PatientDetail";
import { DoctorShift, DoctorVisit } from "../types/Patient";
import { Shift, Specialist } from "../types/Shift";
import { Heart, HeartIcon } from "lucide-react";
import axiosClient from "../../axios-client";
import MyCustomLoadingButton from "../components/MyCustomLoadingButton";
import EmptyDialog from "./Dialogs/EmptyDialog";
interface AuditClincsProps {
  selectedShift: Shift;
  selectedDoctorShift: any;
  setSelectedVisit: any;
  setSelectedDoctorShift: any;
  selectedVisit: DoctorVisit;
  setShowServices: any;
}
function AuditClinics({
  selectedShift,
  selectedDoctorShift,
  setSelectedVisit,
  setSelectedDoctorShift,
  selectedVisit,
  setShowServices,
}: AuditClincsProps) {
  console.log(selectedDoctorShift, "selecteddoctorshift");
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<Specialist | null>(null);
  const [cashAmount, setCashAmount] = useState(0);
  const [temp, setTemp] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);
  const [showCashReclaimDialog, setShowCashReclaimDialog] = useState(false);

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<DoctorVisit[]>([]);
  const addCost = (id, bankAmount, setIsLoading) => {
    setIsLoading(true);
    axiosClient
      .post(`costForDoctor/${id}`, { shiftId: id, bankAmount })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    //update latest patients for doctor
    const controller = new AbortController();
    if (selectedDoctorShift) {
      axiosClient
        .get(`getDoctorShiftById?id=${selectedDoctorShift?.id}`, {
          signal: controller.signal,
        })
        .then(({ data }) => {
          console.log(data, "getDoctorShiftById");

          setSelectedDoctorShift(data);
          setPatients(data.visits);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return () => controller.abort(); // Clean up the abort controller when component unmounts.
  }, [selectedDoctorShift?.id]);
  const prooveRevenue = (id, setIsLoading) => {
    setIsLoading(true);
    axiosClient
      .get(`prooveRevenue/${id}`)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.log(err))

      .finally(() => setIsLoading(false));
  };
  const prooveCompanyRevenue = (id, setIsLoading) => {
    setIsLoading(true);
    axiosClient
      .post(`prooveCompanyRevenue/${id}`)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.log(err))

      .finally(() => setIsLoading(false));
  };
  const prooveCashReclaim = (setIsLoading) => {
    let r = confirm("هل انت متاكد من اثبات استحقاق الطبيب");
    setIsLoading(true);
    if (!r) return;
    addCost(selectedDoctorShift?.id, bankAmount, setIsLoading);

    axiosClient
      .post(`prooveCashReclaim/${selectedDoctorShift?.id}`, {
        cash: cashAmount,
        bank: bankAmount,
      })
      .then(({ data }) => {
        console.log(data);
        setShowCashReclaimDialog(false);

        addCost(selectedDoctorShift?.id, bankAmount, setIsLoading);
      })
      .catch((err) => console.log(err));
  };
  const prooveCompanyReclaim = (setIsLoading) => {
    setIsLoading(true);
    axiosClient
      .post(`prooveDoctorCompanyReclaim/${selectedDoctorShift?.id}`, {
        cash: cashAmount,
        bank: bankAmount,
      })
      .then(({ data }) => {
        console.log(data);
        setShowCashReclaimDialog(false);
      })
      .finally(() => setIsLoading(false))
      .catch((err) => console.log(err));
  };
  return (
    <div
      style={{
        marginTop: "5px",
        gap: "15px",
        transition: "0.3s all ease-in-out",

        display: "grid",
        direction: "rtl",
        gridTemplateColumns: `1fr  1fr  1fr   1fr     `,
      }}
    >
      <Box>
        <Typography textAlign={"center"} variant="h4">
          التخصصات الطبيه
        </Typography>
        <List dense>
          {selectedShift.specialists.map((specialist) => {
            return (
              <ListItem
                sx={{
                  backgroundColor: (theme) =>
                    selectedSpecialist?.id == specialist.id
                      ? theme.palette.primary.main
                      : "",
                }}
                key={specialist.id}
              >
                <ListItemButton
                  onClick={() => {
                    setSelectedVisit(null);
                    setSelectedDoctorShift(null);
                    setSelectedSpecialist(specialist);
                  }}
                  style={{
                    marginBottom: "2px",
                  }}
                >
                  <ListItemText>{specialist.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {selectedSpecialist && (
        <Box>
          <Typography textAlign={"center"} variant="h4">
            العيادات
          </Typography>

          <List dense>
            {selectedShift.doctor_shifts
              .filter(
                (doctorShift) =>
                  doctorShift.doctor.specialist_id == selectedSpecialist.id
              )
              .map((doctorShift) => {
                return (
                  <ListItem
                    sx={{
                      backgroundColor: (theme) =>
                        selectedDoctorShift?.id == doctorShift.id
                          ? theme.palette.secondary.light
                          : "",
                    }}
                    secondaryAction={
                      <IconButton
                        title="التقرير الخاص"
                        href={`${webUrl}clinics/doctor/report?doctorshift=${doctorShift.id}`}
                      >
                        <Print />
                      </IconButton>
                    }
                    key={doctorShift.id}
                  >
                    <ListItemButton
                      onClick={() => {
                        setSelectedVisit(null);
                        setSelectedDoctorShift(doctorShift);
                      }}
                      style={{
                        marginBottom: "2px",
                      }}
                    >
                      <ListItemText>
                        {doctorShift.doctor.name} ({" "}
                        {doctorShift.status ? "مفتوحه" : "مغلقه"})
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        </Box>
      )}
      <Box>
        <List dense>
          {patients.map((visit) => {
            return (
              <ListItem
                sx={{
                  backgroundColor: (theme) =>
                    selectedVisit?.id == visit.id
                      ? theme.palette.warning.light
                      : "",
                }}
                secondaryAction={
                  <Badge color="secondary" content={visit.services.length}>
                    <Button
                      onClick={() => {
                        setSelectedVisit(visit);
                        setShowServices(true);
                      }}
                      variant="contained"
                    >
                      الخدمات
                    </Button>
                  </Badge>
                }
                key={visit.id}
              >
                <ListItemButton
                  onClick={() => {
                    console.log(visit, "selected visit");
                    setSelectedVisit(visit);
                  }}
                  style={{
                    marginBottom: "2px",
                  }}
                >
                  <ListItemText>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <div>{visit.patient.name}</div>
                      {visit.patient.company && <Chip>تامين</Chip>}
                    </Stack>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box>
        {selectedVisit && (
          <PatientDetail
            activeShift={selectedDoctorShift}
            patient={selectedVisit}
            isLab={true}
          />
        )}
        {selectedDoctorShift && (
          <Stack direction={"column"} gap={1}>
            <MyCustomLoadingButton
              disabled={selectedDoctorShift.is_cash_revenue_prooved}
              onClick={(setIsLoading) => {
                setIsLoading(true);
                let result = confirm("هل انت متاكد من اثبات الايراد النقدي");
                if (result) {
                  prooveRevenue(selectedDoctorShift.id, setIsLoading);
                }
              }}
              variant="contained"
            >
              اثبات الايراد النقدي
            </MyCustomLoadingButton>
            <MyCustomLoadingButton
              disabled={
                selectedDoctorShift.is_cash_revenue_prooved == false ||
                selectedDoctorShift.is_cash_reclaim_prooved
              }
              onClick={(setIsLoading) => {
                //confirm

                setShowCashReclaimDialog(true);
              }}
              variant="contained"
            >
              اثبات الاستحقاق النقدي
            </MyCustomLoadingButton>
            <MyCustomLoadingButton
              disabled={selectedDoctorShift.is_company_revenue_prooved}
              onClick={(setIsLoading) => {
                let result = confirm("هل انت متاكد من اثبات ايراد   التامين ");
                if (result) {
                  setIsLoading(true);

                  prooveCompanyRevenue(selectedDoctorShift.id, setIsLoading);
                }
              }}
              variant="contained"
            >
              اثبات الايراد من التامين
            </MyCustomLoadingButton>

            <MyCustomLoadingButton
              disabled={
                selectedDoctorShift.is_company_revenue_prooved == false ||
                selectedDoctorShift.is_company_reclaim_prooved
              }
              onClick={(setIsLoading) => {
                // setIsLoading(true)

                let result = confirm(
                  "هل انت متاكد من اثبات استحقاق الطبيب من التامين "
                );
                if (result) {
                  prooveCompanyReclaim(setIsLoading);
                }
              }}
              variant="contained"
            >
              اثبات الاستحقاق من التامين
            </MyCustomLoadingButton>
          </Stack>
        )}
      </Box>
      <EmptyDialog
        show={showCashReclaimDialog}
        setShow={setShowCashReclaimDialog}
      >
        <Stack direction={"column"} gap={1} sx={{ p: 1 }}>
          <TextField
            sx={{ fontSize: "19px" }}
            value={cashAmount}
            onChange={(e) => {
              setCashAmount(e.target.value);
              setBankAmount(temp - e.target.value);
            }}
            label="الصندوق"
          />
          <TextField
            value={bankAmount}
            onChange={(e) => {
              setBankAmount(e.target.value);
              setCashAmount(temp - e.target.value);
            }}
            label="البنك"
          />
          <MyCustomLoadingButton onClick={prooveCashReclaim}>
            خصم الاستحقاق النقدي
          </MyCustomLoadingButton>
        </Stack>
      </EmptyDialog>
    </div>
  );
}

export default AuditClinics;
