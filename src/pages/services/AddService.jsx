import {
  Autocomplete,
  Button,
  Card,
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

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyLoadingButton from "../../components/MyLoadingButton";
import { useOutletContext } from "react-router-dom";
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell";

function AddService() {
  const [selectedService , setSelectedService] = useState(null)
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [services, setservices] = useState([]);
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(5);
  const { dialog, setDialog, serviceGroups } = useOutletContext();
   const {register:register2,handleSubmit:handleSubmit2,formState:{errors:errors2}} = useForm()
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
  
  const removeServiceCost = (id)=>{
    setLoading(true);

    axiosClient.delete(`removeServiceCost/${id}`).then(({data})=>{
      console.log(data)
      if (data.status) {
        setSelectedService(data.service)
        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            color: "success",
            msg: "Addition was successfull",
          };
        });
        reset();
      }
    }).finally(() => setLoading(false));
  }
  const addServiceCostHandler = (data)=>{
    console.log(data)
    setLoading(true);

    axiosClient.post(`addServiceCost/${selectedService.id}`,{...data,service_id:selectedService.id}).then(({data})=>{
      console.log(data)
      if (data.status) {
        setSelectedService(data.service)
        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            color: "success",
            msg: "Addition was successfull",
          };
        });
        reset();
      }
    }).finally(() => setLoading(false));
  }
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
              msg: "Addition was successfull",
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
    control,
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
    document.title = "الخدمات";
  }, []);
  return (
    <Grid container  gap={3}>
      {loading ? (
        <Skeleton height={400} ></Skeleton>
      ) : (
        <Grid item xs={6}  >
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
                value={search}
                onChange={(e) => {
                  searchHandler(e.target.value);
                }}
                label="Search"
              ></TextField>
            </Stack>

            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Cost </TableCell>
                  <TableCell>Dlt</TableCell>
                </TableRow>
              </thead>
              <TableBody>
                {services.map((item) => (
                  <TableRow sx={{background:(theme)=>selectedService?.id == item.id ? theme.palette.warning.light :''}} key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <MyTableCell table="service" colName={"name"} item={item}>
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
                      <Button onClick={()=>{
                        setSelectedService(item)
                      }}>Select</Button>
                    </TableCell>

                    <TableCell>
                      <MyLoadingButton
                        onClick={() => {
                          const result = confirm(" \n سيتم حذف العمليات الماليه المتلقه بالخدمه-- هل انت متاكد من حذف الخدمه");
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
                                      msg: "Delete was successfull",
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
                        Delete
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
      <Grid item xs={3} >
        <Stack direction={"row"} justifyContent={"center"} spacing={4}>
          <Typography variant="h3" fontFamily={"Tajwal-Regular"}>
            Add medical Service
          </Typography>
        </Stack>
        <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
          <Stack direction={"column"} gap={3}>
            <TextField
              fullWidth
              error={errors.name != null}
              {...register("name", {
                required: { value: true, message: "field is required" },
              })}
              id="outlined-basic"
              label="Name "
              variant="filled"
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              type="number"
              error={errors.price != null}
              {...register("price", {
                required: { value: true, message: "the field is required" },
              })}
              id="outlined-basic"
              label="Price"
              variant="filled"
              helperText={errors.price?.message}
            />

            <Controller
              control={control}
              name="service_group_id"
              rules={{
                required: {
                  value: true,
                  message: "field is required",
                },
              }}
              render={({ field }) => {
                return (
                  <Autocomplete
                    {...field}
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
                          label="Section"
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
              Save
            </LoadingButton>
          </Stack>
        </form>
      </Grid>
    {selectedService &&   <Card sx={{p:1}}>
        <h5>Service Cost </h5>
        <form onSubmit={handleSubmit2(addServiceCostHandler)}>
          <Stack direction={"column"} gap={2}>
            <TextField variant="standard"   label='وصف المصروف' {...register2('name')}/>
            <TextField  variant="standard" label='النسبه' {...register2('percentage')}/>
            <TextField variant="standard"  label='مبلغ' {...register2('fixed')}/>
            <LoadingButton type="submit">حفظ</LoadingButton>
          </Stack>
        </form>
      </Card>}
      <Grid>
      {selectedService && <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell> الوصف</TableCell>
              <TableCell>النسبة</TableCell>
              <TableCell>المبلغ</TableCell>
              <TableCell>حذف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedService?.service_costs.map((cost) => (
              <TableRow key={cost.id}>
                <TableCell>{cost.name}</TableCell>
                <TableCell>{cost.percentage}%</TableCell>
                <TableCell>{cost.fixed}</TableCell>
                <TableCell>
                  <Button onClick={() => removeServiceCost(cost.id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>}
      </Grid>
    </Grid>
  );
}

export default AddService;
