import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosClient from "../axios-client";
import { useOutletContext } from "react-router-dom";

const ExcelReader = ({setItems}) => {
  const [data, setData] = useState([]);
  const {excelLoading,setExeclLoading,selectedInvoice,links,setLinks,updateSummery,setUpdateSummery} = useOutletContext()
  if (data.length > 0) {
    console.log(Object.keys(data[0]),'object')
    console.log(Object.keys(data[0]).length,'length')

    
    console.log(Object.values(data),'data')
  }
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Reading the first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log(jsonData,'jsonData')
      setData(jsonData);
      console.log('true')
      setExeclLoading(true)
      axiosClient.post(`uploadExcelToDeposit/${selectedInvoice.id}`,{
        jsonData
      }).then(({data})=>{
          console.log(data,'data of upload')
          setUpdateSummery((prev)=>prev+1)
          setItems(data.data.data)
          setLinks(data.data.links.map((link)=>{
            return {...link,url:String(link.url).replace(`uploadExcelToDeposit`,'deposit/items/all/pagination')}
          }))
      }).finally(()=>setExeclLoading(false))
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {/* {data.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )} */}
    </div>
  );
};

export default ExcelReader;
