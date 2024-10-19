import {
  Button,
    Grid,
    Icon,
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
import { DrugItem } from "../../types/Pharmacy.js";
import dayjs from "dayjs";
  
  function ItemsInventory() {
    const [items, setItems] = useState<DrugItem[]>([]);
    const [search, setSearch] = useState(null);
    const [links, setLinks] = useState([]);
    const [page, setPage] = useState(10);
  
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
        .then(({ data, links }) => {
          console.log(data, links);
          setItems(data);
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
      axiosClient
        .post(`items/all/balance/paginate/${page}`, { word: "" })
        .then(({ data: { data, links } }) => {
          console.log(data, "items data");
          console.log(links);
          setItems(data);
          ///    setItems(data)
          // console.log(links)
          setLinks(links);
        });
    }, []);
    const searchHandler = (word) => {
      setSearch(word);
    };
    useEffect(() => {
      const timer = setTimeout(() => {
        axiosClient
          .post(`items/all/balance/paginate/${page}`, { word: search })
          .then(({ data: { data, links } }) => {
            console.log(data);
            console.log(links);
            setItems(data);
            ///    setItems(data)
            // console.log(links)
            setLinks(links);
          });
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
        </select>
        <TableContainer>
          <Button sx={{mt:1}} variant="contained"  href={`${webUrl}balance`}>pdf</Button>
          <div style={{ textAlign: "right", marginBottom: "5px" }}>
            <TextField
              value={search}
              onChange={(e) => {
                searchHandler(e.target.value);
              }}
              label="بحث"
            ></TextField>
          </div>
  
          <Table dir="rtl" size="small">
            <thead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Market Name</TableCell>
                <TableCell>Active Substance </TableCell>
                <TableCell>Active Substance 1</TableCell>
                <TableCell>Expire</TableCell>
                <TableCell>Out<Icon sx={{color:(theme)=>theme.palette.error.light}}> <FileUpload/></Icon> </TableCell>
                <TableCell>in  <Icon sx={{color:(theme)=>theme.palette.success.light}}><FileDownload/></Icon></TableCell>
                <TableCell>Balance </TableCell>
                <TableCell>Barcode </TableCell>
              </TableRow>
            </thead>
  
            <TableBody>
              {items.map((item) => {
                const remaining = item.remaining + item.initial_balance;
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell  >{item.market_name}</TableCell>
                    <TableCell>{item.sc_name}</TableCell>
                    <TableCell>{item.active1}</TableCell>
                    <TableCell>{dayjs(new Date(item?.lastDepositItem?.expire)).format('YYYY-MM-DD')}</TableCell>
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
  