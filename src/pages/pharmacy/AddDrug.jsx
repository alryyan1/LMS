import {
  Grid,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import PharmacyTypeAutocomplete from "../../components/PharmacyType.jsx";
import DrugCategoryAutocomplete from "../../components/DrugCategoryAutocomplete.jsx";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MyTableCell from "../inventory/MyTableCell.jsx";
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell.jsx";
import MyDateField from "../../components/MyDateField.jsx";
import MyLoadingButton from "../../components/MyLoadingButton.jsx";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import AddDrugForm from "./AddDrugForm.jsx";

function AddDrug() {
  const [loading, setLoading] = useState(false);
  const [stripPrice, setStripPrice] = useState(0);
  const [itemsIsLoading, setItemsIsLoading] = useState(false);
  const [page, setPage] = useState(7);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [links, setLinks] = useState([]);
  const [items, setItems] = useState([]);
  const { setDialog, drugCategory, pharmacyTypes } = useOutletContext();

  const {
    register,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
    control,
    reset,
    handleSubmit,
    watch
  } = useForm();

  const sell_price = watch("sell_price");
  const strips = watch("strips");
  useEffect(()=>{
    console.log(typeof sell_price,'type of sellprice')
    console.log(typeof strips,'type of strips')
    if (sell_price  && strips  ) {
      console.log('inside one strip prise')
      setStripPrice((sell_price/strips).toFixed(1))
    }
  },[sell_price,strips])
  useEffect(() => {
    setItemsIsLoading(true);
    //fetch all Items
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
      })
      .finally(() => setItemsIsLoading(false));
  }, [isSubmitted, page]);
  console.log(isSubmitting);
  const submitHandler = async (formData) => {
    const dayJsObj = formData.expire;

    console.log(formData, "formdata");
    setLoading(true);
    axiosClient
      .post(`drugs`, {
        expire: `${dayJsObj.year()}/${dayJsObj.month() + 1}/${dayJsObj.date()}`,
        cost_price: formData.cost_price,
        require_amount: formData.require_amount,
        sell_price: formData.sell_price,
        pharmacy_type_id: formData.pharmacyType?.id,
        drug_category_id: formData.drugCategory?.id,
        barcode: formData.barcode,
        strips: formData.strips,
        sc_name: formData.sc_name,
        market_name: formData.market_name,
        batch: formData.batch,
      })
      .then(({ data }) => {
        console.log(data, "addded drug");
        if (data.status) {
          console.log("success", data);
          setItems((prev) => {
            return [...prev, data.data];
          });
          reset();
          setValue("section", null);
          setLoading(false);
          //show snackbar
          setDialog({
            color: "success",
            open: true,
            message: "تمت الاضافه بنجاح",
          });
        }
      })
      .catch(({ response: { data } }) => {
        setLoading(false);
        console.log(data);
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
    document.title = "اضافه صنف جديد";
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
        {itemsIsLoading ? (
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={400}
          />
        ) : (
          <TableContainer>
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>الاسم العلمي</TableCell>
                  <TableCell>الاسم التجاري</TableCell>
                  <TableCell>سعر الشراء</TableCell>
                  <TableCell>سعر البيع </TableCell>
                  <TableCell> عدد الشرائط</TableCell>
                  <TableCell> الصلاحيه</TableCell>
                </TableRow>
              </thead>
              <tbody>
                {items.map((drug) => {
                  console.log(drug, "drug ");
                  return (
                    <TableRow key={drug.id}>
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
      <AddDrugForm/>
      </Grid>
    </Grid>
  );
}

export default AddDrug;
