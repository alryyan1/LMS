import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
function AddTestAutoComplete({ actviePatient, setActiveDoctorVisit,selectedTests,setSelectedTests,setShowLabTests,setShowTestPanel,isLabPage}) {
  const [autoCompleteTests, setAutoCompleteTests] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(autoCompleteTests, "auto complete tests");
  const addTestHanlder = async () => {

    // if (actviePatient.patient.is_lab_paid) {
    //   alert('يجب الغاء السداد')
    //   return;
    // }
    setLoading(true);
    try {
      const payload = selectedTests.map((test) => test.id);
      const { data: data } = await axiosClient.post(
        `labRequest/add/${actviePatient.id}`,
        { main_test_id: payload }
      );
      if (data.status) {
        if (setShowLabTests ) {
          
          setShowLabTests(true)
        }
        if (setShowTestPanel ) {
          
          setShowTestPanel(false)
        }
        const newActivePatient = data.patient;
        console.log(data,'data')
        setLoading(false);
        newActivePatient.active = true;
        
        if (setActiveDoctorVisit) {
          console.log(newActivePatient)
          setActiveDoctorVisit(newActivePatient);
        }
        
      
      }else{
        setLoading(false);
       
        setLoading(false);
      }

    } catch (error) {
      console.log(error,'message')
      // console.log(response,'error in adding  test data')
      console.log(error, "error in adding  test data");
   
        setLoading(false);
        // setDialog((prev) => {
        //   return { ...prev,open:true, message: error};
        // });
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
                      console.log(enteredId)
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
