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
import { Controller } from "react-hook-form";

const filter = createFilterOptions();

export default function CountryAutocomplete( {control,errors,setValue} ) {
  const [countries, setCountries] = React.useState([]);
  // const [value, setValue] = React.useState();
  const [open, toggleOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    axiosClient.get("country").then(({ data }) => {
      setCountries(data);
    });
  }, []);
  const handleClose = () => {
    setDialogValue("");
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState("");

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    axiosClient
      .post("country", { name: dialogValue })
      .then(({ data }) => {
        console.log(data);
        setCountries((prev) => {
          return [...prev, data.data];
        });
        setValue('country', data.data);
        handleClose();
      })
      .finally(() => setLoading(false));
  };

  return (
    <React.Fragment>
      <Controller
        rules={{
          required: {
            value: true,
            message: "country must be provided",
          },
        }}
        name="country"
        control={control}
        render={({ field }) => {
          return (
            <Autocomplete
            
              size="small"
              isOptionEqualToValue={(option, val) => {
                return option.id === val.id;
              }}
              value={field.value ?? ""}
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
                }else{
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
              options={countries}
              getOptionLabel={(option) => {
                console.log("option", option);
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
              renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
              )}
              freeSolo
              renderInput={(params) => <TextField variant="filled" error={errors.country && errors.country.message} {...params} label="الدوله" />}
            />
          );
        }}
      ></Controller>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle> اضافه دوله </DialogTitle>
          <DialogContent>
            <TextField
              size="small"
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue}
              onChange={(event) => setDialogValue(event.target.value)}
              label="اسم الدوله"
              type="text"
              variant="filled"
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
