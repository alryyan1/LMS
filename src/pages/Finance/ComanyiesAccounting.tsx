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
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyLoadingButton from "../../components/MyLoadingButton";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

function CompanyAccountingLink() {
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(5);
  const { setDialog } = useOutletContext();
  const [accounts, setAccounts] = useState([]);

  const searchHandler = (word) => {
    setSearch(word);
    axiosClient
      .get(`company/all/pagination/${page}?word=${word}`)
      .then(({ data: { data, links } }) => {
        console.log(data);
        console.log(links);
        setCompanies(data);
        // console.log(links)
        setLinks(links);
      });
  };
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
        // setItems(data)
        // setLinks(links)
        setLoading(false);
      })
      .finally(() => {});
  };
  //create state variable to store all Items
  const submitHandler = (data) => {
    setLoading(true);

    console.log(data, "submitted data");
    axiosClient
      .post("company/create", data)
      .then((data) => {
        if (data.status) {
          setLoading(false);
          reset();
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
        setDialog((prev) => {
          return { ...prev, open: true, message: data.message, color: "error" };
        });
      })
      .finally(() => {});
  };
    useEffect(() => {
      //fetch all Accounts
      axiosClient(`financeAccounts`).then(({ data }) => {
        setAccounts(data);
        console.log(data, "accounts");
      });
    }, []);
  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);
  useEffect(() => {
    console.log("start of use effect");
    //fetch all Items
    axiosClient
      .get(`company/all/pagination/${page}`)
      .then(({ data: { data, links } }) => {
        console.log(data, "companies");
        console.log(links);
        setCompanies(data);
        console.log(links);
        setLinks(links);
      })
      .catch((error) => console.log(error));
  }, [page, isSubmitting]);

  return (
    <Stack direction={"row"} gap={3}>
      {loading ? (
        <Skeleton height={400} style={{ flexGrow: "2" }}></Skeleton>
      ) : (
        <div style={{ flexGrow: "1" }}>
          <TableContainer sx={{ mb: 1 }}>
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
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <TextField
                size="small"
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
                  <TableCell>رقم</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>الحساب </TableCell>
                </TableRow>
              </thead>
              <TableBody>
                {companies.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <MyTableCell table="company" colName={"name"} item={item}>
                      {item.name}
                    </MyTableCell>
                    <TableCell>
                      <Autocomplete
                        value={item.account}
                        onChange={(e, newVal) => {
                          axiosClient.patch(`company/${item.id}`, {
                            colName: "finance_account_id",
                            val: newVal.id,
                          });
                        }}
                        getOptionKey={(op) => op.id}
                        getOptionLabel={(option) => option.name}
                        options={accounts}
                        renderInput={(params) => (
                          <TextField {...params} label="حساب " />
                        )}
                      />
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
        </div>
      )}
    </Stack>
  );
}

export default CompanyAccountingLink;
