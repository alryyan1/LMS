import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const filter = createFilterOptions();

export default function ContractStateAutocomplete( ) {
  const { states ,setStates} = useOutletContext([]);
  const [open, toggleOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(()=>{
    axiosClient.get('contractStates').then(({data})=>{
        setStates(data)
        console.log(data)
    })
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
      .post("contractStates", { name: dialogValue })
      .then(({ data }) => {
        console.log(data);
        setStates((prev) => {
          return [...prev, data.data];
        });
        handleClose();
      })
      .finally(() => setLoading(false));
  };

  return (
    <React.Fragment>
      <Autocomplete
      
      size="small"
       isOptionEqualToValue={(option,val)=> {
        return option.id === val.id
       }}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue(newValue);
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue(newValue.inputValue);
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
        options={states}
        getOptionLabel={(option) => {
          console.log('option',option)
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
          <TextField {...params} label="state" />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>  Add State </DialogTitle>
          <DialogContent>
            <TextField
            size="small"
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue}
              onChange={(event) => setDialogValue(event.target.value)}
              label="state"
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
