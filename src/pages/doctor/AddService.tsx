import {
  Box,
  Button,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import { useEffect, useState } from "react";
import { t } from "i18next";
import AddServiceAutocomplete from "../Clinic/AddServiceAutocomplete";
import { LoadingButton } from "@mui/lab";
import MyTableCell from "../inventory/MyTableCell";
import green from "./../../assets/images/green.png";
import red from "./../../assets/images/red.png";
import { DoctorVisit, RequestedService } from "../../types/Patient";
import CodeEditor from "./CodeMirror";
interface AddMedicalServiceProps {
  value: any;
  index: number;
  patient: DoctorVisit;
  setActiveDoctorVisit: any;
  user: any;
  setActiveService: any;
  socket: any;
  setNurseNotes: () => void;
  nurseNotes: any[];
}
function AddMedicalService(props: AddMedicalServiceProps) {
  const {
    value,
    index,
    patient,
    setActiveDoctorVisit,
    user,
    socket,
    setNurseNotes,
    nurseNotes,
    ...other
  } = props;

  // alert(user?.id)
  const [selectedService, setSelectedService] =
    useState<RequestedService | null>(null);

  const deleteService = (id) => {
    axiosClient
      .delete(`requestedService/${id}`)
      .then(({ data }) => {
        if (data.status) {
          // change(data.patient);
          if (setActiveDoctorVisit) {
            setActiveDoctorVisit(data.patient);
          }
        }
      })
      .catch(({ response: { data } }) => {});
  };
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
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
          <AddServiceAutocomplete
            setActiveDoctorVisit={setActiveDoctorVisit}
            patient={patient}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            socket={socket}
          />
          {patient?.services?.length > 0 && (
            <TableContainer >
              <Table sx={{ mt: 1 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell> Name</TableCell>
                    <TableCell>Count</TableCell>
                    <TableCell>Doctor Note</TableCell>

                    <TableCell width={"5%"} align="right">
                      Other
                    </TableCell>
                    <TableCell>Status</TableCell>
                    {user?.is_nurse == 1 && <TableCell>Nurse Note</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patient.services.map((service) => {
                    //

                    return (
                      <TableRow
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        }}
                        key={service.id}
                      >
                        <TableCell>{service.service.name}</TableCell>
                        <MyTableCell
                          sx={{ width: "40px" }}
                          table="editRequested"
                          show
                          colName={"count"}
                          item={service}
                          changeDoctorVisit={setActiveDoctorVisit}
                        >
                          {service.count}
                        </MyTableCell>
                        <MyTableCell
                          multiline
                          table="editRequested"
                          colName={"doctor_note"}
                          item={service}
                          changeDoctorVisit={setActiveDoctorVisit}
                          show
                        >
                          {service.doctor_note}
                        </MyTableCell>
                        <TableCell>
                          <LoadingButton
                            variant="contained"
                            fullWidth
                            aria-label="delete"
                            onClick={() => deleteService(service.id)}
                          >
                            {t("delete")}
                          </LoadingButton>
                        </TableCell>
                        <TableCell>
                          {service.done === 1 ? (
                            <img width={15} src={green} alt="green" />
                          ) : (
                            <img width={15} src={red} alt="red" />
                          )}
                        </TableCell>
                        {user?.is_nurse == 1 && (
                          <TableCell>
                            <Button
                              onClick={() => {
                                setSelectedService(service);
                              }}
                            >
                              show
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Divider />
              {selectedService && (
                <div style={{direction:'ltr'}}>
                  <Typography textAlign={"center"} variant="h4">
                    {selectedService.service.name}
                  </Typography>
                 

                  <CodeEditor
                   key={selectedService.id}
                    colName="nurse_note"
                    setOptions={setNurseNotes}
                    tableName="nurse_notes"
                    init={selectedService.nurse_note}
                    options={nurseNotes}
                    patient={patient}
                    setActiveDoctorVisit={setActiveDoctorVisit}
                    api={`editRquestedServiceForNurseNote/${selectedService.id}`}
                  />

                  <LoadingButton
                  sx={{mt:1}}
                    loading={loading}
                    disabled={selectedService.done == 1}
                    onClick={() => {
                      setLoading(true);
                      axiosClient
                        .patch(`editRequested/${selectedService.id}`, {
                          colName: "done",
                          val: 1,
                        })
                        .then(({ data }) => {
                          setActiveDoctorVisit(data.data);
                          setSelectedService(data.requestedService);
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }}
                    fullWidth
                    variant="contained"
                  >
                    Done
                  </LoadingButton>
                </div>
              )}
            </TableContainer>
          )}
          <Divider />
        </Box>
      )}
    </div>
  );
}

export default AddMedicalService;
