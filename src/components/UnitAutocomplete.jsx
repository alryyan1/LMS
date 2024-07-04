import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useOutletContext } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../axios-client";
const filter = createFilterOptions();

export default function UnitAutocomplete({ unitObj,child_id }) {
  const { units ,setUnits} = useOutletContext();
  const [value, setValue] = React.useState(unitObj);
  const [open, toggleOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    setDialogValue('');
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState("");

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    axiosClient
      .post("units", { name: dialogValue })
      .then(({ data }) => {
        console.log(data);
        setUnits((prev) => {
          return [...prev, data.data];
        });
        handleClose();
      })
      .finally(() => setLoading(false));
  };

  console.log(unitObj,'child group in autocomplete')
  return (
    <React.Fragment>
      <Autocomplete
      getOptionKey={(option)=>option.id}
      size="small"
       isOptionEqualToValue={(option,val)=> {
        return option.id === val.id
       }}
        value={value}
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
          } else {
            setValue(newValue);
            axiosClient.patch(`child_tests/${child_id}`,{colName:'unit_id' , val: newValue.id})
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
        options={units}
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
          <TextField {...params} label="الوحده" />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle> اضافه عنوان فرعي </DialogTitle>
          <DialogContent>
            <TextField
            size="small"
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue}
              onChange={(event) => setDialogValue(event.target.value)}
              label="العنوان"
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
