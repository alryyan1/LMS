import {
  Autocomplete,
  Box,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useForm, Controller } from "react-hook-form";
  import { LoadingButton } from "@mui/lab";
  import { useOutletContext } from "react-router-dom";
  import axiosClient from "../../../axios-client.js";
  import dayjs from "dayjs";
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
      formState: { errors,},
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

    useEffect(()=>{
      axiosClient.get("inventory/deposit/all").then(({data})=>{
        setDeposits(data)
        console.log(data,'all deposits')
      })
 
    },[])
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
          expire: `${dayjs().format('YYYY-MM-DD')}`,
          cost_price:   formData?.cost_price,
          require_amount: formData?.require_amount,
          sell_price:   formData?.sell_price,
          offer_price:   formData?.offer_price,
          pharmacy_type_id: formData.pharmacyType?.id,
          drug_category_id: formData.drugCategory?.id,
          barcode: formData.barcode,
          strips: formData.strips,
          sc_name: formData.sc_name,
          market_name: formData.market_name,
          batch: formData?.batch ?? '0',
          deposit:formData.deposit?.id,
          quantity:formData.quantity
        })
        .then(({ data }) => {
          // console.log(data, "addded drug");
          if (data.status) {
            // alert('success')
            try {
              // console.log("success", data);
              // setItems((prev) => {
              //   return [...prev, data.data];
              // });
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
      document.title = "اضافه منتج";
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
      اضافه منتج 
    </Typography>
    <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
        <Stack gap={2} direction={"column"}>
          
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
            label="اسم المنتج "
            variant="standard"
            helperText={errors.market_name && errors.market_name.message}
          />
              <TextField
                      fullWidth
                      sx={{ mb: 1 }}
                      error={errors.quantity}
                      {...register("quantity", {
                        required: { value: true, message: "quantity must be provided" },
                      })}
                      id="outlined-basic"
                      label="الكميه"
                      variant="standard"
                   
                      helperText= {errors.quantity && errors.quantity.message}
                    />
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
       
       <TextField
            size="small"
            fullWidth
            type="number"
      
            error={errors.offer_price}
            {...register("offer_price",{
              required: {
                value: true,
                message: "offer_price is required",
              },
            })}
            helperText={errors.offer_price && errors.offer_price.message}

            label="سعر العرض"
            variant="standard"
          />
       
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
                  getOptionLabel={(option) => `${option.supplier.name} - بند رقم  ${option.bill_number}`}
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
          />}

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