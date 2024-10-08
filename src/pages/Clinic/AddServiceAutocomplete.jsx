import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { url } from "../constants";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function AddServiceAutocomplete({ actviePatient, setActivePatient, setDialog,selectedServices,setSelectedServices,activeShift,setShowPatientServices,setShowServicePanel  ,setUpdate,settings,change = null ,activeDoctorVisit=null,changeDoctorVisit=null}) {
  const [autoCompleteServices, setAutoComleteServices] = useState([]);
  // const { actviePatient, setActivePatient, setDialog,selectedServices,setSelectedServices,activeShift,setShowPatientServices,setShowServicePanel  ,setUpdate,settings} = useOutletContext();
  const [loading, setLoading] = useState(false);
  console.log(activeShift,'active shift doctor')
  console.log(actviePatient,'active visit')
  const addServiceHandler = async () => {
    try {
      let payload = selectedServices.map((test) => test.id);
      console.log(payload,'payload')
    
      if (activeShift) {
          if (!settings.disable_doctor_service_check) {
        if (activeShift.doctor.services.length == 0) {
          setDialog((prev)=>{
            return {
             ...prev,
              open:true,
              color:'error',
              message:'لا توجد خدمات معرفه لهذا الطبيب'
            }
          })
          return
        }
          activeShift.doctor.services.map((s)=>{
        if (!payload.includes(s.service.id)) {
          alert('هذه الخدمه غير معرفه من ضمن خدمات الطبيب')
          setDialog((prev)=>{
            return {
             ...prev,
              open:true,
              color:'error',
              message:'هذه الخدمه غير معرفه للطبيب'
            }
          })
        }
      })
      payload =  payload.filter((s)=>{
        return activeShift.doctor.services.map((ds)=>ds.service.id).includes(s)
      })
      if (payload.length == 0 ) {
        setLoading(false)
        return
        
      }
      }
    
      }

    
      
      setLoading(true);
      if (activeDoctorVisit) {
        const { data: data } = await axiosClient.post(
          `patient/service/add/${activeDoctorVisit.id}`,
          { services: payload,doctor_id:activeShift?.doctor?.id ??  actviePatient.doctor.id}
        );
        console.log(data,'result data')
        if (data.status) {
          if (setShowPatientServices) {
            
            setShowPatientServices(true)
          }
          if (setShowServicePanel) {
            
            setShowServicePanel (false)
          }
          console.log(data.patient, "from db");
          setLoading(false);
          if (setActivePatient) {
            
            setActivePatient(data.patient);
          }
          if (changeDoctorVisit) {
            changeDoctorVisit(data.patient)
          }
          if (change) {
            change(data.patient)
          }
          if (setUpdate) {
            
            setUpdate((prev)=>prev+1)
          }
          // setPatients();
          console.log(data.patient, "from db");
          console.info(actviePatient, "active p");
        }
      }else{
        const { data: data } = await axiosClient.post(
          `patient/service/add/${actviePatient.id}`,
          { services: payload,doctor_id:activeShift?.doctor?.id ??  actviePatient.doctor.id}
        );
        console.log(data,'result data')
        if (data.status) {
          if (setShowPatientServices) {
            
            setShowPatientServices(true)
          }
          if (setShowServicePanel) {
            
            setShowServicePanel (false)
          }
          console.log(data.patient, "from db");
          setLoading(false);
          if (setActivePatient) {
            
            setActivePatient(data.patient);
          }
          if (changeDoctorVisit) {
            changeDoctorVisit(data.patient)
          }
          if (change) {
            change(data.patient)
          }
          if (setUpdate) {
            
            setUpdate((prev)=>prev+1)
          }
          // setPatients();
          console.log(data.patient, "from db");
          console.info(actviePatient, "active p");
        }
      }
   
      
    } catch (error) {

      // console.log(response,'error in adding  test data')
      console.log(error, "error in adding  test data");
      if (error.status > 400) {
        setLoading(false);
        setDialog((prev) => {
          return { ...prev, msg: error.message, openError: true, title: "خطا" };
        });
        setLoading(false);
      }
    }

    setSelectedServices([]);
  };
  useEffect(() => {
    axiosClient.get('service/all').then((res) => {
            setAutoComleteServices(res.data)
    })
  }, []);
  return (
    <div>
      {" "}
      {actviePatient && (
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
