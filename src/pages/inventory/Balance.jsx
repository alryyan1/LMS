import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { url } from "../constants.js";
import PDF from "./Pdf.jsx";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import axiosClient from "../../../axios-client.js";

function Balance() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    //fetch all Sections
    // fetch(`${url}items/balance`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     //set Sections
    //     setItems(data);
    //     console.log(data);
    //   });
    axiosClient.get('items/balance').then(({data})=>{
      setItems(data);
      //     console.log(data);
    })
  }, []);
  return (

    
        <>
        {/* <PDFViewer height={400} width={"100%"} >
            <PDF items={items}></PDF>
        </PDFViewer> */}

        <PDFDownloadLink fileName="balance sheet" document={<PDF items={items}></PDF>}>{({ blob, url, loading, error }) =>
        loading ? 'جاري التحميل ...' : 'تنزيل ملف PDF'
      }</PDFDownloadLink>
      <TableContainer>
          <Table dir="rtl" size="small">
            <thead>
              <TableRow>
                <TableCell>رقم</TableCell>
                <TableCell>الاسم</TableCell>
                <TableCell>وحده القياس</TableCell>
                <TableCell>القسم </TableCell>
                <TableCell>رصيد أول المده </TableCell>
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
                  <TableCell>{item.unit_name}</TableCell>
                  <TableCell>{item.section.name}</TableCell>
                  <TableCell>{item.initial_balance}</TableCell>
                  <TableCell>{item.totaldeposit}</TableCell>
                  <TableCell>{item.totaldeduct}</TableCell>
                  <TableCell>{item.remaining}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </>
      

     
  );
}

export default Balance;
