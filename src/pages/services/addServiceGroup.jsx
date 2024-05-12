import {
  Autocomplete,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import { useOutletContext } from "react-router-dom";

function AddServiceGroup() {
  const [loading, setLoading] = useState(false);
  const { dialog, setDialog, serviceGroups, setUpdateServiceGroup } =
    useOutletContext();
  //create state variable to store all Items
  const submitHandler = (data) => {
    setLoading(true);

    console.log(data, "submitted data");
    axiosClient
      .post("serviceGroup/create", data)
      .then((data) => {
        if (data.status) {
          setUpdateServiceGroup((pre) => pre + 1);
          setDialog((prev) => {
            return {
              ...prev,
              open: true,
              color: "success",
              msg: "تمت الاضافه بنجاح",
            };
          });
          reset();
        }
      })
      .finally(() => setLoading(false));
  };

  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);

  return (
    <Stack direction={"row"} gap={3}>
      <TableContainer sx={{ mb: 1 }}>
      <Typography variant="h5" textAlign={'center'} fontFamily={"Tajwal-Regular"}>
        الاقسام
      </Typography>
        <Table dir="rtl" size="small">
          <thead>
            <TableRow>
              <TableCell>رقم</TableCell>
              <TableCell>الاسم</TableCell>
            </TableRow>
          </thead>
          <TableBody>
            {serviceGroups.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <MyTableCell table="serviceGroup" colName={"name"} item={item}>
                  {item.name}
                </MyTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    
      <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
      <Typography variant="h5" fontFamily={"Tajwal-Regular"}>
          اضافه قسم جديد
        </Typography>
        <Stack direction={"column"} gap={3}>
          <TextField
            fullWidth
            error={errors.name != null}
            {...register("name", {
              required: { value: true, message: "يجب ادخال اسم القسم" },
            })}
            id="outlined-basic"
            label="اسم القسم"
            variant="filled"
            helperText={errors.name?.message}
          />

          <LoadingButton
            fullWidth
            loading={loading}
            variant="contained"
            type="submit"
          >
            حفظ
          </LoadingButton>
        </Stack>
      </form>
    </Stack>
  );
}

export default AddServiceGroup;
