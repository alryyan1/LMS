import {
  Button,
  Grid,
  Icon,
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
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import MyTableCell from "../inventory/MyTableCell.jsx";
import MyLoadingButton from "../../components/MyLoadingButton.jsx";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddDrugForm from "./AddDrugForm.jsx";
import { AddBusiness } from "@mui/icons-material";

function AddDrug() {
  const navigate = useNavigate();
  const [itemsIsLoading, setItemsIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [search, setSearch] = useState("");
  const [links, setLinks] = useState([]);
  const { setDialog, setItemsTobeAddedToChache } = useOutletContext();
  const [items, setItems] = useState([]);
  const [update, setUpdate] = useState([]);

  const updateItemsTable = (link, setLoading) => {
    // console.log(search);
    setLoading(true);
    axiosClient(`${link.url}&word=${search}`)
      .then(({ data }) => {
        // console.log(data, "pagination data");
        setItems(data.data);
        setLinks(data.links);
      })
      .catch((error) => {
        // console.log(error);
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
    setItemsIsLoading(true);
    const timer = setTimeout(() => {
      axiosClient
        .get(`items/all/pagination/${page}?word=${search}`)
        .then(({ data: { data, links } }) => {
          // console.log(data);
          // console.log(links);
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
        })
        .finally(() => setItemsIsLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page, update]);
  return (
    <Grid container spacing={2}>
      <Grid item lg={7} xs={12} md={12}>
        <Stack
          sx={{ mb: 1 }}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <select
            onChange={(val) => {
              setPage(val.target.value);
            }}
          >
            <option value="5">5</option>
            <option selected value="10">10</option>
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
        {itemsIsLoading ? (
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={400}
          />
        ) : (
          <TableContainer>
            <Table  size="small">
              <thead>
                <TableRow>
                  <TableCell>No </TableCell>
                  <TableCell>Scientific Name</TableCell>
                  <TableCell>Market Name</TableCell>
                  <TableCell> Strips </TableCell>
                  <TableCell> Inventory </TableCell>
                  {/* <TableCell> Expire</TableCell> */}
                </TableRow>
              </thead>
              <tbody>
                {items.map((drug) => {
                  // console.log(drug, "drug ");
                  return (
                    <TableRow key={drug.id}>
                      <TableCell>{drug.id}</TableCell>
                      <MyTableCell
                        colName={"sc_name"}
                        item={drug}
                        table="items"
                      >
                        {drug.sc_name}
                      </MyTableCell>
                      <MyTableCell
                        colName={"market_name"}
                        item={drug}
                        table="items"
                      >
                        {drug.market_name}
                      </MyTableCell>

                      <MyTableCell colName={"strips"} item={drug} table="items">
                        {drug.strips}
                      </MyTableCell>
                      <TableCell>
                        {" "}
                        <IconButton
                          disabled={drug.lastDepositItem != null}
                          size="large"
                          title="add to inventory"
                          onClick={() => {
                            setItemsTobeAddedToChache((prev)=>{
                              return [...prev, drug.id];
                            })
                            navigate(`/pharmacy/deposit/${drug.id}`);
                          }}
                        >
                          <AddBusiness />
                        </IconButton>
                      </TableCell>
                      {/* <TableCell>
                        <MyDateField val={drug.expire} item={drug} />
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          </TableContainer>
        )}
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
      </Grid>
      <Grid item xs={12} md={12} lg={5}>
        <AddDrugForm setUpdate={setUpdate} />
      </Grid>
    </Grid>
  );
}

export default AddDrug;
