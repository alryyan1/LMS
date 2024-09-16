import {
  Badge,
  Box,
  Button,
  Card,
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
import { toFixed, webUrl } from "../constants.js";
import MyDateField2 from "../../components/MyDateField2.jsx";

function DrugItems() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [links, setLinks] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedFutureDate, setSelectedFutureDate] = useState(null);
  const [futureDates, setFutureDates] = useState([]);
  const {
    setDialog,
    drugCategory,
    pharmacyTypes,
    setItems: setDrugs,
  } = useOutletContext();

  useEffect(() => {
    //fetch all Items

    axiosClient.get("expireMonthPanel").then(({ data }) => {
      console.log(data);
      setFutureDates(data.data);
    });
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
  }, [page]);

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
      Notes:Any Change on (Cost , Price , Expire) will Change Latest Invoice Accordingly ///
      Vat will be added to Cost & Retail only if it were included in invoice details
            <Stack sx={{ mb: 1 }} direction={"row"} justifyContent={"space-between"}>
        <select
          onChange={(val) => {
            setPage(val.target.value);
          }}
        >
          <option value="5">5</option>
          <option selected value="10">
            10
          </option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <Stack alignItems={"center"} gap={2} direction={"row"}>
          {futureDates.map((item) => {
            return (
              <Badge
                badgeContent={item.items.length}
                key={item.monthname}
                color="error"
              >
                <Button
                  sx={{
                    backgroundColor: (theme) =>
                      item.monthname == selectedFutureDate?.monthname
                        ? theme.palette.warning.light
                        : "",
                  }}
                  onClick={() => {
                    setSelectedFutureDate(item);
                    setItems(item.items);
                  }}
                  size="small"
                  variant="contained"
                >
                  {item.monthname}
                </Button>
              </Badge>
            );
          })}
        </Stack>
        <a href={`${webUrl}excel/items`}>EXCEL</a>
          {selectedFutureDate && (
            <a
              href={`${webUrl}expired/items?firstOfMonth=${selectedFutureDate?.firstofMonth}&lastOfMonth=${selectedFutureDate?.lastofmonth}&monthname=${selectedFutureDate.monthname}&year=${selectedFutureDate.year}`}
            >
              Expired
            </a>
          )}
        <TextField
          type="search"
          value={search}
          onChange={(e) => {
            searchHandler(e.target.value);
          }}
          label="بحث"
        ></TextField>
      </Stack>
      <TableContainer sx={{ backgroundColor: "#ffffff73" }} component={Card}>
        <Stack direction={"row"} justifyContent={"space-around"}>
        
        </Stack>

        <Table size="small">
          <thead>
            <TableRow>
              <TableCell> code</TableCell>
              {/* <TableCell>الاسم العلمي</TableCell> */}
              <TableCell>M.Name </TableCell>
              <TableCell> Cost</TableCell>
              <TableCell> Retail </TableCell>
              <TableCell> Strips </TableCell>
              <TableCell style={{ width: "10%" }}> Expire </TableCell>
              <TableCell> Barcode </TableCell>
              <TableCell
                style={{ width: "10%", textOverflow: "ellipsis" }}
                width={"10%"}
              >
                {" "}
                Supplier
              </TableCell>
              <TableCell> -</TableCell>
            </TableRow>
          </thead>
          <tbody>
            {items.map((drug) => {
              const expire = drug?.lastDepositItem?.expire ?? null;
              let is_expired = false;
              if (expire != null && !dayjs(expire).isAfter(dayjs())) {
                is_expired = true;
              }
              console.log(drug, "drug ");
              return (
                <TableRow key={drug.id}>
                  <TableCell>{drug.id}</TableCell>
                
                  <MyTableCell
                    colName={"market_name"}
                    item={drug}
                    table="items"
                  >
                    {`${drug?.market_name.toUpperCase()[0]}${drug?.market_name
                      .slice(1)
                      .toLowerCase()}`}
                  </MyTableCell>
                 <MyTableCell
                      setDialog={setDialog}
                      sx={{ width: "60px", textAlign: "center" }}
                      // change={change}
                      item={drug?.lastDepositItem}
                      table="depositItems/update"
                      colName={"cost"}
                      isNum

                    >
                    {drug.lastDepositItem?.finalCostPrice}
                    </MyTableCell>

                  <MyTableCell
                    setDialog={setDialog}
                    sx={{ width: "60px", textAlign: "center" }}
                    // change={change}
                    item={drug?.lastDepositItem}
                    table="depositItems/update"
                    colName={"sell_price"}
                    isNum
                  >
                    {drug.lastDepositItem?.finalSellPrice}
                  </MyTableCell>
                  <MyTableCell colName={"strips"} item={drug} table="items">
                    {drug.strips}
                  </MyTableCell>

                  {/* <MyAutoCompeleteTableCell
                    sections={drugCategory}
                    val={drug.category}
                    colName="drug_category_id"
                    item={drug}
                    table="items"
                  >
                    {drug.category?.name}
                  </MyAutoCompeleteTableCell> */}
                  {/* <MyAutoCompeleteTableCell
                    sections={pharmacyTypes}
                    colName={"pharmacy_type_id"}
                    val={drug.type}
                    item={drug}
                    table="items"
                  >
                    {drug.type?.name}
                  </MyAutoCompeleteTableCell> */}
                  {/* <TableCell>
                    {drug?.lastDepositItem?.expire ?? drug.expire}
                  </TableCell> */}
                  <TableCell>
                    <MyDateField2
                      val={drug?.lastDepositItem?.expire}
                      item={drug?.lastDepositItem}
                    />
                  </TableCell>
                  <MyTableCell
                    show
                    colName={"barcode"}
                    item={drug}
                    table="items"
                  >
                    {drug.barcode}
                  </MyTableCell>
                  <TableCell>
                    {drug?.deposit_item?.deposit?.supplier?.name}
                  </TableCell>
                  <TableCell>
                    <LoadingButton
                      loading={loading}
                      onClick={() => {
                        let result = confirm("Are you sure you want to delete");
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
                              setDrugs((prev) => {
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
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
      {!selectedFutureDate && (
        <Grid sx={{ gap: "4px", mt: 1 }} container>
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
      )}
    </Box>
  );
}

export default DrugItems;
