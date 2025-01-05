import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import axiosClient from "../../axios-client";
import { useOutletContext } from "react-router-dom";
import { DoctorVisit } from "../types/Patient";
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

interface AutocompleteSearchPatientPros{
  update: (patient: DoctorVisit) => void;
  focusPaitent:(patient:DoctorVisit)=>void;
  labOnlyPatients:boolean;
  setSelectedResult:()=>void;
}

export default function AutocompleteSearchPatient({ update,focusPaitent,labOnlyPatients}:AutocompleteSearchPatientPros) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<DoctorVisit[]>([]);
  const [search, setSearch] = React.useState<string>();

  React.useEffect(() => {
    if (search != '') {
       const timer = setTimeout(() => {
      axiosClient
        .post(`patients?name=${search}`,{
          labOnlyPatients
        })
        .then(({ data }) => {
          console.log(data,'doctor visit data')
          setOptions(data);

        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
    }
   
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
          console.log(newVal)
            update(newVal)
            
            if(focusPaitent){

              focusPaitent(newVal);
            }
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
      getOptionLabel={(option) => option.patient.name}
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
                update(data.data);
                    
                }
                console.log(data, "patients");
              });
            }
          }}
          onChange={(val) => {
            const value = val.target.value
           if ( isNumeric(value)) {
            console.log('inside if')
            return;
           }
            

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
