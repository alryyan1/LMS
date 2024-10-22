import {
  Box,
  Button,
    CircularProgress,
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
  import {  webUrl } from "../constants.js";
  import axiosClient from "../../../axios-client.js";
  import MyLoadingButton from "../../components/MyLoadingButton.jsx";
  import { ArrowBackIos, ArrowForwardIos, FileDownload, FileUpload } from "@mui/icons-material";
import { DrugItem, Link, Paginate } from "../../types/pharmacy.js";
import dayjs from "dayjs";
import MyDateField2 from "../../components/MyDateField2.jsx";
import { useOutletContext } from "react-router-dom";
  
  function ItemsInventory() {
    const [paginateObj, setPaginateObj] = useState<Paginate|null>(null);
    const [search, setSearch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState<Link[]>([]);
    const [page, setPage] = useState(10);
    const {setDialog} = useOutletContext()
    const updateBalanceTable = (link, setLoading) => {
      console.log(search);
      setLoading(true);
      fetch(link.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: search ? JSON.stringify({ word: search }) : null,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data, links);
          setPaginateObj(data);
          setLinks(links);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    useEffect(() => {
      document.title = 'المخزون' ;
    }, []);
    useEffect(() => {
      setLoading(true)
      axiosClient
        .post<Paginate>(`items/all/balance/paginate/${page}`, { word: "" })
        .then(({ data }) => {
          
          console.log(data, "items data");
          setPaginateObj(data);
          ///    setItems(data)
          // console.log(links)
          setLinks(data.links);
        }).finally(()=>setLoading(false));
    }, []);
    const searchHandler = (word) => {
      setSearch(word);
    };
    useEffect(() => {
      setLoading(true)
      const timer = setTimeout(() => {
        axiosClient
          .post(`items/all/balance/paginate/${page}`, { word: search })
          .then(({ data}) => {
            
            console.log(data, "items data");
            setPaginateObj(data);
            ///    setItems(data)
            // console.log(links)
            setLinks(data.links);
          }).finally(()=>setLoading(false));
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }, [search, page]);
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
          <Stack sx={{mb:1}} gap={2} direction={'row'}>
          <Button  variant="contained"  href={`${webUrl}balance`}>pdf</Button>
            <TextField
              value={search}
              onChange={(e) => {
                searchHandler(e.target.value);
              }}
              label="بحث"
            ></TextField>
            <Box>{paginateObj?.total} عدد الاصناف</Box>
              {loading && <CircularProgress></CircularProgress>}
          </Stack>
  
          <Table dir="rtl" size="small">
            <thead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Market Name</TableCell>
                <TableCell>Scientific Name</TableCell>
                <TableCell>Expire</TableCell>
                <TableCell>Out<Icon sx={{color:(theme)=>theme.palette.error.light}}> <FileUpload/></Icon> </TableCell>
                <TableCell>in  <Icon sx={{color:(theme)=>theme.palette.success.light}}><FileDownload/></Icon></TableCell>
                <TableCell>Balance </TableCell>
                <TableCell>Barcode </TableCell>
              </TableRow>
            </thead>
  
            <TableBody>
              {paginateObj?.data.map((item) => {
                  const expire = item?.lastDepositItem?.expire ?? null;
                  let is_expired = false;
                  if (expire != null && !dayjs(expire).isAfter(dayjs())) {
                    is_expired = true;
                  }
                const remaining = item.remaining + item.initial_balance;
                return (
                  <TableRow sx={{backgroundColor:(theme)=> is_expired ? theme.palette.warning.light : ''}} key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell  >{item.market_name}</TableCell>
                    <TableCell>{item.sc_name}</TableCell>
                    <TableCell>
                        <MyDateField2 setDialog={setDialog}
                          val={item?.lastDepositItem?.expire }
                          item={item?.lastDepositItem}
                        />
                      </TableCell>
                    <TableCell>{item.totaldeduct}</TableCell>
                    <TableCell>{item.totaldeposit}</TableCell>
                    <TableCell>{item.remaining }</TableCell>
                    <TableCell>{item.barcode }</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Grid sx={{ gap: "4px", mt: 1 }} container>
            {links.map((link, i) => {
              if (i == 0) {
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      onClick={(setLoading) => {
                        updateBalanceTable(link, setLoading);
                      }}
                      variant="contained"
                      key={i}
                    >
                      <ArrowBackIos />
                    </MyLoadingButton>
                  </Grid>
                );
              } else if (links.length - 1 == i) {
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      onClick={(setLoading) => {
                        updateBalanceTable(link, setLoading);
                      }}
                      variant="contained"
                      key={i}
                    >
                      <ArrowForwardIos />
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
  