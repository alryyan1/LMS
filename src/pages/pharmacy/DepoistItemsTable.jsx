import { Add, ArrowBack, ArrowForward, Delete, RemoveRedEye, SwapHoriz, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  Grid,
  Icon,
  IconButton,
  Pagination,
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
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { blurForNoramlUsers, onlyAdmin, theme, toFixed, webUrl } from "../constants";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyCheckbox from "../../components/MyCheckBox";
import { useOutletContext } from "react-router-dom";
import MyDateField from "../../components/MyDateField";
import MyDateField2 from "../../components/MyDateField2";

import { useStateContext } from "../../appContext";
import ButtonOptions from "./ButtonOptions";
import MyLoadingButton from "../../components/MyLoadingButton";
import ExcelReader from "../../ExcelReader";
import InvoiceSummary from "./InvoiceSummary";

function DepoistItemsTable({
  data,
  setData,
  setLayout,
  change,
  setSelectedDeposit,
  invoiceItems,
  setInvoiceItems,
}) {
  const { setDialog,selectedInvoice:selectedDeposit,excelLoading,links,setLinks,setUpdateSummery,updateSummery } = useOutletContext();
  const {user} = useStateContext()
  console.log(selectedDeposit,'selected Deposit')
  const [ld, setLd] = useState(false);
  const [search, setSearch] = useState('');
  const [loading,setLoading]= useState(false)
  const [summeryIsLoading,setSummeryIsLoading]= useState(false)
  const [page, setPage] = useState(0);
  useEffect(() => {
      if (search != "") {
    
      if (!isNaN(search)) {
        setPage(() => {
          return 0;
        });
        // alert('number search')
        const filtered = data.items.filter((item) => {
          return item.item?.barcode?.trim() == search.trim();
        });
        
        setSelectedDeposit({ ...selectedDeposit, items: filtered })

      } else {
        setSelectedDeposit({
          ...selectedDeposit,
          items: data.items.filter((item) =>
            item.item.market_name.toLowerCase().includes(search?.toLowerCase())
          ),
        })
      
      
      }
    
}}, [search]);


const updateItemsTable = (link, setLoading) => {
  console.log(search);
  setLoading(true);
  axiosClient(`${link.url}&word=${search}`)
    .then(({ data }) => {
      console.log(data, "pagination data");
      setInvoiceItems(data.data);
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


  axiosClient
    .get(`deposit/items/all/pagination/${selectedDeposit.id}?rows=7`)
    .then(({ data: { data, links } }) => {
      console.log(data, "items");
      console.log(links);
      setInvoiceItems(data);
      console.log(links);
      setLinks(links);
    })
    .catch(({ response: { data } }) => {
    });
}, [page]);
useEffect(() => {
  const timer = setTimeout(() => {
    axiosClient
      .get(`deposit/items/all/pagination/${selectedDeposit.id}?word=${search}&rows=7`)
      .then(({ data: { data, links } }) => {
        console.log(data);
        console.log(links,'links');
        setInvoiceItems(data);
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


  // useEffect(() => {
  //   setSummeryIsLoading(true)
  //   axiosClient.get(`depositSummery/${selectedDeposit?.id}`).then(({data})=>{
  //     console.log(data,'data')
  //     setSelectedDeposit(data)
  //   }).finally(()=>setSummeryIsLoading(false))
  // },[updateSummery])
  const deleteIncomeItemHandler = (id) => {
    setLoading(true);
    axiosClient.delete(`depositItem/${id}`).then((data) => {
      if (data.status) {
        setLoading(false);
        setInvoiceItems((prev)=>{
          return prev.filter((item) => item.id!== id)
        })
        //delete supplier by id
        setDialog({
          open: true,
          message: "Delete was successfull",
        });
      }
    });
  };
  return (
    <TableContainer sx={{ height: "80vh", overflow: "auto", p: 1 }}>
      <InvoiceSummary summeryIsLoading={summeryIsLoading} user={user} selectedDeposit={selectedDeposit}/>
      {/* <a href={`${webUrl}pdf?id=${selectedDeposit.id}`}></a> */}

      <Stack
        sx={{ m: 1 }}
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
      >
        <Typography align="center" variant="h5" sx={{ mb: 1 }}>
          {`${selectedDeposit.supplier.name} /  ${selectedDeposit.bill_number}`}
        </Typography>

        <IconButton
          onClick={() => {
            setLayout((prev) => {
              return {
                ...prev,
                showAddtoDeposit: true,
                addToDepositForm: "1fr",
              };
            });
          }}
          title="add item"
          color="success"
        >
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setLayout((prev) => {
              return {
                ...prev,
                showAddtoDeposit: false,
                addToDepositForm: "0fr",
              };
            });
          }}
          title="expand"
          color="success"
        >
          <SwapHoriz />
        </IconButton>
        <TextField
          autoComplete="false"
          placeholder="Barcode/Market name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          label="بحث"
          type="search"
        ></TextField>
  <LoadingButton
          variant="contained"
          loading={ld}
          onClick={() => {
            setLd(true);
            const result = confirm(
              "هل انت متاكد من اضافه كل الاصناف لهذه الفاتوره"
            );
            if (result) {
              axiosClient
                .post(`income-item/bulk/${selectedDeposit.id}`)
                .then(({ data }) => {
                  change(data.deposit);
                  setData(data);
                })
                .finally(() => setLd(false));
            }
          }}
        >
              تعريف الكل  
        </LoadingButton>
<ExcelReader setItems={setInvoiceItems} setSelectedDeposit={setSelectedDeposit} selectedDeposit={selectedDeposit}/>

        <Button
          variant="contained"
          sx={{ m: 1 }}
          href={`${webUrl}pdf?id=${selectedDeposit.id}`}
        >
          pdf
        </Button>
        <LoadingButton
         loading={loading}
            sx={{ mt: 1 }}
            color="inherit"
            title="show patient list"
            size="small"
            onClick={() => {
              setLoading(true)
              axiosClient.patch(`inventory/deposit/update/${selectedDeposit.id}`,{
                colName:'showAll',
                val:!selectedDeposit.showAll
              }).then(({data})=>{
                setSelectedDeposit(data.data)
                axiosClient
                .get(`deposit/items/all/pagination/${selectedDeposit.id}?rows=7`)
                .then(({ data: { data, links } }) => {
                  console.log(data, "items");
                  console.log(links);
                  setInvoiceItems(data);
                  console.log(links);
                  setLinks(links);
                })
                .catch(({ response: { data } }) => {
                }).finally(()=>setLoading(false));
              })
            }}
            variant="contained"
          >
           {selectedDeposit.showAll ? <RemoveRedEye /> : <VisibilityOff/> } 
          </LoadingButton>
      </Stack>
      {excelLoading     ?  <Skeleton width={'100%'} height={'80vh'}/> :
      <>
       <Card sx={{ backgroundColor: "#ffffff73" }}>
        <Table  size="small">
          <thead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Vat(Cost) %</TableCell>
              <TableCell> R.P </TableCell>
              <TableCell> Vat(Sell) % </TableCell>
              <TableCell> R.P + Vat </TableCell>
              <TableCell> Other</TableCell>
              <TableCell>Expire</TableCell>
              <TableCell>Barcode</TableCell>
            </TableRow>
          </thead>

          <TableBody>
            {invoiceItems.filter((depositItem)=>{
                 if (selectedDeposit.showAll == 0){
                  return depositItem.quantity > 0 
                     
              }else{
                return depositItem.quantity == 0
              }
            })
              .map((depositItem, i) => {
                return (
                  <TableRow key={depositItem.id}>
                    <TableCell>
                      <span
                        style={{
                          color: "black",
                          fontSize: "large",
                          fontWeight: "bolder",
                        }}
                      >
                        {depositItem?.item?.market_name.toUpperCase()}
                      </span>
                    </TableCell>
                    <MyTableCell
                      stateUpdater={setUpdateSummery}
                      setDialog={setDialog}
                      sx={{ width: "60px", textAlign: "center" }}
                      show
                      item={depositItem}
                      table="depositItems/update"
                      colName={"quantity"}
                    >
                      {depositItem.quantity}
                    </MyTableCell>
                    <MyTableCell
                      setDialog={setDialog}
                      stateUpdater={setUpdateSummery}
                      show
                      sx={{ width: "60px", textAlign: "center" }}
                      item={depositItem}
                      table="depositItems/update"
                      colName={"cost"}
                    >
                      {depositItem.cost}
                    </MyTableCell>

                    <MyTableCell
                      setDialog={setDialog}
                      stateUpdater={setUpdateSummery}
                      show
                      sx={{ width: "60px", textAlign: "center" }}
                      item={depositItem}
                      table="depositItems/update"
                      colName={"vat_cost"}
                    >
                      {depositItem.vat_cost}
                    </MyTableCell>
                   
                  
                    <MyTableCell
                      setDialog={setDialog}
                      stateUpdater={setUpdateSummery}
                      sx={{ width: "60px", textAlign: "center" }}
                      show
                      item={depositItem}
                      table="depositItems/update"
                      colName={"sell_price"}
                    >
                      {depositItem.sell_price}
                    </MyTableCell>
                    <MyTableCell
                      setDialog={setDialog}
                      stateUpdater={setUpdateSummery}
                      sx={{ width: "60px", textAlign: "center" }}
                      item={depositItem}
                      table="depositItems/update"
                      colName={"vat_sell"}
                    >
                      {toFixed(depositItem.vat_sell, 3)}
                    </MyTableCell>
                    <TableCell>
                      {toFixed(depositItem.finalSellPrice, 3)}
                    </TableCell>


                  
                    <TableCell>
                      <ButtonOptions loading={loading} deleteIncomeItemHandler={deleteIncomeItemHandler} item={depositItem} change={change}  />
                    </TableCell>
                
                    <TableCell>
                      <MyDateField2
                        val={depositItem.expire}
                        item={depositItem}
                      />
                    </TableCell>
                    <MyTableCell
                        show
                        colName={"barcode"}
                        item={depositItem.item}
                        table="items"
                      >
                        {depositItem?.item?.barcode}
                      </MyTableCell>
                  
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Card>
     
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
      </>
     
}
    </TableContainer>
  );
}

export default DepoistItemsTable;
