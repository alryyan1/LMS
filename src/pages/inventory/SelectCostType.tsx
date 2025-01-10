import { MenuItem, Select, TableCell, TextField } from "@mui/material";
import { useState } from "react";
import { url } from "../constants";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MyServiceCostTableCell({
  myVal,
  item,
  colName,
  update,
  table = "items",

  show = false,
}) {

  const [edited, setEdited] = useState(show);
  const [iniVal, setInitVal] = useState(myVal);
  const clickHandler = () => {
    if (!show) {
      setEdited(true);
    }
  };
  const changeHandler = (e) => {
    console.log('val' ,e.target.value , 'init val',iniVal)

    console.log(e.target.value);
    setInitVal(e.target.value);
    updateItemName(e.target.value)
  };

  const updateItemName = (val) => {
    console.log('val' ,val , 'init val',iniVal)
    if (val != iniVal ) {
      console.log('diffent value')
    axiosClient.patch(`${table}/${item.id}`, 
      { [colName]: val}
    )
      .then(({data}) => {
        update(data.service)
      });
    }

  };

  const blurHandler = () => {
    setEdited(false);
    // updateItemName(iniVal);
    setEdited(false);
  };

  return (
    <TableCell
   
      onClick={clickHandler}
    >
        <Select onChange={  changeHandler} onBlur={blurHandler} value={iniVal} sx={{
          '& .MuiSelect-select': {
             paddingRight: 0.5,
             paddingLeft: 0.5,
             paddingTop: 0.5,
             paddingBottom: 0.5,
          }
        }} >
          <MenuItem value = {'total'}>من الاجمالي</MenuItem>
          <MenuItem value={'after cost'}>بعد المصروف</MenuItem>

        </Select>
   
    </TableCell>
  );
}

export default MyServiceCostTableCell;
