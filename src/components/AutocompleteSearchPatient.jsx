import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import axiosClient from "../../axios-client";
import { useOutletContext } from "react-router-dom";
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
export default function AutocompleteSearchPatient({ setActivePatientHandler ,withTests =false,setDialog=null,setActivePatient,changeDoctorVisit,change}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [search, setSearch] = React.useState([]);

  React.useEffect(() => {
    if (search != '') {
       const timer = setTimeout(() => {
      axiosClient
        .get(`patients?name=${search}&withTests=${withTests}`)
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
          console.log(newVal, "new Val");
          if (setActivePatientHandler) {
            
            setActivePatientHandler(newVal);
          }
          if(setActivePatient){
            setActivePatient(newVal);
          }
          if (change) {
            console.log(newVal, "change new val");
            // 
            
          }
          if (changeDoctorVisit) {
            axiosClient.get(`doctorvisit/find?pid=${newVal.id}`).then(({data})=>{
             changeDoctorVisit(data)
             change(data.patient)
            })
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
              axiosClient.get(`patients?name=${enteredId}&withTests=${withTests}`).then(({ data }) => {
                if (data.data != null) {
                setActivePatientHandler(data.data);
                    
                }else{
                   if (setDialog) {
                    setDialog((prev)=>{
                      return {
                         ...prev,
                          open: true,
                          message: 'no data found',
                          color: "error"
                      }
                  })
                   }
                }
                console.log(data, "patients");
              });
            }
          }}
          onChange={(val) => {
            const value = val.target.value
            console.log(typeof value, "is val");
            console.log(typeof +value, "is val");
         
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
