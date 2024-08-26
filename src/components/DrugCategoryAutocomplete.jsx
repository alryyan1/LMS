import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import axiosClient from "../../axios-client";
import { useOutletContext } from "react-router-dom";

const filter = createFilterOptions();

export default function DrugCategoryAutocomplete({Controller,control,errors,setValue}) {
  const {t} = useTranslation()
  const {drugCategory,setDrugCategory} = useOutletContext()
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
      .post("drugCategory", { name: dialogValue })
      .then(({ data }) => {
        // console.log(data,'added ship items');
        setDrugCategory((prev) => {
          return [...prev,data];
        });
        setValue('drugCategory', data);
        handleClose();
      })
      .finally(() => setLoading(false));
  };

  return (
    <React.Fragment>
      <Controller
        
        name='drugCategory'
        control={control}
        render = {({field})=>{

          return <Autocomplete
          fullWidth
          value={field.value ?? ''}
          getOptionKey={(op) => op.id}

          size="small"
       
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
              //  setValue(newValue);
                // axiosClient.patch(`addShipItem`,{id:newValue.id})
                return field.onChange(newValue);
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
            options={drugCategory}
            getOptionLabel={(option) => {
              // console.log('option',option)
              // for example value selected with enter, right from the input
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name || "";
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
          
            freeSolo
            renderInput={(params) => (
              <TextField  {...params} label={'المجموعه'} />
            )}
          />
        }}

      />
      
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle>اضافه  مجموعه</DialogTitle>
          <DialogContent>
            <TextField
            size="small"
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue}
              onChange={(event) => setDialogValue(event.target.value)}
              label={t('item')}
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <LoadingButton loading={loading} onClick={handleSubmit} type="submit">
              Add
            </LoadingButton>
          </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
