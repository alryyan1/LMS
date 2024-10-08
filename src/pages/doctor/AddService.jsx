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
    user,
    ...other
  } = props;
  
  
  const [selectedService, setSelectedService] = useState(null);

  const deleteService = (id) => {
    axiosClient
      .delete(`requestedService/${id}`)
      .then(({ data }) => {
        
        if (data.status) {
          // change(data.patient);
          if (changeDoctorVisit) {
            changeDoctorVisit(data.patient);
          }
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
  const [loading,setLoading] = useState()
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
            changeDoctorVisit={changeDoctorVisit}
            activeDoctorVisit={activeDoctorVisit}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            actviePatient={patient}
            setDialog={setDialog}
          />
          {activeDoctorVisit?.services?.length > 0 && (
            <TableContainer sx={{ border: "none", textAlign: "left" }}>
              <Table sx={{ mt: 1 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell> {t("name")}</TableCell>
                    <TableCell>Count</TableCell>
                    <TableCell>Doctor Note</TableCell>

                 <TableCell width={"5%"} align="right">
                      {t("other")}
                    </TableCell>
                    <TableCell>Status</TableCell>
                    {user?.is_nurse == 1 &&    <TableCell>Nurse Note</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeDoctorVisit.services.map((service) => {
                    
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
                          setDialog={setDialog}
                          sx={{ width: "40px" }}
                          table="editRequested"
                          colName={"count"}
                          item={service}
                          changeDoctorVisit={changeDoctorVisit}
                        >
                          {service.count}
                        </MyTableCell>
                        <MyTableCell
                          setDialog={setDialog}
                          multiline
                          table="editRequested"
                          colName={"doctor_note"}
                          item={service}
                          changeDoctorVisit={changeDoctorVisit}
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
                        {user?.is_nurse == 1 &&  <TableCell>
                          <Button
                            onClick={() => {
                              setSelectedService(service);
                            }}
                          >
                            show
                          </Button>
                        </TableCell>}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Divider />
              {selectedService && (
                <div>
                  <Typography textAlign={'center'} variant="h4">{selectedService.service.name}</Typography>
                  <TextField
                    key={selectedService.id}
                    defaultValue={selectedService.nurse_note}
                    onChange={(e) => {
                      axiosClient
                        .patch(`editRequested/${selectedService.id}`,{colName:'nurse_note',val:e.target.value})
                        .then(({ data }) => {
                          changeDoctorVisit(data.data);
                        });
                    }}
                    multiline
                    rows={5}
                    fullWidth
                    sx={{ p: 2 }}
                    label="Nurse Note"
                  ></TextField>
                  <LoadingButton loading={loading} disabled={selectedService.done == 1} onClick={()=>{
                    setLoading(true)
                      axiosClient
                      .patch(`editRequested/${selectedService.id}`,{colName:'done',val:1})
                      .then(({ data }) => {
                        changeDoctorVisit(data.data);
                        setSelectedService(data.requestedService)
                      }).finally(()=>{
                        setLoading(false)
                      });
                  }} fullWidth  variant="contained" >
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
