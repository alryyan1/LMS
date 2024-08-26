import {
  Autocomplete,
  Box,
    InputAdornment,
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
  import generator from 'generate-serial-number'
  import {t} from 'i18next'
import { BarChart, QrCode } from "@mui/icons-material";
function AddDrugForm({setUpdate}) {
    const [loading, setLoading] = useState(false);
    const [stripPrice, setStripPrice] = useState(0);
    const [market, setMarket] = useState('');
    const [barcode,setBarcode] = useState(null);
    const [deposits,setDeposits] = useState([]);
    const { setDialog,setItems,setOpendDrugDialog } = useOutletContext();
     
  
    const {
      register,
      setValue,
      formState: { errors, isSubmitting, isSubmitted },
      control,
      reset,
      handleSubmit,
      watch
    } = useForm({
      defaultValues:{
        // deposit:deposits[0]
      }
    });
    useEffect(()=>{
      if (deposits.length > 0) {
        
        // setValue('deposit',deposits[0])
      }
    },[deposits.length])
    const sell_price = watch("sell_price");
    const sc_name = watch("sc_name");
    const strips = watch("strips");
    useEffect(()=>{
      setValue('market_name',sc_name)
      setMarket(sc_name)
    },[sc_name])
    useEffect(()=>{
      // console.log(typeof sell_price,'type of sellprice')
      // console.log(typeof strips,'type of strips')
      if (sell_price  && strips  ) {
        // console.log('inside one strip prise')
        setStripPrice((sell_price/strips).toFixed(1))
      }
    },[sell_price,strips])

    // useEffect(()=>{
    //   axiosClient.get("inventory/deposit/all").then(({data})=>{
    //     setDeposits(data)
    //     console.log(data,'all deposits')
    //   })
 
    // },[])
    // useEffect(() => {
    //   setItemsIsLoading(true);
    //   //fetch all Items
    //   axiosClient
    //     .get(`items/all/pagination/${page}`)
    //     .then(({ data: { data, links } }) => {
    //       console.log(data, "items");
    //       console.log(links);
    //       setItems(data);
    //       console.log(links);
    //       setLinks(links);
    //     })
    //     .catch(({ response: { data } }) => {
    //       setError(data.message);
    //     })
    //     .finally(() => setItemsIsLoading(false));
    // }, [isSubmitted, page]);
    // console.log(isSubmitting);
    const submitHandler = async (formData) => {
      // const dayJsObj = formData.expire;
      //  localStorage.removeItem('items')
      // console.log(formData, "formdata");
      setLoading(true);
      axiosClient
        .post(`drugs`, {
          expire: `${dayjs().format('YYYY-MM-DD')}}`,
          cost_price:  0,
          require_amount: formData?.require_amount,
          sell_price:  0,
          pharmacy_type_id: formData.pharmacyType?.id,
          drug_category_id: formData.drugCategory?.id,
          barcode: formData.barcode,
          strips: formData.strips,
          sc_name: formData.sc_name,
          market_name: formData.market_name,
          batch: formData?.batch ?? '0',
          deposit:formData.deposit?.id
        })
        .then(({ data }) => {
          // console.log(data, "addded drug");
          if (data.status) {
            // alert('success')
            try {
              // console.log("success", data);
              setItems((prev) => {
                return [...prev, data.data];
              });
              if (setUpdate) {
                
                setUpdate((prev)=>prev + 1)
              }
              if (setOpendDrugDialog) {
                setOpendDrugDialog(false)
              }
              reset();
              setBarcode(null)
              setValue("section", null);
              setLoading(false);
              //show snackbar
              setDialog({
                color: "success",
                open: true,
                message: "Added Successfully",
              });
            } catch (error) {
              //  console.log(error)
            }
          
          }
        })
        .catch(({ response: { data } }) => {
          setLoading(false);
          // console.log(data);
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
  
    useEffect(() => {
      document.title = "Add new item";
    }, []);
  
   
  return (
    <Box sx={{ p: 1 }}>
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
      
            size="small"
            fullWidth
            error={errors.sc_name}
            {...register("sc_name", {
              required: {
                value: true,
                message: " Sc name is required",
              },
            })}
            label="الاسم العلمي"
            variant="outlined"
            helperText={errors.sc_name && errors.sc_name.message}
          />
          <TextField
            size="small"
            fullWidth
         
            error={errors.market_name}
            {...register("market_name", {
              required: {
                value: true,
                message: "market name is required",
              },
            })}
            defaultValue={market}
            label="الاسم التجاري"
            variant="outlined"
            helperText={errors.market_name && errors.market_name.message}
          />
        </Stack>
        {/* <Stack gap={2} direction={"row"}>
          <TextField
            size="small"
            type="number"
            fullWidth
       
            error={errors.sell_price}
            {...register("sell_price", {
              required: {
                value: true,
                message: "price is required",
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
                message: "Cost is required",
              },
            })}
            label="سعر التكلفه"
            variant="standard"
            helperText={errors.cost_price && errors.cost_price.message}
          />
        </Stack> */}
        <Stack gap={2} direction={"row"}>
          {/* <TextField
          
          value={stripPrice}
            size="small"
            fullWidth
            disabled={true}
    
            label="سعر الشريط"
            variant="standard"
          /> */}
          <TextField
            size="small"
            type="number"
            
         
            error={errors.strips && errors.strips.message}
            fullWidth
            {...register("strips", {
              required: {
                value: true,
                message: "Strips count is required",
              },
              min: {
                value: 1,
                message: "Strips count must be at least 1",
              },
            })}
            label="عدد الشرائط"
            variant="outlined"
            helperText={errors.strips && errors.strips.message}
          />
        </Stack>
        <TextField
            size="small"
            fullWidth
            value={barcode}
            
            helperText={errors.barcode && errors.barcode.message}
            error={errors.barcode}
            
            onDoubleClick={()=>{
             const serial =  generator.generate(10)
             setBarcode(serial)
             setValue('barcode',serial)
            }}
          
            {...register("barcode", {
              required: {
                value: true,
                message: "Barcode is required",
              },
            })}
            onChange={(e)=>{
              setBarcode(e.target.value)
              setValue('barcode',e.target.value)

            }}

            label="الباركود"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <QrCode />
                </InputAdornment>
              ),
            }}
          />
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
          {/* <TextField
            size="small"
            type="number"
            error={errors.require_amount !=null }
            helperText={
              errors.require_amount && errors.require_amount.message
            }
            
            fullWidth
            {...register("require_amount",{
              required: {
                value: true,
                message: "Require amount is required",
              },
            })}
            label="الكميه (الفاتوره)"
            variant="outlined"
          /> */}
      
        </Stack>
        {/* <Stack gap={2} direction={"row"}> */}
          {/* <TextField
            size="small"
          
         
            fullWidth
            {...register("batch")}
            label="باتش"
            variant="outlined"
          /> */}
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              defaultValue={dayjs(new Date())}
              control={control}
              name="expire"
              render={({ field }) => (
                <DateField
                format="YYYY-MM-DD"
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
          </LocalizationProvider> */}
        {/* </Stack> */}
        {/* <Stack direction={"column"}>
        {deposits.length > 0 && <Controller
            name="deposit"
          
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                    
                  fullWidth
                  isOptionEqualToValue={(option, val) => option.id === val.id}
                  sx={{ mb: 1 }}
                  {...field}
                  // value={deposits[0]}
                  options={deposits}
                  getOptionLabel={(option) => `${option.supplier.name} - فاتوره رقم  ${option.bill_number}`}
                  onChange={(e, data) => field.onChange(data)}
                  renderInput={(params) => {
                    return (
                      <TextField
                        error={errors.supplier != null}
                        helperText={
                          errors.supplier && errors.supplier.message
                        }
                        label={'فاتوره' }
                        {...params}
                      />
                    );
                  }}
                ></Autocomplete>
              );
            }}
          />
}
        </Stack> */}

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
  </Box>
  )
}

export default AddDrugForm