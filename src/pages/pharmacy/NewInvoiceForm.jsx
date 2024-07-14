import {
  Autocomplete,
  Grid,
  Paper,
  Typography,
  TextField,
  Stack,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axiosClient from "../../../axios-client";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";
import {t} from "i18next"
function NewInvoiceForm({
  hideNewFormHandler,
  suppliers,
  setDialog,
  setUpdate,
}) {
  const [loading, setLoading] = useState(false);

  const newInvoiceHandler = (formData) => {
    setLoading(true);
    const dayJsObj = formData.bill_date;
    axiosClient
      .post(`inventory/deposit/newDeposit`, {
        bill_date: `${dayJsObj.format("YYYY/MM/DD")}`,
        bill_number: formData.bill_number,
        supplier_id: formData.supplier.id,
      })
      .then((data) => {
        if (data.status) {
          hideNewFormHandler();
          setLoading(false);
          setUpdate((prev) => prev + 1);
          setDialog({
            open: true,
            message: "Added successfully",
          });
        }
        console.log(data, "deposit complete");
      })
      .catch(({ response: { data } }) => {
        console.log(data);
        setLoading(false);
        setDialog({
          color: "error",
          open: true,
          message: data.message,
        });
      });
  };
  const {
    register: register2,
    control: control2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm();
  return (
    <Box>
      <form
        style={{ margin: "5px" }}
        noValidate
        onSubmit={handleSubmit2(newInvoiceHandler)}
      >
        <Typography variant="h5" align="center">
          {t('income')}
        </Typography>

        <Stack direction={"column"} gap={2}>
          <Controller
            name="supplier"
            rules={{
              required: {
                value: true,
                message: t('supplierValidation'),
              },
            }}
            control={control2}
            render={({ field }) => {
              return (
                <Autocomplete
                  fullWidth
                  isOptionEqualToValue={(option, val) => option.id === val.id}
                  sx={{ mb: 1 }}
                  {...field}
                  value={field.value || null}
                  options={suppliers}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, data) => field.onChange(data)}
                  renderInput={(params) => {
                    return (
                      <TextField
                        error={errors2.supplier != null}
                        helperText={
                          errors2.supplier && errors2.supplier.message
                        }
                        label={t("supplier") }
                        {...params}
                      />
                    );
                  }}
                ></Autocomplete>
              );
            }}
          />
          {errors2.supplier && errors2.supplier.message}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              defaultValue={dayjs(new Date())}
              rules={{
                required: {
                  value: true,
                  message: t('dateValidation'),
                },
              }}
              control={control2}
              name="bill_date"
              render={({ field }) => (
                <DateField
                  fullWidth
                  {...field}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  sx={{ mb: 1 }}
                  label={t('invoiceDate')}
                />
              )}
            />
          </LocalizationProvider>
          <TextField
            fullWidth
            error={errors2.bill_number != null}
            sx={{ mb: 1 }}
            helperText={errors2.bill_number && errors2.bill_number.message}
            variant="filled"
            {...register2("bill_number", {
              required: {
                value: true,
                message: t('billNumberValidation'),
              },
            })}
            label={t('billNumber')}
          ></TextField>

          <LoadingButton
            type="submit"
            loading={loading}
            sx={{ mt: 1 }}
            color="success"
            variant="contained"
            fullWidth
          >
             {t('save')}
          </LoadingButton>
        </Stack>
      </form>
    </Box>
  );
}

export default NewInvoiceForm;
