import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import { ArrowBack, ArrowForward, DeleteOutline, DeleteOutlineOutlined, ShoppingCart } from "@mui/icons-material";
import dayjs from "dayjs";
import { Item, toFixed, webUrl } from "../constants.js";
import MyDateField2 from "../../components/MyDateField2.jsx";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MyTableCell from "../inventory/MyTableCell.jsx";
import MyLoadingButton from "../../components/MyLoadingButton.jsx";
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell.jsx";

function DrugItems() {
  const {
    setDialog,
    drugCategory,
    pharmacyTypes,
    setItems: setDrugs,
    itemsIsLoading,
  } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [links, setLinks] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedFutureDate, setSelectedFutureDate] = useState(null);
  const [futureDates, setFutureDates] = useState([]);

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
    //fetch all Items

    axiosClient.get("expireMonthPanel").then(({ data }) => {
      console.log(data);
      setFutureDates(data.data);
    });

  }, []);
 const idIncomingFromSellPage =  useParams()

  useEffect(() => {
    const timer = setTimeout(() => {
  const queryByById = idIncomingFromSellPage.id ? `&id=${idIncomingFromSellPage.id}`:''

      axiosClient
        .get(`items/all/pagination/${page}?word=${search}${queryByById}`)
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


  const searchHandler = (word) => {
    setSearch(word);
  };
  const navigate = useNavigate()
  return (
    <Box>
      
      Notes:Any Change on (Cost , Price , Expire) will Change Latest Invoice
      Accordingly /// Vat will be added to Cost & Retail only if it were
      included in invoice details
      <Stack sx={{ mb: 1 }} direction={"row"} justifyContent={"space-between"}>
      <Item>
            <IconButton
              onClick={() => {
                navigate("/pharmacy/sell");
              }}
              title="POS"
            >
              <ShoppingCart />
            </IconButton>
          </Item>
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
   
       
          <TableContainer
            sx={{ backgroundColor: "#ffffff73" }}
            component={Card}
          >
            <Stack direction={"row"} justifyContent={"space-around"}></Stack>

            <Table size="small">
              <thead>
                <TableRow>
                  <TableCell> code</TableCell>
                  {/* <TableCell>الاسم العلمي</TableCell> */}
                  <TableCell>M.Name </TableCell>
                  <TableCell>الاسم بالانجليزي </TableCell>
                  {/* <TableCell>Pack size </TableCell> */}
                  {/* <TableCell>Active 1 </TableCell> */}
                  {/* <TableCell>Active 2 </TableCell> */}
                  <TableCell> Cost</TableCell>
                  <TableCell> Retail </TableCell>
                  {/* <TableCell> Strips </TableCell> */}
                  {/* <TableCell> Unit </TableCell> */}
                  {/* <TableCell> Category </TableCell> */}
                  {/* <TableCell style={{ width: "10%" }}> Expire </TableCell> */}
                  {/* <TableCell> Barcode </TableCell> */}
                  {/* <TableCell
                    style={{ width: "10%", textOverflow: "ellipsis" }}
                    width={"10%"}
                  >
                    {" "}
                    Supplier
                  </TableCell> */}
                  {/* <TableCell> -</TableCell> */}
                </TableRow>
              </thead>
              <tbody>
                {items.map((drug) => {
                 
                  // console.log(drug, "drug ");
                  return (
                    <TableRow key={drug.id}>
                      <TableCell>{drug.id}</TableCell>

                      <MyTableCell
                        colName={"market_name"}
                        item={drug}
                        table="items"
                      >
                        {`${
                          drug?.market_name.toUpperCase()[0]
                        }${drug?.market_name.slice(1).toLowerCase()}`}
                      </MyTableCell>
                      <MyTableCell
                        colName={"sc_name"}
                        item={drug}
                        table="items"
                      >
                    
                          {drug?.sc_name}
                        
                      </MyTableCell>
                      
                      {/* <TableCell>
                      {`${drug?.pack_size}`}

                      </TableCell>
                      <MyTableCell
                        colName={"active1"}
                        item={drug}
                        table="items"
                      >
                        {`${drug?.active1}`}
                      </MyTableCell>
                      <MyTableCell
                        colName={"active2"}
                        item={drug}
                        table="items"
                      >
                        {`${drug?.active2}`}
                      </MyTableCell> */}
                      <MyTableCell
                        disabled={drug?.last_deposit_item == null }
                        setDialog={setDialog}
                        sx={{ width: "60px", textAlign: "center" }}
                        // change={change}
                        item={drug?.last_deposit_item}
                        table="depositItems/update"
                        colName={"cost"}
                        isNum
                      >
                        {drug.last_deposit_item?.finalCostPrice ?? 0}
                      </MyTableCell>

                      <MyTableCell
                       disabled={drug?.last_deposit_item == null }
                        setDialog={setDialog}
                        sx={{ width: "60px", textAlign: "center" }}
                        // change={change}
                        item={drug?.last_deposit_item}
                        table="depositItems/update"
                        colName={"sell_price"}
                        isNum
                      >
                        {drug.last_deposit_item?.finalSellPrice ?? 0}
                      </MyTableCell>
                      {/* <MyTableCell colName={"strips"} item={drug} table="items">
                        {drug.strips}
                      </MyTableCell> */}

                   
          {/* <TableCell> */}
          {/* <MyAutoCompeleteTableCell
            sections={pharmacyTypes}
            colName={"pharmacy_type_id"}
            val={drug.type}
            item={drug}
            table="items"
          >
            {drug.type?.name}
          </MyAutoCompeleteTableCell> */}
          {/* </TableCell> */}
             {/* <MyAutoCompeleteTableCell  */}
            {/* sections={drugCategory}
            val={drug.category}
            colName="drug_category_id"
            item={drug}
            table="items"
          > }
            {/* {drug.category?.name}
          </MyAutoCompeleteTableCell> 
                       }
                      {/* <TableCell>
            {drug?.last_deposit_item?.expire ?? drug.expire}
          </TableCell> */}
                      {/* <TableCell>
                        <MyDateField2 disabled={drug?.last_deposit_item == null}
                          val={drug?.last_deposit_item?.expire ?? drug.expire}
                          item={drug?.last_deposit_item}
                        />
                      </TableCell> */}
                      {/* <MyTableCell
                        show
                        colName={"barcode"}
                        item={drug}
                        table="items"
                      >
                        {drug.barcode}
                      </MyTableCell> */}
                      {/* <TableCell>
                        {drug?.deposit_item?.deposit?.supplier?.name}
                      </TableCell> */}
                      {/* <TableCell>
                        <LoadingButton
                          loading={loading}
                          onClick={() => {
                            let result = confirm(
                              "Are you sure you want to delete"
                            );
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
                      </TableCell> */}
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
                    <ArrowBack />
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
      )}
          {/* <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            rows={items}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5,10,20,50]}
            checkboxSelection
            disableRowSelectionOnClick
          /> */}
       
    </Box>
  );
}

export default DrugItems;
