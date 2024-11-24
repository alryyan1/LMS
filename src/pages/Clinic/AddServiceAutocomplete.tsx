import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { url } from "../constants";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { DoctorVisit } from "../../types/Patient";

interface AddServiceAutocompleteProps {
  selectedServices: any;
  setSelectedServices: any;
  activeShift: any;
  setShowPatientServices: any;
  setShowServicePanel: any;
  settings: any;
  patient: DoctorVisit|null;
  setActiveDoctorVisit: any;
  socket: any;
}
function AddServiceAutocomplete({
  selectedServices,
  setSelectedServices,
  activeShift,
  setShowPatientServices,
  setShowServicePanel,
  settings,
  patient,
  setActiveDoctorVisit,
  socket
}: AddServiceAutocompleteProps) {
  const [autoCompleteServices, setAutoComleteServices] = useState([]);
  // const { actviePatient, setActivePatient, setDialog,selectedServices,setSelectedServices,activeShift,setShowPatientServices,setShowServicePanel  ,setUpdate,settings} = useOutletContext();
  const [loading, setLoading] = useState(false);
  console.log(activeShift, "active shift doctor");
  const addServiceHandler = async () => {
    try {
      let payload = selectedServices.map((test) => test.id);
      console.log(payload, "payload");

      if (activeShift) {
        if (!settings.disable_doctor_service_check) {
          if (activeShift.doctor.services.length == 0) {
            // setDialog((prev)=>{
            //   return {
            //    ...prev,
            //     open:true,
            //     color:'error',
            //     message:'لا توجد خدمات معرفه لهذا الطبيب'
            //   }
            // })
            return;
          }
          activeShift.doctor.services.map((s) => {
            if (!payload.includes(s.service.id)) {
              alert("هذه الخدمه غير معرفه من ضمن خدمات الطبيب");
              // setDialog((prev)=>{
              //   return {
              //    ...prev,
              //     open:true,
              //     color:'error',
              //     message:'هذه الخدمه غير معرفه للطبيب'
              //   }
              // })
            }
          });
          payload = payload.filter((s) => {
            return activeShift.doctor.services
              .map((ds) => ds.service.id)
              .includes(s);
          });
          if (payload.length == 0) {
            setLoading(false);
            return;
          }
        }
      }

      setLoading(true);
      if (patient) {
        const { data: data } = await axiosClient.post(
          `patient/service/add/${patient.id}`,
          {
            services: payload,
            doctor_id: activeShift?.doctor?.id ?? patient.patient.doctor.id,
          }
        );
        console.log(data, "result data");
        if (data.status) {
          if (setShowPatientServices) {
            setShowPatientServices(true);
          }
          if (setShowServicePanel) {
            setShowServicePanel(false);
          }
          setLoading(false);

          setActiveDoctorVisit(data.patient);
          socket.emit("patientUpdated", data.patient);

        }
      } else {
        const { data: data } = await axiosClient.post(
          `patient/service/add/${patient.id}`,
          {
            services: payload,
            doctor_id: activeShift?.doctor?.id ?? patient.patient.doctor.id,
          }
        );
        console.log(data, "result data");
        if (data.status) {
          if (setShowPatientServices) {
            setShowPatientServices(true);
          }
          if (setShowServicePanel) {
            setShowServicePanel(false);
          }
          console.log(data.patient, "from db");
          setLoading(false);
          setActiveDoctorVisit(data.patient);
        }
      }
    } catch (error) {}

    setSelectedServices([]);
  };
  useEffect(() => {
    axiosClient.get("service/all").then((res) => {
      setAutoComleteServices(res.data);
    });
  }, []);
  return (
    <div>
      {" "}
      {patient && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: "5px",
            width: "inhert",
            zIndex: "3",
          }}
        >
          <Autocomplete
            multiple
            sx={{ flexGrow: 1 }}
            value={selectedServices}
            onChange={(event, newValue) => {
              console.log(newValue);
              setSelectedServices(newValue);
            }}
            getOptionKey={(op) => op.id}
            getOptionLabel={(option) => option.name}
            options={autoCompleteServices}
            renderInput={(params) => {
              // console.log(params)

              return (
                <TextField
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("enter pressed");
                      //get test from tests using find
                      const enteredId = e.target.value;

                      const founedService = autoCompleteServices.find(
                        (service) => service.id === parseInt(enteredId)
                      );

                      if (founedService) {
                        setSelectedServices((prev) => {
                          return [...prev, founedService];
                        });
                      }
                    }
                  }}
                  {...params}
                  label="Test"
                />
              );
            }}
          ></Autocomplete>
          <LoadingButton
            loading={loading}
            onClick={addServiceHandler}
            variant="contained"
          >
            +
          </LoadingButton>
        </div>
      )}{" "}
    </div>
  );
}

export default AddServiceAutocomplete;
