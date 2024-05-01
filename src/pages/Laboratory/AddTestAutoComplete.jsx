import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { url } from "../constants";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function AddTestAutoComplete({ patients,setPatients }) {
  const [autoCompleteTests, setAutoCompleteTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const { actviePatient, setOpen, setError ,setActivePatient} = useOutletContext();
  const [loading, setLoading] = useState(false);
  const addTestHanlder = async () => {
    setLoading(true);
    const payload = selectedTests.map((test) => test.id);

    const {data:data} = await axiosClient.post(
      `labRequest/add/${actviePatient.id}`,
      { main_test_id: payload }
    );
    console.log(data,'added test data')

    if (data.status > 400) {
      setOpen(true);
      setError(data.message);
      setLoading(false);
      throw new Error(data.message);
    }
    if (data.status) {
      const newActivePatient = data.patient;
      newActivePatient.active = true;
      setActivePatient(data.patient)
      //then update patients 
      setPatients(
       (patients)=>{
        return patients.map((patient) => {
          if (patient.id === actviePatient.id) {
            return newActivePatient;
          } else {
            return patient;
          }
        })
       }
      );
      console.log(data.patient,'from db')
      console.info(actviePatient,'active p')

    }
    setLoading(false);
    setSelectedTests([]);
  };
  useEffect(() => {
    fetch(`${url}tests`)
      .then((res) => res.json())
      .then((data) => {
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

              return <TextField {...params} label="Test" />;
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

export default AddTestAutoComplete;
