import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../axios-client";

const filter = createFilterOptions();

export default function AutocompleteResultOptions({ setSelectedResult, child_test,id ,result,req,setActivePatient,setPatients,index}) {
  
    // console.log('inside table option result rebuilt with result',result)
  const [value, setValue] = React.useState(result);
  const [open, toggleOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [options,setOptions] = React.useState([])
  React.useEffect(()=>{
    axiosClient
     .get(`childTestOption/${child_test.id}`)
     .then(({ data }) => {
        setOptions(data);
      })
     .catch((err) => {
        console.log(err);
      });
  },[])

  const handleClose = () => {
    setDialogValue('');
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState("");

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    axiosClient
      .post(`childTestOption/${child_test.id}`, { name: dialogValue })
      .then(({ data }) => {
        console.log(data,'options data');
        if (data.status) {
            setOptions(data.options)
        }
        handleClose();
      })
      .finally(() => setLoading(false));
  };

//   console.log('child group in autocomplete')
  return (
    <React.Fragment>
      <Autocomplete
      
     sx={{
        "& .MuiOutlinedInput-root": {
          padding: "0px!important",
        },
      }}
      size="small"
       isOptionEqualToValue={(option,val)=> {
        return option.id === val.id
       }}
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            setValue(newValue);
            console.log('val 1' ,newValue)

            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue(newValue);
            });
          } else if (newValue && newValue.inputValue) {
            console.log('val 2' ,newValue)

            toggleOpen(true);
            setDialogValue(newValue.inputValue);
          } else {
            setValue(newValue);
            // console.log(first)
            axiosClient.patch(`requestedResult/${id}`,{val:newValue?.name ?? ''}).then(({data})=>{
                console.log(data)
            })
           // axiosClient.patch(`editChildTestGroup/${child_id}`,{id:newValue.id})
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        options={options}
        getOptionLabel={(option) => {
        //   console.log('option',option)
          // for example value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
      
        freeSolo
        renderInput={(params) => (
          <TextField
          autoFocus={index == 0}
          onClick={()=>{
            setSelectedResult(req)
          }} multiline {...params} onChange={(val)=>{
            console.log(val.target.value,'target value')

            setValue(val.target.value)
            axiosClient.patch(`requestedResult/${id}`,{val:val.target.value}).then(({data})=>{
                setActivePatient(data.patient)
                setPatients((prev)=>{
                    return  prev.map((patient)=>{
                        if(patient.id === data.patient.id){
                            return{ ...data.patient, active: true }
                        }
                        return patient
                    })
                })

                console.log(data,'result saved')
            })
          }} label="" />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle> add test option   </DialogTitle>
          <DialogContent>
            <TextField
            size="small"
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue}
              onChange={(event) => setDialogValue(event.target.value)}
              label="option name"
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <LoadingButton loading={loading} type="submit">
              Add
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
