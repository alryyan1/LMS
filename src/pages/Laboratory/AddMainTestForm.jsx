import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import Loader from "../../loader";
import axiosClient from "../../../axios-client";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

function AddMainTestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const [loading, setIsLoading] = useState(false);
  const AppData = useOutletContext();
  const addTest = (data) => {
    console.log(data);
    const answer = confirm("A New Test Will Be Added !!");
    if (answer) {
      setIsLoading(true);

      axiosClient
        .post("mainTest", {
          ...data,
          pack_id: data.department.package_id,
          container_id: data.container.id,
        })
        .then(({ data }) => {
          console.log(data.data, "data.data");
          AppData.setActiveTestObj(data.data);
          AppData.setShowAddTest(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Grid container>
      <Grid item xs={4}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <form onSubmit={handleSubmit(addTest)}>
            <Stack direction={"column"} gap={1} className="Test-Details">
              <Typography variant="h6" textAlign={"center"}>
                add new test  
              </Typography>
              <TextField
                error={errors.main_test_name != null}
                label="name "
                {...register("main_test_name", {
                  required: {
                    value: true,
                    message: "field name is required",
                  },

                 
                })}
                helperText={
                  errors.main_test_name && errors.main_test_name.message
                }
              />
              <TextField
                label="price"
                {...register("price", {
                  required: {
                    value: true,
                    message: "price field is required",
                  },
                  pattern: /^[0-9]+$/,
                })}
                error={errors.price != null}
                helperText={errors.price && errors.price.message}
              />
              <Controller
                name="department"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "please select from a department",
                  },
                }}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      onChange={(e, newVal) => {
                        field.onChange(newVal);
                      }}
                      getOptionKey={(op) => op.id}
                      getOptionLabel={(option) => option.package_name}
                      options={AppData.packageData}
                      renderInput={(params) => {
                        // console.log(params)

                        return (
                          <TextField
                            inputRef={field.ref}
                            error={errors.department != null}
                            {...params}
                            helperText={
                              errors?.department && errors.department.message
                            }
                            label="Department"
                          />
                        );
                      }}
                    ></Autocomplete>
                  );
                }}
              />
              <Controller
                name="container"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Container",
                  },
                }}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      onChange={(e, newVal) => {
                        field.onChange(newVal);
                      }}
                      getOptionKey={(op) => op.id}
                      getOptionLabel={(option) => option.container_name}
                      options={AppData.containerData}
                      renderInput={(params) => {
                        // console.log(params)

                        return (
                          <TextField
                            inputRef={field.ref}
                            error={errors.container != null}
                            {...params}
                            label="Container"
                            helperText={
                              errors?.container && errors.container.message
                            }
                          />
                        );
                      }}
                    ></Autocomplete>
                  );
                }}
              />
              <LoadingButton
                variant="contained"
                loading={loading}
                type="submit"
              >
                Save
              </LoadingButton>
            </Stack>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AddMainTestForm;
