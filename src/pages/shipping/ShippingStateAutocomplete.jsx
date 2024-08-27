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

export default function ShippingStateAutocomplete({ shipSate,shippingId ,shippingStates}) {
    console.log(shippingStates,'shippingStates');
  const {setDialog} =  useOutletContext()
  const [ states ,setStates] = React.useState(shippingStates);
  const [value, setValue] = React.useState(shipSate);
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
      .post("addShippingState", { name: dialogValue })
      .then(({ data }) => {
        console.log(data);
        setStates((prev) => {
          return [...prev, data.state];
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
            if (newValue !=null) {
                axiosClient.patch(`deduct/${shippingId}`,{val:newValue.id,'colName':'shipping_state_id'}).then(({data}) => {
                    if (data.status) {
                        setDialog((prev)=>{
                            return {
                               ...prev,
                                open: true,
                                message: "تم التعديل بنجاح",
                            }
                        })
                    }
                })
            }
           
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
          <TextField {...params} label="الحاله" />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle> اضافه حاله جديده  </DialogTitle>
          <DialogContent>
            <TextField
            size="small"
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue}
              onChange={(event) => setDialogValue(event.target.value)}
              label="اسم الحاله"
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
