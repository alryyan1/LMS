import {
  Grid,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import {  useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import PharmacyTypeAutocomplete from "../../components/PharmacyType.jsx";
import DrugCategoryAutocomplete from "../../components/DrugCategoryAutocomplete.jsx";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MyTableCell from "../inventory/MyTableCell.jsx";
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell.jsx";
import MyDateField from "../../components/MyDateField.jsx";
import MyLoadingButton from "../../components/MyLoadingButton.jsx";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function AddDrug() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(7);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [links, setLinks] = useState([]);
  const [items, setItems] = useState([])
  const {  setDialog ,drugCategory,pharmacyTypes} = useOutletContext();

  const {
    register,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
    control,
    reset,
    handleSubmit,
  } = useForm();
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
  console.log(isSubmitting);
  const submitHandler = async (formData) => {
    const dayJsObj = formData.expire;

    console.log(formData, "formdata");
    setLoading(true);
    axiosClient
      .post(`drugs`, {
        expire:   `${dayJsObj.year()}/${dayJsObj.month() + 1}/${dayJsObj.date()}`,
        cost_price: formData.cost_price,
        require_amount: formData.require_amount,
        sell_price: formData.sell_price,
        pharmacy_type_id: formData.pharmacyType?.id,
        drug_category_id: formData.drugCategory?.id,
        barcode: formData.barcode,
        strips: formData.strips,
        sc_name: formData.sc_name,
        market_name: formData.market_name,
        batch: formData.batch,
      })
      .then(({ data }) => {
        console.log(data,'addded drug')
        if (data.status) {
          console.log('success',data)
          setItems((prev)=>{
                return [...prev, data.data]
            })
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
        setLoading(false)
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
    document.title = "اضافه دواء جديد";
  }, []);
  const searchHandler = (word) => {
    setSearch(word);
  
  };
  useEffect(() => {
    const timer =  setTimeout(() => {
        axiosClient
        .get(`items/all/pagination/${page}?word=${search}`)
        .then(({ data: { data, links } }) => {
          console.log(data);
          console.log(links);
          setItems(data);
          // console.log(links)
          setLinks(links);
        }).catch(({response:{data}}) => {
          setDialog((prev)=>{
            return {...prev, open: true, color: "error", message: data.message}
          })
        });
      }, 300);
      return () => clearTimeout(timer);
  },[search])
  return (
    <Grid container spacing={3}>
        <Grid item  lg={9} xs={12} md={12}>
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
            <TableContainer>
                <Table dir="rtl" size="small">
                  <thead>
                    <TableRow>
                      <TableCell>الاسم العلمي</TableCell>
                      <TableCell>الاسم التجاري</TableCell>
                      <TableCell>سعر الشراء</TableCell>
                      <TableCell>سعر البيع </TableCell>
                      <TableCell> عدد الشرائط</TableCell>
                      <TableCell> الصلاحيه</TableCell>
                      <TableCell> المجموعه</TableCell>
                      <TableCell> الشكل</TableCell>
                      <TableCell> الباركود</TableCell>
                    </TableRow>
                  </thead>
                  <tbody>

                    {items.map((drug)=>{
                      console.log(drug,'drug ')
                        return (
                          <TableRow key={drug.id}>
                            <MyTableCell colName={'sc_name'} item={drug} table="items" >{drug.sc_name}</MyTableCell>
                            <MyTableCell  colName={'market_name'} item={drug} table="items">{drug.market_name}</MyTableCell>
                            <MyTableCell sx={{width:'70px'}} colName={'cost_price'} item={drug} table="items"  >{drug.cost_price}</MyTableCell>
                            <MyTableCell sx={{width:'70px'}}   colName={'sell_price'} item={drug} table="items">{drug.sell_price}</MyTableCell>
                            <MyTableCell colName={'strips'} item={drug} table="items">{drug.strips}</MyTableCell>
                            <TableCell>
                              <MyDateField val={drug.expire} item={drug} />
                            </TableCell>
                            <MyAutoCompeleteTableCell sections={drugCategory} val={drug.category}  colName="drug_category_id"  item={drug} table="items">{drug.category?.name}</MyAutoCompeleteTableCell>
                            <MyAutoCompeleteTableCell sections={pharmacyTypes}  colName={'pharmacy_type_id'} val={drug.type} item={drug} table="items">{drug.type?.name}</MyAutoCompeleteTableCell>
                            <MyTableCell colName={'barcode'} item={drug} table="items">{drug.barcode}</MyTableCell>
                          </TableRow>
                        )
                    })}

                  </tbody>
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
        </Grid>
      <Grid item xs={12} md={12} lg={3}>
        <Paper sx={{ p: 1 }}>
          <Typography
            sx={{
              mb: 2,
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "white",
              borderRadius: "5px",
            }}
            textAlign={"center"}
            variant="h3"
          >
            اضافه دواء جديد
          </Typography>
          <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
            <Stack direction={"column"} spacing={3}>
              <Stack gap={2} direction={"row"}>
                <TextField
                  size="small"
                  fullWidth
                  error={errors.sc_name}
                  {...register("sc_name", {
                    required: {
                      value: true,
                      message: "يجب ادخال الاسم العلمي",
                    },
                  })}
                  label="اسم العلمي"
                  variant="standard"
                  helperText={errors.sc_name && errors.sc_name.message}
                />
                <TextField
                  size="small"
                  fullWidth
                  error={errors.market_name}
                  {...register("market_name", {
                    required: {
                      value: true,
                      message: "يجب ادخال الاسم التجاري",
                    },
                  })}
                  label="اسم التجاري"
                  variant="standard"
                  helperText={errors.market_name && errors.market_name.message}
                />
              </Stack>
              <Stack gap={2} direction={"row"}>
                <TextField
                  size="small"
                  type="number"
                  fullWidth
                  error={errors.sell_price}
                  {...register("sell_price", {
                    required: {
                      value: true,
                      message: "يجب ادخال سعر البيع ",
                    },
                  })}
                  label="سعر البيع"
                  variant="standard"
                  
                  helperText={errors.sell_price && errors.sell_price.message}
                />
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  error={errors.cost_price}
                  {...register("cost_price", {
                    required: {
                      value: true,
                      message: "يجب ادخال سعر الشراء ",
                    },
                  })}
                  label="سعر الشراء"
                  variant="standard"
                  helperText={errors.cost_price && errors.cost_price.message}
                />
              </Stack>
              <Stack gap={2} direction={"row"}>
                <TextField
                  size="small"
                  fullWidth
                  error={errors.batch}
                  {...register("batch")}
                  label="الباتش"
                  variant="standard"
                />
                <TextField
                  size="small"
                  type="number"
                  error={errors.strips && errors.strips.message}
                  fullWidth
                  {...register("strips", {
                    required: {
                      value: true,
                      message: "يجب ادخال  عدد الشرائط ",
                    },
                  })}
                  label="عدد الشرائط"
                  variant="standard"
                  helperText={errors.cost_price && errors.cost_price.message}
                />
              </Stack>
              <Stack gap={2} direction={"row"}>
                <PharmacyTypeAutocomplete
                  errors={errors}
                  Controller={Controller}
                  control={control}
                  setValue={setValue}
                />
                <DrugCategoryAutocomplete
                  errors={errors}
                  Controller={Controller}
                  control={control}
                  setValue={setValue}
                />
              </Stack>
              <Stack gap={2} direction={"row"}>
                <TextField
                  size="small"
                  type="number"
                  fullWidth
                  {...register("require_amount")}
                  label="حد الادني للطلب"
                  variant="filled"
                />
                <TextField
                  size="small"
                  fullWidth
                  helperText={errors.barcode && errors.barcode.message}
                  error={errors.barcode}
                  {...register("barcode",{
                    required: {
                      value: true,
                      message: "يجب ادخال الباركود",
                    },
                  })}
                  label="الباركود"
                  variant="filled"
                />
              </Stack>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  defaultValue={dayjs(new Date())}
                
                  control={control}
                  name="expire"
                  render={({ field }) => (
                    <DateField
                      {...field}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      sx={{ mb: 1 }}
                      label="تاريخ الانتهاء"
                    />
                  )}
                />
              </LocalizationProvider>

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

export default AddDrug;
