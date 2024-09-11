import {
  Box,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import { useEffect, useState } from "react";
import { t } from "i18next";
import AddServiceAutocomplete from "../Clinic/AddServiceAutocomplete";
import { LoadingButton } from "@mui/lab";
function AddMedicalService(props) {
  const {
    value,
    index,
    patient,
    setDialog,
    change,
    complains,
    setShift,
    activeDoctorVisit,
    changeDoctorVisit,
    ...other
  } = props;
 console.log(patient,'patient')
 console.log(activeDoctorVisit,'activeDoctorVisit')
  const deleteService = (id) => {
    axiosClient
      .delete(`requestedService/${id}`)
      .then(({ data }) => {
        if (data.status) {
          change(data.patient);
          setDialog((prev) => {
            return {
              ...prev,
              open: true,
              message: "Delete was successfull",
              color: "success",
            };
          });
        }
      })
      .catch(({ response: { data } }) => {
        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            message: data.message,
            color: "error",
          };
        });
      });
  };
  const [selectedServices, setSelectedServices] = useState([]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Divider sx={{ mb: 1 }} variant="middle">
        Medical Service Request
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around", m: 1 }} className="">
          <AddServiceAutocomplete changeDoctorVisit={changeDoctorVisit} activeDoctorVisit={activeDoctorVisit} selectedServices={selectedServices} setSelectedServices={setSelectedServices} actviePatient={patient} setDialog={setDialog}   />
      {activeDoctorVisit?.services?.length > 0 &&     <TableContainer sx={{ border: "none", textAlign: "left" }}>
            <Table size="small" >
              <TableHead>
                <TableRow>
                  <TableCell> {t("name")}</TableCell>

                  <TableCell width={"5%"} align="right">
                    {t("other")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeDoctorVisit.services.map((service) => {
                  // console.log(actviePatient,'active patient')

                  return (
                    <TableRow
                      sx={{
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      }}
                      key={service.id}
                    >
                      <TableCell sx={{ border: "none" }} scope="row">
                        {service.service.name}
                      </TableCell>

                      <TableCell>
                        <LoadingButton
                          variant="contained"
                          fullWidth
                          disabled={patient?.is_lab_paid == 1}
                          aria-label="delete"
                          onClick={() => deleteService(service.id)}
                        >
                          {t("delete") }
                        </LoadingButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>}
          <Divider />
        </Box>
      )}
    </div>
  );
}

export default AddMedicalService;
