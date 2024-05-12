import { TableCell, TextField } from "@mui/material";
import { useState } from "react";
import { url } from "../constants";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MyTableCell({
  children,
  item,
  colName,
  table = "items",
  test_id = null,
  show = false,
  service_id = null,
  type=null
}) {
  const { setDialog } = useOutletContext();
  const [edited, setEdited] = useState(show);
  const [iniVal, setInitVal] = useState(children);
  const clickHandler = () => {
    if (!show) {
      setEdited(true);
    }
  };
  const changeHandler = (e) => {


    
    console.log("val", e.target.value, "init val", iniVal);

    console.log(e.target.value);
    setInitVal(e.target.value);
    updateItemName(e.target.value);
  };

  const updateItemName = (val) => {
    console.log("val", val, "init val", iniVal);
    if (val != iniVal) {
      console.log("diffent value");
      axiosClient.patch(`${table}/${item.id}`,{ colName: colName, val, test_id ,service_id})
        .then((data) => {
          console.log(data,'data')
          if (data.status) {
            setDialog((prev) => {
              return { ...prev, open: true, msg: "تم التعديل بنجاح",color:'success' };
            });
          }
        
        }).catch(({response:{data,status}})=>{
          if (status == 406) {
            setDialog((prev)=>{
              return {
               ...prev,
                open: true,
                color: "error",
                msg: data.msg,
              };
            })
          }
          console.log(data,'err in axios',status)
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
      onFocus={(event) => {
        event.target.select();
      }}
      onClick={clickHandler}
    >
      {show || edited ? (
        <TextField
          
          inputProps={{
            style: {
              textAlign:'center',
              width: "90%",
              padding: 0,
            },
          }}
          autoFocus={!show}
          onBlur={blurHandler}
          onChange={changeHandler}
          value={iniVal}
          type={type}
        ></TextField>
      ) : (
        iniVal
      )}
    </TableCell>
  );
}

export default MyTableCell;
