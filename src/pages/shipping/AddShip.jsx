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
  import MyLoadingButton from "../../components/MyLoadingButton";
  import { ArrowBack, ArrowForward } from "@mui/icons-material";
  import { useOutletContext } from "react-router-dom";
import { Item } from "../constants";
import ShipItemAutocomplete from "./ShipItemAutocomplete";
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell";
import Locales from "./Locale";
import { useTranslation } from "react-i18next";
import ShippingStateAutocomplete from "./ShippingStateAutocomplete";
  
  function AddShip() {
    const {t} = useTranslation()
    const [shipItems, setShipItems] = useState([]);
    const [shippings, setShippings] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setDialog } = useOutletContext();
    const [page, setPage] = useState(9);
    const [search, setSearch] = useState(null);
    const [links, setLinks] = useState([]);
    const [ states ,setStates] = useState([]);

    const {
      register:register2,
      control:control2,
      setValue,
      reset:reset2,
      formState: { errors:errors2, isSubmitting:isSubmitting2, isSubmitSuccessful:isSubmitSuccessful2 },
      handleSubmit:handleSubmit2,
    } = useForm();
    useEffect(() => {
        axiosClient.get("shipItems/all").then(({ data }) => {
          console.log(data, "shipItems");
          setShipItems(data);
        });
      }, []);
    
    //create state variable to store all Items
    const searchHandler = (word) => {
        setSearch(word);
        axiosClient
          .get(`shipping/paginate/${page}?word=${word}`)
          .then(({ data: { data, links } }) => {
            console.log(data);
            console.log(links);
            setShippings(data);
            // console.log(links)
            setLinks(links);
          });
      };
    const submitHandler2 = (data) => {
      setLoading(true);
  
      console.log(data, "submitted data");
      axiosClient
        .post(`addShipping`, {...data,shipping_item_id:data.item.id})
        .then((data) => {
          if (data.status) {
            setLoading(false);
            reset2();
            setDialog((prev) => {
              return {
                ...prev,
                open: true,
                message: data.message,
                color: "success",
              };
            });
          }
        })
        .catch(({ data }) => {
            console.log(data,'error data')
          setDialog((prev) => {
            return { ...prev, open: true, message: data.message, color: "error" };
          });
        })
        .finally(() => {});
    };

    useEffect(() => {
      axiosClient.get("shipping/paginate").then(({ data: { data, links } }) => {
        console.log(data, "shippings");
        console.log(links, "links");
        setLinks(links);
        setShippings(data);
      });
    }, [isSubmitSuccessful2]);
    useEffect(() => {
      axiosClient.get("shippingState/all").then(({ data }) => {
        setStates(data)
      
      });
    }, []);
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
            setShippings(data);
            setLinks(links);
          })
          .finally(() => {
            setLoading(false);
          });
      };
    
  
    return (
      <Grid container spacing={3}>
       
  
       
  
  
        <Grid item xs={9}>
          <TableContainer sx={{ mb: 1 }}>
          <Stack sx={{mb:1}} direction={'row'} justifyContent={'space-between'}>
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
  
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>{t('hello')}</TableCell>
                  <TableCell>الهاتف</TableCell>
                  <TableCell>الصنف</TableCell>
                  <TableCell>اكسبرس</TableCell>
                  <TableCell>CTN</TableCell>
                  <TableCell>CBM</TableCell>
                  <TableCell>KG</TableCell>
                  <TableCell>التاريخ</TableCell>
                  <TableCell>الحاله</TableCell>
                </TableRow>
              </thead>
              <TableBody>
                {shippings.map((item) => (
                  <TableRow key={item.id}>
                    <MyTableCell table="shipping" colName={"name"} item={item}>
                      {item.name}
                    </MyTableCell>
                    <MyTableCell
                      table="shipping"
                      colName={"phone"}
                      item={item}
                    >
                      {item.phone}
                    </MyTableCell>
                    <MyAutoCompeleteTableCell sections={shipItems} colName={'shipping_item_id'}  item={item} table="shipping" val={item.item}> 
                     {item.item.name}
                    </MyAutoCompeleteTableCell>
                    <MyTableCell
                      table="shipping"
                      colName={"express"}
                      item={item}
                    >
                      {item.express}
                    </MyTableCell>
                    <MyTableCell
                    
                      table="shipping"
                      colName={"ctn"}
                      item={item}
                    >
                      {item.ctn}
                    </MyTableCell>
                    <MyTableCell
                      table="shipping"
                      colName={"cbm"}
                      item={item}
                    >
                      {item.cbm}
                    </MyTableCell>
                    <MyTableCell
                      table="shipping"
                      colName={"kg"}
                      item={item}
                    >
                      {item.kg}
                    </MyTableCell>
                 
                    <TableCell
                      table="shipping"
                      colName={"kg"}
                      item={item}
                    >
                      {new Date(Date.parse(item.created_at)).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <ShippingStateAutocomplete shippingId={item.id} shippingStates={states} shipSate={item.state}/>
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
                    <ArrowBack/>
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
  
        <Grid item xs={3} style={{ flexGrow: "1" }}>
          <Stack direction={"row"} justifyContent={"center"} spacing={4}>
            <Typography variant="h3" fontFamily={"Tajwal-Regular"}>
              اضافه شحنه 
            </Typography>
          </Stack>
          <form noValidate dir="rtl" onSubmit={handleSubmit2(submitHandler2)}>
            <Stack direction={"column"} gap={3}>
              <TextField
                fullWidth
                error={errors2.name != null}
                {...register2("name", {
                  required: { value: true, message: "يجب ادخال اسم " },
                })}
                id="outlined-basic"
                label="اسم "
                variant="filled"
                helperText={errors2.name?.message}
              />
  
              <TextField
                fullWidth
                type="number"
                error={errors2.phone != null}
                {...register2("phone", {
                  required: { value: true, message: "يجب ادخال  رقم الهاتف" },
                })}
                id="outlined-basic"
                label="رقم الهاتف"
                variant="filled"
                helperText={errors2.phone?.message}
              />
  
              <TextField
                fullWidth
                error={errors2.express != null}
                {...register2("express", {
                  required: { value: true, message: "يجب ادخال تحمل المريض" },
                })}
                id="outlined-basic"
                label="اكسبرس"
                variant="filled"
                helperText={errors2.express?.message}
              />
                <Stack
              direction={"row"}
              gap={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Item>
                <TextField
                  helperText={errors2?.ctn && errors2.ctn.message}
                  onKeyDown={(event) => {
                    if (event.key == "Enter") {
                      console.log("event");
                      // setFocus('age_month')
                    }
                  }}
                  error={errors2?.ctn}
                  {...register2("ctn", {
                    required: {
                      value: true,
                      message: "يجب ادخال CTN ",
                    },
                  })}
                  label="CTN"
                  variant="standard"
                />
              </Item>
              <Item>
                <TextField
                  onKeyDown={(event) => {
                    if (event.key == "Enter") {
                      console.log("event");
                      //   setFocus('age_day')
                    }
                  }}
                  {...register2("cbm")}
                  label="CBM"
                  variant="standard"
                />
              </Item>
              <Item>
                <TextField
                  onKeyDown={(event) => {
                    if (event.key == "Enter") {
                      console.log("event");
                      //setFocus('doctor')
                    }
                  }}
                  {...register2("kg")}
                  label="KG"
                  variant="standard"
                />
              </Item>
            </Stack>
             <ShipItemAutocomplete setValue={setValue} errors={errors2} Controller = {Controller}  control={control2}/>
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
        </Grid>
      </Grid>
    );
  }
  
  export default AddShip;
  