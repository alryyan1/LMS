import { MenuItem, Select, TableCell, TextField } from "@mui/material";
import { useState } from "react";
import { url } from "../constants";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MySelectTableCell({
  myVal,
  item,
  colName,
  table = "items",
  test_id = null,
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
      { colName: colName, val, test_id ,service_id:test_id}
    )
      .then((data) => {
      
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
      {show || edited ? (
        <Select onChange={  changeHandler} onBlur={blurHandler} value={iniVal} sx={{
          '& .MuiSelect-select': {
             paddingRight: 0.5,
             paddingLeft: 0.5,
             paddingTop: 0.5,
             paddingBottom: 0.5,
          }
        }} >
          <MenuItem value = {1}>نعم</MenuItem>
          <MenuItem value={0}>لا</MenuItem>

        </Select>
      ) : (
        iniVal ? 'نعم' :"لا"
      )}
    </TableCell>
  );
}

export default MySelectTableCell;
