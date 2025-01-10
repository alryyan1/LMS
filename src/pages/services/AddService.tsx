import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyLoadingButton from "../../components/MyLoadingButton";
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell";
import EmptyDialog from "../Dialogs/EmptyDialog";
import MyServiceCostTableCell from "../inventory/SelectCostType";
import { Service } from "../../types/type";

function AddService() {
    const { t } = useTranslation('addService');
  const [selectedService, setSelectedService] = useState<Service|null>(null);
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showServiceCostDialog, setShowServiceCostDialog] = useState(false);
  const [services, setservices] = useState<Service[]>([]);
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(50);
  const [updated, setUpdated] = useState(0);
  const [serviceGroups, setServiceGroups] = useState([]);
  useEffect(() => {
    axiosClient.get("serviceGroup/all").then(({ data }) => {
      console.log(data, "service groups");
      setServiceGroups(data);
    });
  }, []);
  useEffect(() => {
    setservices((prev)=>{
      return prev.map((s)=>{
        if(s.id === selectedService?.id){
          return selectedService
        }
        return s
      })
    })
  }, [selectedService]);
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm();
  const searchHandler = (word) => {
    setSearch(word);
    axiosClient
      .get(`service/all/pagination/${page}?word=${word}`)
      .then(({ data: { data, links } }) => {
        console.log(data);
        console.log(links);
        setservices(data);
        // console.log(links)
        setLinks(links);
      });
  };
  const updateItemsTable = (link, setLoading) => {
    console.log(search);
    setLoading(true);
    fetch(link.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: search ? JSON.stringify({ word: search }) : null,
    })
      .then((res) => {
        return res.json();
      })
      .then(({ data, links }) => {
        console.log(data, links);
        setservices(data);
        setLinks(links);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const removeServiceCost = (id) => {
    setLoading(true);

    axiosClient
      .delete(`removeServiceCost/${id}`)
      .then(({ data }) => {
        console.log(data);
        if (data.status) {
          setSelectedService(data.service);

          reset();
        }
      })
      .finally(() => setLoading(false));
  };
  const addServiceCostHandler = (data) => {
    console.log(data);
    setLoading(true);

    axiosClient
      .post(`addServiceCost/${selectedService?.id}`, {
        ...data,
        service_id: selectedService?.id,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.status) {
          setSelectedService(data.service);

          reset();
        }
      })
      .finally(() => setLoading(false));
  };
  //create state variable to store all Items
  const submitHandler = (data) => {
    setLoading(true);

    console.log(data, "submitted data");
    axiosClient
      .post("service/create", {
        ...data,
        service_group_id: data.service_group_id.id,
      })
      .then((data) => {
        if (data.status) {
          setDialog((prev) => {
            return {
              ...prev,
              open: true,
              color: "success",
              msg: t("additionSuccess"),
            };
          });
          reset();
          setValue("service_group_id", null);
          setUpdated((prev) => prev + 1);
        }
      })
      .finally(() => setLoading(false));
  };
  const {
    register,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);
  useEffect(() => {
    setLoading(true);

    console.log("start of use effect");
    //fetch all Items
    axiosClient
      .get(`service/all/pagination/${page}`)
      .then(({ data: { data, links } }) => {
        console.log(data, "services");
        console.log(links);
        setservices(data);
        console.log(links);
        setLinks(links);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [page, isSubmitting]);
  useEffect(() => {
    document.title = t("services");
  }, []);
  return (
    <Grid container gap={1}>
      {loading ? (
        <Skeleton width={"100%"} height={400}></Skeleton>
      ) : (
        <Grid item xs={8}>
          <TableContainer sx={{ mb: 1 }}>
            <Stack
              sx={{ mb: 1 }}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <select
                onChange={(val) => {
                  setPage(val.target.value);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <TextField
                size="small"
                defaultValue={search}
                onChange={(e) => {
                  searchHandler(e.target.value);
                }}
                label={t("search")}
              ></TextField>
            </Stack>

            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{t("name")}</TableCell>
                  <TableCell>{t("price")}</TableCell>
                  <TableCell>{t("category")}</TableCell>
                  <TableCell>{t("cost")}</TableCell>
                  <TableCell>{t("delete")}</TableCell>
                </TableRow>
              </thead>
              <TableBody>
                {services.map((item) => (
                  <TableRow
                    sx={{
                      background: (theme) =>
                        selectedService?.id == item.id
                          ? theme.palette.warning.light
                          : "",
                    }}
                    key={item.id}
                  >
                    <TableCell>{item.id}</TableCell>
                    <MyTableCell table="service"  colName={"name"} item={item}>
                      {item.name}
                    </MyTableCell>
                    <MyTableCell

                      show
                      table="service"
                      colName={"price"}
                      item={item}
                    >
                      {item.price}
                    </MyTableCell>

                    <MyAutoCompeleteTableCell
                      table="service"
                      val={item.service_group}
                      item={item}
                      colName={"service_group_id"}
                      sections={serviceGroups}
                    >
                      {item.service_group}
                    </MyAutoCompeleteTableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          console.log(item,'req service')
                          setSelectedService(item);
                          setShowServiceCostDialog(true);
                        }}
                      >
                        {t("select")}
                      </Button>
                    </TableCell>

                    <TableCell>
                      <MyLoadingButton
                        onClick={() => {
                          const result = confirm(
                            t("deleteServiceConfirmation")
                          );
                          if (result) {
                            axiosClient
                              .delete(`service/${item.id}`)
                              .then((data) => {
                                if (data.status) {
                                  setDialog((prev) => {
                                    return {
                                      ...prev,
                                      open: true,
                                      color: "success",
                                      msg: t("deleteSuccess"),
                                    };
                                  });
                                  setservices((prev) =>
                                    prev.filter((ser) => ser.id != item.id)
                                  );
                                }
                              });
                          }
                        }}
                      >
                         {t("delete")}
                      </MyLoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid sx={{ gap: "4px" }} container>
            {links.map((link, i) => {
              if (i == 0) {
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      onClick={(setLoading) => {
                        updateItemsTable(link, setLoading);
                      }}
                      variant="contained"
                      key={i}
                    >
                      <ArrowBack />
                    </MyLoadingButton>
                  </Grid>
                );
              } else if (links.length - 1 == i) {
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      onClick={(setLoading) => {
                        updateItemsTable(link, setLoading);
                      }}
                      variant="contained"
                      key={i}
                    >
                      <ArrowForward />
                    </MyLoadingButton>
                  </Grid>
                );
              } else
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      active={link.active}
                      onClick={(setLoading) => {
                        updateItemsTable(link, setLoading);
                      }}
                    >
                      {link.label}
                    </MyLoadingButton>
                  </Grid>
                );
            })}
          </Grid>
        </Grid>
      )}
      <Grid item xs={3}>
        <Stack direction={"row"} justifyContent={"center"} spacing={4}>
          <Typography variant="h4" fontFamily={"Tajwal-Regular"}>
            {t("newService")}
          </Typography>
        </Stack>
        <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
          <Stack direction={"column"} gap={3}>
            <TextField
              fullWidth
              error={errors.name != null}
              {...register("name", {
                required: { value: true, message: t("fieldRequired") },
              })}
              id="outlined-basic"
              label={t("name")}
              variant="filled"
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              type="number"
              error={errors.price != null}
              {...register("price", {
                required: { value: true, message: t("fieldRequired") },
              })}
              id="outlined-basic"
              label={t("price")}
              variant="filled"
              helperText={errors.price?.message}
            />

            <Controller
              control={control}
              name="service_group_id"
              rules={{
                required: {
                  value: true,
                  message: t("fieldRequired"),
                },
              }}
              render={({ field }) => {
                return (
                  <Autocomplete
                    key={updated}
                    {...field}
                    getOptionKey={(op) => op.id}
                    options={serviceGroups}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, newVal) => field.onChange(newVal)}
                    renderInput={(params) => {
                      return (
                        <TextField
                          error={errors.service_group_id != null}
                          helperText={
                            errors.service_group_id &&
                            errors.service_group_id.message
                          }
                          {...params}
                          label={t("section")}
                          variant="filled"
                        />
                      );
                    }}
                  />
                );
              }}
            />

            <LoadingButton
              fullWidth
              loading={loading}
              variant="contained"
              type="submit"
            >
              {t("save")}
            </LoadingButton>
          </Stack>
        </form>
      </Grid>
      <EmptyDialog setShow={setShowServiceCostDialog} show={showServiceCostDialog}>
        <Stack direction={"row"} gap={1}>
        
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("description")}</TableCell>
                <TableCell>{t("percentage")}</TableCell>
                <TableCell>{t("amount")}</TableCell>
                <TableCell>{t("type")}</TableCell>
                <TableCell>{t("order")}</TableCell>
                <TableCell>{t("delete")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedService?.service_costs.map((cost) => (
                <TableRow key={cost.id}>
                  <TableCell>{cost.name}</TableCell>
                  <TableCell>{cost.percentage}%</TableCell>
                  <TableCell>{cost.fixed}</TableCell>
                  <MyServiceCostTableCell   update={setSelectedService} colName={'cost_type'} item={cost} myVal={cost.cost_type} table="updateServiceCost"/>
                  <TableCell>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t("name")}</TableCell>
                          <TableCell>{t("check")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cost.cost_type == 'after cost' && selectedService.service_costs.filter((c)=>c.id !=cost.id).map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell><Checkbox defaultChecked={
                              cost.cost_orders.map((co)=>co.service_cost_item ).includes(item.id)
                            } onChange={(e)=>{
                              axiosClient.post(`addCostOrder`,{
                                service_id:selectedService.id,
                                service_cost_id:cost.id,
                                service_cost_item:item.id,
                                add:e.target.checked? 1 : 0
                              })
                            }} /></TableCell>
                          
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => removeServiceCost(cost.id)}>
                      {t("delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Card sx={{ p: 1 ,width:'300px'}}>
            <Typography textAlign={'center'} variant="h5">{t("serviceExpenses")}</Typography>
            <form onSubmit={handleSubmit2(addServiceCostHandler)}>
              <Stack direction={"column"} gap={2}>
                <TextField
                  variant="standard"
                  label={t("expenseDescription")}
                  {...register2("name")}
                />
                <TextField
                  variant="standard"
                  label={t("percentage")}
                  {...register2("percentage")}
                />
                <TextField
                  variant="standard"
                  label={t("amount")}
                  {...register2("fixed")}
                />
                <LoadingButton type="submit">{t("save")}</LoadingButton>
              </Stack>
            </form>
          </Card>
        </Stack>
      </EmptyDialog>
    </Grid>
  );
}

export default AddService;