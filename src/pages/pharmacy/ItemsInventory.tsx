import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { webUrl } from "../constants.js";
import axiosClient from "../../../axios-client.js";
import MyLoadingButton from "../../components/MyLoadingButton.jsx";
import { ArrowBack, ArrowForward, FileDownload, FileUpload } from "@mui/icons-material";
import { DrugItem, Link, Paginate } from "../../types/pharmacy.js";
import dayjs from "dayjs";
import MyDateField2 from "../../components/MyDateField2.jsx";
import { useOutletContext } from "react-router-dom";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
import BasicPopover from "./MyPopOver.js";

function ItemsInventory() {
  const [paginateObj, setPaginateObj] = useState<Paginate|null>(null);
  const [search, setSearch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [page, setPage] = useState(10);
  const [filterByDate, setFilterByDate] = useState(false);
  const [filterTouched, setFilterTouched] = useState(false);
  const [filterBySoldQuery, setFilterBySoldQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [filterSoldQuantity,setFilterSoldQuantity] = useState(1)
  const [filterSoldOperator,setFilterSoldOperator] = useState('=')
  const {setDialog} = useOutletContext();
  const updateBalanceTable = (link, setLoading) => {
    console.log(search);
    setLoading(true);
    const filterByDateQuery = filterByDate ? `${selectedDate.format('YYYYMMDD')}`:null
    const filterSold = filterBySoldQuery != '' ? true: false
    fetch(`${link.url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:  JSON.stringify({ word: search, date: filterByDateQuery,sold:filterSold,filterBySoldQuery,filterSoldQuantity,filterSoldOperator}) 
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data, links);
        setPaginateObj(data);
        setLinks(data.links);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  console.log(filterByDate, 'filterByDate');
  
  useEffect(() => {
    document.title = 'المخزون' ;
  }, []);
  

  
  const searchHandler = (word) => {
    setSearch(word);
  };
  
  useEffect(() => {



    setLoading(true)
    const timer = setTimeout(() => {
      axiosClient
        .post(`items/all/balance/paginate/${page}`, { word: search ,sold:filterBySoldQuery,filterSoldQuantity,filterSoldOperator})
        .then(({ data }) => {
          console.log(data, "items data");
          setPaginateObj(data);
          setLinks(data.links);
        }).finally(() => setLoading(false));
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [search, page,filterBySoldQuery]);
 
  return (
    <>
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
        <option value="500">500</option>
      </select>
      <TableContainer>
        <Stack justifyContent={'space-between'} alignContent={'center'} alignItems={'center'} sx={{ mb: 1 }} gap={2} direction={'row'}>
          <Button  variant="contained" href={`${webUrl}balance${filterQuery}${filterBySoldQuery}`}>pdf</Button>
          <Button  variant="contained" href={`${webUrl}rwakid`}>الرواكض</Button>
          <Button  variant="contained" href={`${webUrl}itemsPriceList`}>price list</Button>
          <Stack direction={'row'} gap={1}>
             <input value={filterSoldQuantity} onChange={(e)=>{
              setFilterSoldQuantity(e.target.value)
             }} style={{width:'50px',border:'1px dashed black'}} type="text" />
                  <input value={filterSoldOperator} onChange={(e)=>{
              setFilterSoldOperator(e.target.value)
             }} style={{width:'50px',border:'1px dashed black'}} type="text" />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox

                  onChange={(e) => {
                    setFilterBySoldQuery(e.target.checked? `?sold=1` : '')
                  }}
                />
              }
              label={"  فلتر بالمستهلك   "}
            />
          </FormGroup>
          </Stack>
         
          <TextField
            value={search}
            onChange={(e) => {
              searchHandler(e.target.value);
            }}
            label="بحث"
          ></TextField>
          <Card sx={{ minWidth: 275, boxShadow: 3 }}>
            <CardContent>
              <img src="https://via.placeholder.com/50" alt="Quantity" style={{ marginRight: 8 }} />
              <Box>{paginateObj?.total} عدد الاصناف</Box>
            </CardContent>
          </Card>
          {loading && <CircularProgress></CircularProgress>}
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box>
              <LoadingButton
                onClick={() => {
                  setLoading(true);
                  setFilterTouched(true)
                  setFilterQuery( `?date=${selectedDate.format('YYYY-MM-DD')}`)

                  const date = selectedDate.format('YYYY-MM-DD');
                  setFilterByDate(true);
                  axiosClient.post(`items/all/balance/paginate/${page}?filter=expire&date=${date}`).then(({ data }) => {
                    console.log(data, "items data");
                    setPaginateObj(data);
                    setLinks(data.links);
                  }).finally(() => {
                    setLoading(false);
                  });
                }}
                loading={loading}
                sx={{ mt: 2 }}
                size="medium"
                variant="contained"
              >
                بحث
              </LoadingButton>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                  format="YYYY-MM-DD"
                  variant="standard"
                  onChange={(val) => {
                    setSelectedDate(val);
                  }}
                  defaultValue={dayjs(new Date())}
                  sx={{ m: 1 }}
                  label="فلتر تاريخ الصلاحيه"
                />
              </LocalizationProvider>
            </Box>
          </Stack>
        </Stack>
        <Table dir="rtl" size="small">
          <thead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Market Name</TableCell>
              <TableCell>Scientific Name</TableCell>
              <TableCell>Expire</TableCell>
              <TableCell>in  <Icon sx={{ color: (theme) => theme.palette.success.light }}><FileDownload /></Icon></TableCell>
              <TableCell>Out<Icon sx={{ color: (theme) => theme.palette.error.light }}> <FileUpload /></Icon> </TableCell>

              <TableCell>Balance </TableCell>
              <TableCell>Barcode </TableCell>
            </TableRow>
          </thead>
          <TableBody>
            {paginateObj?.data.map((item) => {
              console.log(item,'item')
              const expire = item?.last_deposit_item?.expire ?? null;
              let is_expired = false;
              if (expire != null && !dayjs(expire).isAfter(dayjs())) {
                is_expired = true;
              }
              const remaining = item.remaining + item.initial_balance;
              return (
                <TableRow sx={{ backgroundColor: (theme) => is_expired ? theme.palette.warning.light : '' }} key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.market_name}</TableCell>
                  <TableCell>{item.sc_name}</TableCell>
                  <TableCell>
                    <MyDateField2 setDialog={setDialog}
                      val={item?.last_deposit_item?.expire}
                      item={item?.last_deposit_item}
                    />
                  </TableCell>
                  <TableCell><BasicPopover route="item/deposits" item={item} title={item.totaldeposit} /></TableCell>
                  <TableCell><BasicPopover isBox={true} route="item/deducts" item={item} title={item.totaldeduct} /></TableCell>
                  <TableCell>{item.totaldeposit - item?.totaldeduct} </TableCell>
                  <TableCell>{item.barcode}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Grid key={paginateObj?.current_page} sx={{ gap: "4px", mt: 1 }} container>
          {links.map((link, i) => {
            if (i === 0) {
              return (
                <Grid item xs={1} key={i}>
                  <MyLoadingButton
                    onClick={(setLoading) => {
                      updateBalanceTable(link, setLoading);
                    }}
                    variant="contained"
                    key={i}
                  >
                    <ArrowBack />
                  </MyLoadingButton>
                </Grid>
              );
            } else if (links.length - 1 === i) {
              return (
                <Grid item xs={1} key={i}>
                  <MyLoadingButton
                    onClick={(setLoading) => {
                      updateBalanceTable(link, setLoading);
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
                      updateBalanceTable(link, setLoading);
                    }}
                  >
                    {link.label}
                  </MyLoadingButton>
                </Grid>
              );
          })}
        </Grid>
      </TableContainer>
    </>
  );
}

export default ItemsInventory;