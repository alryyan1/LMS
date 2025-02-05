import { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Item } from "../constants";
import { DoctorVisit } from "../../types/Patient";
import { useTranslation } from "react-i18next";

interface EditDialog {
  openEdit: boolean;
  setDialog: (open: boolean) => void;
  patient: DoctorVisit;
  doctorVisitId: number;
  isLab?: boolean;
  update: (paitent: DoctorVisit) => void;
}
function EditPatientDialog({
  patient ,
  doctorVisitId,
  isLab = false,
  setDialog,
  update,
}: EditDialog) {
  const {
    doctors,
    setActivePatient,
    setUpdate,
    openedDoctors,
    setOpenEdit,
    openEdit,
  } = useOutletContext();
  const {t}=  useTranslation('editDialog')
  console.log(patient, "patient to be edited");
  // console.log(appData.doctors, "doctors");
  console.log(openedDoctors, "open doctors");
  const [loading, setLoading] = useState();
  function editDoctorHandler(formData) {
    setLoading(true);
    const url = `patients/edit/${doctorVisitId}`;
    console.log(formData, "formData");
    axiosClient
      .patch(url, {
        ...formData,
        company_relation_id: formData?.company_relation_id?.id,
        subcompany_id: formData?.subcompany_id?.id,
        doctor_id: formData.doctor?.id,
      })
      .then(({ data }) => {
        console.log(data, "edited data");
        if (data.status) {
          setOpenEdit(false);

          update(data.data);
        }
      })
      .catch(({ response: { data } }) => {
        setDialog((prev) => {
          return { ...prev, open: true, message: data.message, color: "error" };
        });
      })
      .finally(() => setLoading(false));
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      name: patient.patient.name,
      phone: patient.patient.phone,
      gender: patient.patient.gender,
      age_day: patient.patient.age_day,
      age_month: patient.patient.age_month,
      age_year: patient.patient.age_year,
      insurance_no: patient.patient.insurance_no,
      doctor: patient.patient.doctor,
      // company: patient.patient.company,
      guarantor: patient.patient.guarantor,
      company_relation_id: patient.patient.relation,
      subcompany_id: patient.patient.subcompany,
      address: patient.patient.address,
      gov_id: patient.patient.gov_id,
    },
  });
  return (
    <Dialog key={patient.id} open={openEdit}>
      <DialogTitle>{t("edit_data")}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(editDoctorHandler)}>
          <Stack
            // divider={<Divider orientation="horizontal" flexItem />}
            direction={"column"}
            gap={2}
            sx={{ p: 1 }}
          >
            <TextField
              {...register("name", {
                required: { value: true, message: t("name_required") },
              })}
              defaultValue={patient.patient.name}
              error={errors.name != null}
              variant="outlined"
              label={t("name")}
            ></TextField>
            <Stack direction={"row"} gap={5} justifyContent={"space-around"}>
              <TextField
                fullWidth
                {...register("phone", {
                  required: {
                    value: true,
                    message: t("phone_required"),
                    //phone validation
                    validator: (value) => {
                      if (value.length == 10) {
                        return true;
                      }
                      return false;
                    },
                  },
                })}
                defaultValue={patient.patient.phone}
                error={errors.phone != null}
                variant="outlined"
                label={t("phone")}
              ></TextField>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      fullWidth
                      onChange={(data) => {
                        console.log(data.target.value);
                        return field.onChange(data.target.value);
                      }}
                      label={t("gender")}
                    >
                      <MenuItem value={"ذكر"}>{t("male")}</MenuItem>
                      <MenuItem value={"اثني"}>{t("female")}</MenuItem>
                      <MenuItem value=""></MenuItem>
                    </Select>
                  );
                }}
              />
            </Stack>
            {isLab && (
              <Controller
                name="doctor"
                control={control}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      isOptionEqualToValue={(option, val) =>
                        option.id === val.id
                      }
                      onChange={(e, newVal) => field.onChange(newVal)}
                      getOptionKey={(op) => op.id}
                      getOptionLabel={(option) => option.name}
                      options={doctors}
                      value={field.value}
                      renderInput={(params) => {
                        return (
                          <TextField
                            inputRef={field.ref}
                            error={errors?.doctor}
                            {...params}
                            label={t("doctor")}
                          />
                        );
                      }}
                    ></Autocomplete>
                  );
                }}
              />
            )}
            <Stack
              direction={"row"}
              gap={4}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Item>
                <TextField
                  defaultValue={patient.patient.age_year}
                  error={errors?.age_year}
                  {...register("age_year", {
                    required: {
                      value: true,
                      message: t("age_year_required"),
                    },
                  })}
                  label={t("ageInYear")}
                  type="number"
                  variant="standard"
                />
              </Item>
              <Item>
                <TextField
                  type="number"
                  defaultValue={patient.patient.age_month}
                  {...register("age_month")}
                  label={t("ageInMonth")}
                  variant="standard"
                />
              </Item>
              <Item>
                <TextField
                  type="number"
                  defaultValue={patient.patient.age_day}
                  {...register("age_day")}
                  label={t("ageInDays")}
                  variant="standard"
                />
              </Item>
            </Stack>
            <Stack direction={"row"} gap={2}>
              <TextField
                defaultValue={patient.patient.address}
                fullWidth
                {...register("address")}
                label={t("address")}
                variant="outlined"
              />
              <TextField
                defaultValue={patient.patient.gov_id}
                fullWidth
                {...register("gov_id")}
                label={t("govId")}
                variant="outlined"
              />
            </Stack>
            {patient.patient.company_id && <Divider>{t("insurance")}</Divider>}
            {patient.patient.company_id && (
              <Stack direction={"column"} spacing={1}>
                <Stack direction={"row"} gap={2}>
                  <TextField
                    fullWidth
                    {...register("insurance_no")}
                    label={t("insurance_no")}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    {...register("guarantor")}
                    label={t("guarantor")}
                    variant="outlined"
                  />
                </Stack>

                <Stack direction={"row"} gap={2}>
                  <Controller
                    name="subcompany_id"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Autocomplete
                          fullWidth
                          value={patient.patient.subcompany}
                          isOptionEqualToValue={(opt, val) => opt.id === val.id}
                          getOptionKey={(op) => op.id}
                          {...field}
                          getOptionLabel={(op) => op.name}
                          options={patient.patient.company.sub_companies}
                          onChange={(_, val) => {
                            field.onChange(val);
                          }}
                          renderInput={(params) => {
                            return (
                              <TextField
                                label={t("subcompany")}
                                error={
                                  errors.subcompany_id &&
                                  errors.subcompany_id.message
                                }
                                {...params}
                              />
                            );
                          }}
                        />
                      );
                    }}
                  />

                  <Controller
                    name="company_relation_id"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Autocomplete
                          disabled={patient.patient?.labrequests.length > 0}
                          {...field}
                          value={field.value}
                          fullWidth
                          isOptionEqualToValue={(opt, val) => opt.id === val.id}
                          getOptionKey={(op) => op.id}
                          getOptionLabel={(op) => op.name}
                          options={patient.patient.company.relations}
                          onChange={(_, val) => {
                            field.onChange(val);
                          }}
                          renderInput={(params) => {
                            return <TextField label={t("relation")} {...params} />;
                          }}
                        />
                      );
                    }}
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
          <LoadingButton
            sx={{ m: 1 }}
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
          >
            {t("save_changes")}
          </LoadingButton>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            setOpenEdit(false);
          }}
        >
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPatientDialog;