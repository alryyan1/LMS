import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { url } from "../constants";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { DoctorShift, DoctorVisit, MainTest } from "../../types/Patient";

interface AddTestAutocompleteLabProps {
  patients: DoctorVisit[];
  actviePatient: DoctorVisit;
  setDialog: (dialog: { showMoneyDialog: boolean; title: string; color: string; open: boolean }) => void;
  selectedTests: MainTest[];
  setSelectedTests: (selectedTests: MainTest[]) => void;
  setClinicPatient: (patient: DoctorVisit) => void;
  setShift: (shift: DoctorShift) => void;
  update : (dcVisit:DoctorVisit) => void;
}
function AddTestAutocompleteLab({ update,patients ,actviePatient,setDialog,selectedTests,setSelectedTests,setClinicPatient,setShift}:AddTestAutocompleteLabProps) {
  const [autoCompleteTests, setAutoCompleteTests] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(autoCompleteTests, "auto complete tests");
  const addTestHanlder = async () => {

 
    setLoading(true);
    try {
      const payload = selectedTests.map((test) => test.id);
      const { data: data } = await axiosClient.post(
        `labRequest/add/${actviePatient.id}`,
        { main_test_id: payload }
      );
      if (data.status) {
        setLoading(false);
        const newActivePatient = data.patient;
        newActivePatient.active = true;
        if (update) {
          // alert('dddddd')
          console.log(data.patient,'new patient ');

          update(data.patient);
        }
        if (setClinicPatient) {
          setClinicPatient((prev)=>{
            return {...prev,patient:data.patient}
          })
         
          setShift((prev)=>{
            return {...prev, visits:prev.visits.map((v)=>{
              if(v.patient_id === data.patient.id){
                return {...v,patient:data.patient}
              }
              return v;
            })}
          })
        }
      
      }else{
        setLoading(false);
        setDialog((prev) => {
          return {...prev,open:true, message: data.message,color:'error'};
        });
        setLoading(false);
      }

    } catch ({
      response: {
        data: { message },
        status,
      },
    }) {
      console.log(message,'message')
      // console.log(response,'error in adding  test data')
      console.log(message, "error in adding  test data");
   
        setLoading(false);
        setDialog((prev) => {
          return { ...prev,open:true, message: message};
        });
        setLoading(false);
      
    }

    setSelectedTests([]);
  };
  useEffect(() => {
    axiosClient.get(`tests`)
      .then(({data}) => {
        console.log(data,'autocomplete tests')
        setAutoCompleteTests(data);
      });
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
            size="small"
            sx={{ flexGrow: 1 }}
            value={selectedTests}
            onChange={(event, newValue) => {
              console.log(newValue);
              setSelectedTests(newValue);
            }}
            getOptionKey={(op) => op.id}
            getOptionLabel={(option) => option.main_test_name}
            options={autoCompleteTests}
            renderInput={(params) => {
              // console.log(params)

              return (
                <TextField
                 autoFocus={true}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("enter pressed");
                      //get test from tests using find
                      const enteredId = e.target.value;

                      const foundedTest = autoCompleteTests.find(
                        (test) => test.id === parseInt(enteredId)
                      );

                      if (foundedTest) {
                        setSelectedTests((prev) => {
                          return [...prev, foundedTest];
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
            onClick={addTestHanlder}
            variant="contained"
          >
            +
          </LoadingButton>
        </div>
      )}{" "}
    </div>
  );
}

export default AddTestAutocompleteLab;