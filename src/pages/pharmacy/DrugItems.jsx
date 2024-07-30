import {
  Badge,
  Box,
  Button,
  Grid,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import MyTableCell from "../inventory/MyTableCell.jsx";
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell.jsx";
import MyDateField from "../../components/MyDateField.jsx";
import MyLoadingButton from "../../components/MyLoadingButton.jsx";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
import { webUrl } from "../constants.js";

function DrugItems() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(7);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [links, setLinks] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedFutureDate, setSelectedFutureDate] = useState(null);
  const [futureDates,setFutureDates] = useState([]);
  const { setDialog, drugCategory, pharmacyTypes } = useOutletContext();


  useEffect(() => {
    //fetch all Items

    axiosClient.get('expireMonthPanel').then(({data})=>{
      console.log(data)
      setFutureDates(data.data)
    })
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
  }, [ page]);

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
    document.title = "المعرض";
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
    <Box>
      <Stack sx={{ mb: 1 }} direction={"row"} justifyContent={"space-between"}>
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
        <Stack alignItems={'center'} gap={2} direction={'row'}>
          {futureDates.map((item)=>{
            return(
              <Badge
              badgeContent={item.items.length}
                key={item.monthname}
                color="error"
              >
                <Button sx={{
                  backgroundColor :(theme)=>item.monthname == selectedFutureDate?.monthname ? theme.palette.warning.light : ''
                }} onClick={()=>{
                  setSelectedFutureDate(item)
                  setItems(item.items)
                }} size="small" variant="contained">{item.monthname}</Button>
              </Badge>
            )
          })}
        </Stack>
        <TextField
        type="search"
          value={search}
          onChange={(e) => {
            searchHandler(e.target.value);
          }}
          label="بحث"
        ></TextField>
      </Stack>
      <TableContainer>
        <Stack direction={'row'} justifyContent={'space-around'}>
        <a href={`${webUrl}excel/items`}>EXCEL</a>
        {selectedFutureDate &&  <a href={`${webUrl}expired/items?firstOfMonth=${selectedFutureDate?.firstofMonth}&lastOfMonth=${selectedFutureDate?.lastofmonth}&monthname=${selectedFutureDate.monthname}&year=${selectedFutureDate.year}`}>Expired</a> }
        </Stack>
      
        <Table dir="rtl" size="small">
          <thead>
            <TableRow>
              <TableCell> الكود</TableCell>
              <TableCell>الاسم العلمي</TableCell>
              <TableCell>الاسم التجاري</TableCell>
              <TableCell>سعر الشراء</TableCell>
              <TableCell>سعر البيع </TableCell>
              <TableCell> عدد الشرائط</TableCell>
              <TableCell> الصلاحيه</TableCell>
              <TableCell> المجموعه</TableCell>
              <TableCell> الشكل</TableCell>
              <TableCell style={{width:'10%',textOverflow:'ellipsis'}} width={'10%'}> الباركود</TableCell>
              <TableCell> -</TableCell>
            </TableRow>
          </thead>
          <tbody>
            {items.map((drug) => {
              console.log(drug, "drug ");
              return (
                <TableRow
                  sx={{
                    color: (theme) => {
                      return !dayjs(drug.expire).isAfter(dayjs())
                        ? theme.palette.error.light
                        : theme.palette.background.defaultLight;
                    },
                    fontWeight: "500",
                  }}
                  key={drug.id}
                >
                  <TableCell>{drug.id}</TableCell>
                  <MyTableCell colName={"sc_name"} item={drug} table="items">
                    {drug.sc_name}
                  </MyTableCell>
                  <MyTableCell
                    colName={"market_name"}
                    item={drug}
                    table="items"
                  >
                    {drug.market_name}
                  </MyTableCell>
                  <MyTableCell
                    sx={{ width: "70px" }}
                    colName={"cost_price"}
                    item={drug}
                    table="items"
                  >
                    {drug.cost_price}
                  </MyTableCell>
                  <MyTableCell
                    sx={{ width: "70px" }}
                    colName={"sell_price"}
                    item={drug}
                    table="items"
                  >
                    {drug.sell_price}
                  </MyTableCell>
                  <MyTableCell colName={"strips"} item={drug} table="items">
                    {drug.strips}
                  </MyTableCell>
                  <TableCell>
                    <MyDateField val={drug.expire} item={drug} />
                  </TableCell>
                  <MyAutoCompeleteTableCell
                    sections={drugCategory}
                    val={drug.category}
                    colName="drug_category_id"
                    item={drug}
                    table="items"
                  >
                    {drug.category?.name}
                  </MyAutoCompeleteTableCell>
                  <MyAutoCompeleteTableCell
                    sections={pharmacyTypes}
                    colName={"pharmacy_type_id"}
                    val={drug.type}
                    item={drug}
                    table="items"
                  >
                    {drug.type?.name}
                  </MyAutoCompeleteTableCell>
                  <MyTableCell  show colName={"barcode"} item={drug} table="items">
                    {drug.barcode}
                  </MyTableCell>
                  <TableCell>
                    {!dayjs(drug.expire).isAfter(dayjs()) ? (
                      <Badge
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        badgeContent={"EX"}
                        color="error"
                      >
                        <LoadingButton
                          loading={loading}
                          onClick={() => {
                            setLoading(true);
                            axiosClient
                              .delete(`items/${drug.id}`)
                              .then(({ data }) => {
                                setItems((prev) => {
                                  return prev.filter(
                                    (item) => item.id !== drug.id
                                  );
                                });
                              })
                              .finally(() => setLoading(false));
                          }}
                          color="error"
                        >
                          <DeleteOutlineOutlined />
                        </LoadingButton>
                      </Badge>
                    ) : (
                     
                        <LoadingButton
                          loading={loading}
                          onClick={() => {
                           let result =   confirm("Are you sure you want to delete")
                           if (result) {
                            setLoading(true);

                            axiosClient
                              .delete(`items/${drug.id}`)
                              .then(({ data }) => {
                                setItems((prev) => {
                                  return prev.filter(
                                    (item) => item.id !== drug.id
                                  );
                                });
                              })
                              .finally(() => setLoading(false));
                           }
                          
                          }}
                          color="error"
                        >
                          <DeleteOutlineOutlined />
                        </LoadingButton>
                   
                    )}
                
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
    {!selectedFutureDate &&  <Grid sx={{ gap: "4px",mt:1 }} container>
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
      </Grid>}
    </Box>
  );
}

export default DrugItems;
