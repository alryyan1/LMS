import { LoadingButton } from "@mui/lab";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import {url} from './constants'

function AddTestAutoComplete({ actviePatient, fetchTests ,setOpen,setError }) {
  const [autoCompleteTests, setAutoCompleteTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [loading,setLoading] = useState(false)
  const addTestHanlder = async () => {
    setLoading(true)
    const data = selectedTests.map((test) => test.id);
    
    const response = await fetch(
      `${url}labRequest/add/${actviePatient.id}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({"main_test_id":data}),
      }
    );
   
    const data2 = await response.json();
    if (response.status > 400) {
      setOpen(true)
      setError(data2.message)
      setLoading(false)
      throw new Error(data2.message)
    }
    if (data2.status) {
      fetchTests();
    }
    setLoading(false)
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
          <LoadingButton loading={loading} onClick={addTestHanlder} variant="contained">
            +
          </LoadingButton>
        </div>
      )}{" "}
    </div>
  );
}

export default AddTestAutoComplete;
