import {
  Alert,
  Autocomplete,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { url } from "../constants.js";
import { useForm, Controller } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { useLoaderData, useOutletContext } from "react-router-dom";
import MyTableCell from "./MyTableCell.jsx";
import MyAutoCompeleteTableCell from "./MyAutoCompeleteTableCell.jsx";
import axiosClient from "../../../axios-client.js";
import MyLoadingButton from "../../components/MyLoadingButton.jsx";

function Item() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(9);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [links, setLinks] = useState([]);
  const sections = useLoaderData();
  //create state variable to store all Items
  const [Items, setItems] = useState([]);
  const { dialog, setDialog } = useOutletContext();

  const {
    register,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
    control,
    reset,
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);
  const submitHandler = async (formData) => {
    console.log(formData, "formdata");
    setLoading(true);
    axiosClient
      .post(`items/create`, {
        name: formData.name,
        section: formData.section.id,
        require_amount: formData.require_amount,
        initial_balance: formData.initial_balance,
        initial_price: formData.initial_price,
        tests: formData.tests,
        unit: formData.unit,
      })
      .then(({ data }) => {
        if (data.status) {
          reset();
          setValue("section", null);
          setLoading(false);
          //show snackbar
          setDialog({
            color: "success",
            open: true,
            message: "تمت الاضافه بنجاح",
          });
        }
      })
      .catch(({ response: { data } }) => {
        console.log(data);
        setDialog({
          color: "error",
          open: true,
          message: data.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const searchHandler = (word) => {
    setSearch(word);
    axiosClient
      .get(`items/all/pagination/${page}?word=${word}`)
      .then(({ data: { data, links } }) => {
        console.log(data);
        console.log(links);
        setItems(data);
        // console.log(links)
        setLinks(links);
      });
  };
  const updateItemsTable = (link, setLoading) => {
    console.log(search);
    setLoading(true);
    axiosClient(`${link.url}&word=${search}`,)
      .then(({ data }) => {
        console.log(data,'pagination data');
        setItems(data.data);
        setLinks(data.links);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    document.title = 'الاصناف' ;
  }, []);
  const deleteItemHandler = (id) => {
    axiosClient
      .delete(`items/${id}`)
      .then((data) => {
        console.log(data);
        if (data.status) {
          //delete Item by id
          setItems(Items.filter((Item) => Item.id != id));
          //show dialog
          setDialog({
            open: true,
            message: "تم الحذف بنجاح",
          });
        }
      })
      .catch(({ response: { data } }) => {
        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            color: "error",
            message: data.message,
          };
        });
      });
  };
  useEffect(() => {
    //fetch all Items
    axiosClient
      .get(`items/all/pagination/${page}`)
      .then(({ data: { data, links } }) => {
        console.log(data, "items");
        console.log(links);
        setItems(data);
        console.log(links);
        setLinks(links);
      })
      .catch(({ response: { data } }) => {
        setError(data.message);
      });
  }, [isSubmitted, page]);
  // useEffect(() => {
  //   //fetch all Items
  //   fetch(`${url}items/all`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       //set Items
  //       console.log(data, "items");
  //       setItems(data);
  //     });
  // }, [isSubmitted]);
  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Paper sx={{ p: 1 }}>
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
              value={search}
              onChange={(e) => {
                searchHandler(e.target.value);
              }}
              label="بحث"
            ></TextField>
          </Stack>

          <TableContainer sx={{ mb: 1 }}>
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>رقم</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>القسم</TableCell>
                  <TableCell>رصيد اول المده</TableCell>
                  <TableCell> الحد الادني </TableCell>
                  <TableCell> سعر الوحده المبدئي </TableCell>
                  <TableCell> الوحده</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
              </thead>
              <TableBody>
                {Items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <MyTableCell  colName={"name"} item={item}>
                      {item.name}
                    </MyTableCell>
                    <MyAutoCompeleteTableCell
                      val={item.section}
                      colName={"section_id"}
                      item={item}
                      sections={sections}
                    >
                      {item?.section?.name}
                    </MyAutoCompeleteTableCell>
                    <TableCell >
                      {item.initial_balance}
                    </TableCell>
                    <MyTableCell colName={"require_amount"} item={item}>
                      {item.require_amount}
                    </MyTableCell>
                    <TableCell>{item.initial_price}</TableCell>
                    <MyTableCell colName={"unit"} item={item}>
                      {item.unit}
                    </MyTableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          deleteItemHandler(item.id);
                        }}
                      >
                        <Delete></Delete>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {error && <Alert color="error">{error}</Alert>}

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
                      <ArrowBackIosIcon />
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
                      <ArrowForwardIosIcon />
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
        </Paper>
      </Grid>

      <Grid item xs={4}>
        <Paper sx={{ p: 1 }}>
          <Divider>
            <Typography variant="h3" fontFamily={"Tajwal-Regular"}>
              اضافه صنف جديد
            </Typography>
          </Divider>
          <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
            <Stack direction={"column"} spacing={3}>
              <TextField
                fullWidth
                error={errors.name}
                {...register("name", {
                  required: { value: true, message: "يجب ادخال اسم الصنف" },
                })}
                id="outlined-basic"
                label="اسم الصنف"
                variant="filled"
                helperText={errors.name && errors.name.message}
              />
              <Controller
                rules={{
                  required: {
                    value: true,
                    message: "اختار القسم",
                  },
                }}
                name="section"
                control={control}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      sx={{ mb: 1 }}
                      {...field}
                      options={sections}
                      value={field.value || null}
                      onChange={(e, data) => field.onChange(data)}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => {
                        return (
                          <TextField
                            helperText={
                              errors.section && errors.section.message
                            }
                            error={errors.section}
                            {...params}
                            label="القسم"
                            variant="filled"
                          />
                        );
                      }}
                    ></Autocomplete>
                  );
                }}
              />

              <Stack direction={"row"} justifyContent={"space-between"} gap={2}>
                <div>
                  <TextField
                    type="number"
                    fullWidth
                    helperText={
                      errors.require_amount && errors.require_amount.message
                    }
                    error={errors.require_amount}
                    {...register("require_amount", {
                      required: {
                        value: true,
                        message: "يجب ادخال رصيد الصنف",
                      },
                    })}
                    id="outlined-basic"
                    label="حد الادني للطلب"
                    variant="filled"
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    type="number"
                    helperText={errors.tests && errors.tests.message}
                    error={errors.tests}
                    {...register("tests")}
                    id="outlined-basic"
                    label="عدد التحاليل"
                    variant="filled"
                  />
                </div>

                <div>
                  <TextField
                    type="number"
                    fullWidth
                    error={errors.initial_balance}
                    {...register("initial_balance", {
                      required: {
                        value: true,
                        message: "يجب ادخال رصيد اول المده ",
                      },
                    })}
                    id="outlined-basic"
                    label="رصيد اول المده"
                    variant="filled"
                    helperText={
                      errors.initial_balance && errors.initial_balance.message
                    }
                  />
                </div>
              </Stack>

              <TextField
                type="number"
                fullWidth
                error={errors.initial_price}
                {...register("initial_price", {
                  required: { value: true, message: "يجب ادخال  السعر  " },
                })}
                id="outlined-basic"
                label="سعر الوحده "
                variant="filled"
                helperText={
                  errors.initial_price && errors.initial_price.message
                }
              />

              <TextField
                fullWidth
                error={errors.unit}
                {...register("unit", {
                  required: { value: true, message: "يجب ادخال  الوحده  " },
                })}
                id="outlined-basic"
                label="الوحده"
                variant="filled"
                helperText={errors.unit && errors.unit.message}
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
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Item;
