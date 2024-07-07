import {
    Paper,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useForm, Controller } from "react-hook-form";
  import { LoadingButton } from "@mui/lab";
  import { useOutletContext } from "react-router-dom";
  import axiosClient from "../../../axios-client.js";
  import PharmacyTypeAutocomplete from "../../components/PharmacyType.jsx";
  import DrugCategoryAutocomplete from "../../components/DrugCategoryAutocomplete.jsx";
  import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
  import dayjs from "dayjs";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
function AddDrugForm() {
    const [loading, setLoading] = useState(false);
    const [stripPrice, setStripPrice] = useState(0);
    const [itemsIsLoading, setItemsIsLoading] = useState(false);
    const [page, setPage] = useState(7);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [links, setLinks] = useState([]);
    const { setDialog,items,setItems } = useOutletContext();
  
    const {
      register,
      setValue,
      formState: { errors, isSubmitting, isSubmitted },
      control,
      reset,
      handleSubmit,
      watch
    } = useForm();
  
    const sell_price = watch("sell_price");
    const strips = watch("strips");
    useEffect(()=>{
      console.log(typeof sell_price,'type of sellprice')
      console.log(typeof strips,'type of strips')
      if (sell_price  && strips  ) {
        console.log('inside one strip prise')
        setStripPrice((sell_price/strips).toFixed(1))
      }
    },[sell_price,strips])
    useEffect(() => {
      setItemsIsLoading(true);
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
        })
        .finally(() => setItemsIsLoading(false));
    }, [isSubmitted, page]);
    console.log(isSubmitting);
    const submitHandler = async (formData) => {
      const dayJsObj = formData.expire;
  
      console.log(formData, "formdata");
      setLoading(true);
      axiosClient
        .post(`drugs`, {
          expire: `${dayJsObj.year()}/${dayJsObj.month() + 1}/${dayJsObj.date()}`,
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
          console.log(data, "addded drug");
          if (data.status) {
            console.log("success", data);
            setItems((prev) => {
              return [...prev, data.data];
            });
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
          setLoading(false);
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
      axiosClient(`${link.url}&word=${search}`)
        .then(({ data }) => {
          console.log(data, "pagination data");
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
      document.title = "اضافه صنف جديد";
    }, []);
    const searchHandler = (word) => {
      setSearch(word);
    };
    useEffect(() => {
      const timer = setTimeout(() => {
        axiosClient
          .get(`items/all/pagination/${page}?word=${search}`)
          .then(({ data: { data, links } }) => {
            console.log(data);
            console.log(links);
            setItems(data);
            // console.log(links)
            setLinks(links);
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
      }, 300);
      return () => clearTimeout(timer);
    }, [search]);
  return (
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
      Item Definition
    </Typography>
    <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
      <Stack direction={"column"} spacing={3}>
        <Stack gap={2} direction={"row"}>
          <TextField
           InputLabelProps={{
            sx: {
              color: "#518eb9",
              fontSize: "20px",
              fontWeight: 500,
              "&.MuiOutlinedInput-notchedOutline": { fontSize: "28px" }
            }
          }}
            size="small"
            fullWidth
            error={errors.sc_name}
            {...register("sc_name", {
              required: {
                value: true,
                message: "يجب ادخال الاسم العلمي",
              },
            })}
            label="الاسم العلمي"
            variant="standard"
            helperText={errors.sc_name && errors.sc_name.message}
          />
          <TextField
            size="small"
            fullWidth
            InputLabelProps={{
              sx: {
                color: "#518eb9",
                fontSize: "20px",
                fontWeight: 500,
                "&.MuiOutlinedInput-notchedOutline": { fontSize: "28px" }
              }
            }}
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
            InputLabelProps={{
              sx: {
                color: "#518eb9",
                fontSize: "20px",
                fontWeight: 500,
                "&.MuiOutlinedInput-notchedOutline": { fontSize: "28px" }
              }
            }}
            error={errors.sell_price}
            {...register("sell_price", {
              required: {
                value: true,
                message: "يجب ادخال سعر البيع ",
              },
            })}
            label="سعر البيع (صندوق)"
            variant="standard"
            helperText={errors.sell_price && errors.sell_price.message}
          />
          <TextField
            size="small"
            fullWidth
            type="number"
            InputLabelProps={{
              sx: {
                color: "#518eb9",
                fontSize: "20px",
                fontWeight: 500,
                "&.MuiOutlinedInput-notchedOutline": { fontSize: "28px" }
              }
            }}
            error={errors.cost_price}
            {...register("cost_price", {
              required: {
                value: true,
                message: "يجب ادخال سعر الشراء ",
              },
            })}
            label="سعر الشراء (صندوق)"
            variant="standard"
            helperText={errors.cost_price && errors.cost_price.message}
          />
        </Stack>
        <Stack gap={2} direction={"row"}>
          <TextField
          value={stripPrice}
            size="small"
            fullWidth
            disabled={true}
            InputLabelProps={{
              sx: {
                color: "#518eb9",
                fontSize: "20px",
                fontWeight: 500,
                "&.MuiOutlinedInput-notchedOutline": { fontSize: "28px" }
              }
            }}
            label="سعر الشريط"
            variant="standard"
          />
          <TextField
            size="small"
            type="number"
            InputLabelProps={{
              sx: {
                color: "#518eb9",
                fontSize: "20px",
                fontWeight: 500,
                "&.MuiOutlinedInput-notchedOutline": { fontSize: "28px" }
              }
            }}
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
            InputLabelProps={{
              sx: {
                color: "#518eb9",
                fontSize: "20px",
                fontWeight: 500,
                "&.MuiOutlinedInput-notchedOutline": { fontSize: "28px" }
              }
            }}
            {...register("barcode", {
              required: {
                value: true,
                message: "يجب ادخال الباركود",
              },
            })}
            label="الباركود"
            variant="filled"
          />
        </Stack>
        <Stack gap={2} direction={"row"}>
          <TextField
            size="small"
            InputLabelProps={{
              sx: {
                color: "#518eb9",
                fontSize: "20px",
                fontWeight: 500,
                "&.MuiOutlinedInput-notchedOutline": { fontSize: "28px" }
              }
            }}
            fullWidth
            {...register("batch")}
            label="الباتش"
            variant="outlined"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              defaultValue={dayjs(new Date())}
              control={control}
              name="expire"
              render={({ field }) => (
                <DateField
                
                size="small"
                fullWidth
                  {...field}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  sx={{ mb: 1 }}
                  label="تاريخ الانتهاء"
                />
              )}
            />
          </LocalizationProvider>
        </Stack>

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
  )
}

export default AddDrugForm