import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import EditPatientDialog from "../Dialogs/EditPatientDialog";
import axiosClient from "../../../axios-client";

function PatientDetail({ patient, setPatients, copyPatient = false ,showBtns = false}) {


  console.log(patient, "patient in patient details");

  const [open, setOpen] = useState();

  const { openedDoctors, setUpdate, activeShift } = useOutletContext();

  const date = new Date(patient.created_at);

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
        <div className="patientId">{patient.id}</div>
        <div className="form-control">
          <div>{patient.name}</div>
          <div>اسم </div>
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
        <div className="form-control">
          <div>
            {
              //print iso date
              patient.gender
            }
          </div>
          <div>النوع</div>
        </div>
        <Divider />
        <div className="form-control">
          <div>
            {
              //print iso date
              ` ${patient.age_year ?? 0} Y ${
                patient.age_month == null
                  ? ""
                  : " / " + patient.age_month + " M "
              } ${
                patient.age_day == null ? "" : " / " + patient.age_day + " D "
              } `
            }
          </div>
          <div>العمر</div>
        </div>
        {patient.company_id && (
          <div>
            <div className="form-control">
              <div>
                {
                  //print iso date
                  patient.company.name
                }
              </div>
              <div>الشركه</div>
            </div>
            <div className="form-control">
              <div>
                {
                  //print iso date
                  patient.insurance_no
                }
              </div>
              <div>رقم البطاقه</div>
            </div>
            {
              //print iso date
              patient.subcompany_id && (
                <div className="form-control">
                  <div>
                    {
                      //print iso date
                      patient?.subcompany?.name
                    }
                  </div>
                  <div>الجهه</div>
                </div>
              )
            }
            {
              //print iso date
              patient.company_relation_id && (
                <div className="form-control">
                  <div>
                    {
                      //print iso date
                      patient?.relation?.name
                    }
                  </div>
                  <div>العلاقه</div>
                </div>
              )
            }
          </div>
        )}
        {showBtns && <Stack direction={"row"} gap={2}>
          <Button sx={{ flexGrow: 1 }} onClick={handleEdit} variant="contained">
            Edit
          </Button>
          <Button
            sx={{ flexGrow: 1 }}
            onClick={() => {
              axiosClient.get(`print`, {});
            }}
            color="warning"
            variant="contained"
          >
            Print
          </Button>
        </Stack>}
        <Divider sx={{ m: 1 }} />
        {copyPatient && patient.doctor_id == activeShift.doctor.id && (
          <Autocomplete
            onChange={(e, data) => {
              axiosClient
                .post(`patient/copy/${patient.id}/${data.id}`)
                .then(({ data }) => {
                  if (data.status) {
                    setUpdate((prev) => prev + 1);
                  }
                });
            }}
            getOptionDisabled={(option) => {
              return option.id == patient.doctor.id;
            }}
            getOptionKey={(op) => op.id}
            getOptionLabel={(option) => option.name}
            options={openedDoctors.map((shift) => {
              return shift.doctor;
            })}
            //fill isOptionEqualToValue

            isOptionEqualToValue={(option, val) => option.id === val.id}
            renderInput={(params) => {
              // console.log(params)

              return <TextField {...params} label="نسخ المريض" />;
            }}
          />
        )}

        <EditPatientDialog
        doctorVisitId={patient.id}
          open={open}
          setOpen={setOpen}
          patient={patient}
          setPatients={setPatients}
        />
      </Paper>
    </>
  );
}

export default PatientDetail;
