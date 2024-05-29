import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { url } from "../constants";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function AddTestAutoComplete({ patients, setPatients }) {
  const [autoCompleteTests, setAutoCompleteTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const { actviePatient, setActivePatient, setDialog } = useOutletContext();
  const [loading, setLoading] = useState(false);
  console.log(autoCompleteTests, "auto complete tests");
  const addTestHanlder = async () => {

    if (actviePatient.is_lab_paid) {
      alert('يجب الغاء السداد')
      return;
    }
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
        setActivePatient(data.patient);
        //then update patients
        setPatients((patients) => {
          return patients.map((patient) => {
            if (patient.id === actviePatient.id) {
              return newActivePatient;
            } else {
              return patient;
            }
          });
        });
        console.log(data.patient, "from db");
        console.info(actviePatient, "active p");
      }
    } catch ({
      response: {
        data: { message },
        status,
      },
    }) {
      // console.log(response,'error in adding  test data')
      console.log(message, "error in adding  test data");
      if (status > 400) {
        setLoading(false);
        setDialog((prev) => {
          return { ...prev, msg: message, openError: true, title: "خطا" };
        });
        setLoading(false);
      }
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

export default AddTestAutoComplete;
