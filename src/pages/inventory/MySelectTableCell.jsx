import { MenuItem, Select, TableCell, TextField } from "@mui/material";
import { useState } from "react";
import { url } from "../constants";
import { useOutletContext } from "react-router-dom";

function MySelectTableCell({
  myVal,
  item,
  colName,
  table = "items",
  test_id = null,
  show = false,
}) {

  const { setDialog } = useOutletContext();
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
    fetch(`${url}${table}/${item.id}`, {
      headers: { "content-type": "application/json" },
      method: "PATCH",
      body: JSON.stringify({ colName: colName, val, test_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setDialog((prev) => {
            return { ...prev, open: true, msg: "Edit was successfull" };
          });
        }
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
