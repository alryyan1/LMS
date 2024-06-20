import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import axiosClient from "../../axios-client";
import { useOutletContext } from "react-router-dom";

export default function AutocompleteSearchPatient({ setActivePatientHandler }) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [search, setSearch] = React.useState([]);
  const {setDialog} =  useOutletContext()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      axiosClient
        .get(`patients?name=${search}`)
        .then(({ data }) => {
          setOptions(data);
          console.log(data, "patients");
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Autocomplete size="small"
      getOptionKey={(op) => op.id}
      id="asynchronous-demo"
      onChange={(_, newVal) => {
        if (typeof newVal === "number") {
            console.log('type of val is number')
            return
        }
        if (newVal) {
          console.log(newVal, "new Val");

          setActivePatientHandler(newVal);
        }
      }}
      sx={{ width: 300, display: "inline-block" }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("enter pressed");
              //get test from tests using find
              const enteredId = e.target.value;
              axiosClient.get(`patients?name=${enteredId}`).then(({ data }) => {
                if (data.data != null) {
                setActivePatientHandler(data.data);
                    
                }else{
                    setDialog((prev)=>{
                        return {
                           ...prev,
                            open: true,
                            message: 'no data found',
                            color: "error"
                        }
                    })
                }
                console.log(data, "patients");
              });
            }
          }}
          onChange={(val) => {
            const value = val.target.value
            if (typeof +value == "number") return;
            console.log(typeof val.target.value, "is val");
            setSearch(val.target.value);
          }}
          {...params}
          label="بحث"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
