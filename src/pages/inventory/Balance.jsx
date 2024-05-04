import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { url } from "../constants.js";
import PDF from "./Pdf.jsx";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import axiosClient from "../../../axios-client.js";
import MyLoadingButton from "../../components/MyLoadingButton.jsx";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

function Balance() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState(null);
  const [links, setLinks] = useState([]);

  const updateBalanceTable = (link,setLoading)=>{
    console.log(search)
    setLoading(true)
   fetch(link.url,{
     method:  'POST',
     headers:{
       'Content-Type':'application/json'
     },
     body:search ?  JSON.stringify({word:search}):null
   }).then((res)=>{
     return res.json()
   }).then(({data,links})=>{
    console.log(data,links)
    setItems(data)
    setLinks(links)
   }).finally(()=>{
    setLoading(false)
   })
  }
  useEffect(() => {

    axiosClient.post('items/all/balance/paginate',{"word":""}).then(({data:{data,links}})=>{
      console.log(data,'items data')
      console.log(links)
      setItems(data)
  ///    setItems(data)
      // console.log(links)
     setLinks(links)
     })
  }, []);
  const searchHandler = (word)=>{
    setSearch(word)
  }
  useEffect(()=>{
   const timer =  setTimeout(()=>{
    axiosClient.post('items/all/balance/paginate',{"word":search}).then(({data:{data,links}})=>{
      console.log(data)
      console.log(links)
      setItems(data)
  ///    setItems(data)
      // console.log(links)
     setLinks(links)
     })
    },300)
    return ()=>{
      clearTimeout(timer)
    }
   
  },[search])
  return (

    
        <>
      
      <TableContainer>
      <a
              href={`http://127.0.0.1/laravel-react-app/public/balance`}
            >
              pdf
            </a>
        <div style={{textAlign:'right',marginBottom:"5px"}}>
        <TextField value={search} onChange={(e)=>{
              searchHandler(e.target.value)
            }} label='بحث'></TextField>
        </div>
   
          <Table dir="rtl" size="small">
            <thead>
              <TableRow>
                <TableCell>رقم</TableCell>
                <TableCell>الاسم</TableCell>
                <TableCell> رصيد اول المده</TableCell>
                <TableCell>   سعر الوحده</TableCell>
                <TableCell> الاجمالي </TableCell>
                <TableCell>القسم </TableCell>
                <TableCell> الحد الادني</TableCell>
                <TableCell>الوارد</TableCell>
                <TableCell>المنصرف </TableCell>
                <TableCell>الرصيد </TableCell>
              </TableRow>
            </thead>

            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.initial_balance}</TableCell>
                  <TableCell>{item.initial_price}</TableCell>
                  <TableCell>{item.initial_price * item.initial_balance}</TableCell>
                  <TableCell>{item.section.name}</TableCell>
                  <TableCell>{item.require_amount}</TableCell>
                  <TableCell>{item.totaldeposit}</TableCell>
                  <TableCell>{item.totaldeduct}</TableCell>
                  <TableCell>{item.remaining + item.initial_balance }</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Grid sx={{gap:'4px',mt:1}} container>
                    {links.map((link,i)=>{
                      if (i==0) {
                        return  <Grid item xs={1} key={i}><MyLoadingButton onClick={(setLoading)=>{
                         
                          updateBalanceTable(link,setLoading)
                        }} variant="contained" key={i}><ArrowBackIos/></MyLoadingButton></Grid>
                      }else if(links.length - 1 == i){
                        return  <Grid item xs={1} key={i}><MyLoadingButton  onClick={(setLoading)=>{
                          updateBalanceTable(link,setLoading)
                        }} variant="contained" key={i}><ArrowForwardIos/></MyLoadingButton></Grid>

                      }else
                      return(
                        <Grid  item xs={1} key={i}><MyLoadingButton active={link.active} onClick={(setLoading)=>{
                          updateBalanceTable(link,setLoading)
                        }}>{link.label}</MyLoadingButton></Grid>
                      )
                    })}
            </Grid>
        </TableContainer>
        </>
      

     
  );
}

export default Balance;
