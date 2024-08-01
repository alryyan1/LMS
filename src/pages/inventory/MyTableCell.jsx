import { TableCell, TextField } from "@mui/material";
import { useEffect, useState } from "react";
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
  type = null,
  multiline = false,
  child_id = null,
  stateUpdater = null,
  setShift=null,
  sx = null,
  setData=null,
  setSelectedDeposit=null,
  isNum = false,
}) {
  const { setDialog } = useOutletContext();
  const [edited, setEdited] = useState(show);
  const [intial, setInitialVal] = useState(children);
  const [iniVal, setInitVal] = useState(children);
  const clickHandler = () => {
    if (!show) {
      setEdited(true);
    }
  };
  const changeHandler = (e) => {
    console.log("val", e.target.value, "init val", iniVal);

    setInitVal(e.target.value);
  };
  useEffect(() => {

    console.log("useeffect", iniVal);
    const timer = setTimeout(() => {
      updateItemName(iniVal);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [iniVal]);
  const updateItemName = (val) => {
    console.log("update function started");
    if (intial != iniVal) {
      console.log("diffent value");
      axiosClient
        .patch(`${table}/${item.id}`, {
          colName: colName,
          val,
          test_id,
          service_id,
          child_id,
        })
        .then((data) => {
          console.log(data, "data");
          if (data.status) {
            if (setData) {
              console.log(data.data,'inside updater function')
              setData(data.data.data)
              
            }
            if (setShift) {
              setShift(data.data.shift)
            }
            if (stateUpdater) {
            stateUpdater((prev) => prev + 1);
              
            }
            if (setSelectedDeposit) {
              setSelectedDeposit((prev)=>{
                return {...prev, items:prev.items.map((depositItem)=>{
                  if(depositItem.id === item.id){
                    return {...depositItem, quantity:val}
                  }
                  return depositItem
                })};
              })
            }
            setDialog((prev) => {
              return {
                ...prev,
                open: true,
                message: "تم التعديل بنجاح",
                color: "success",
              };
            });
          }
        })
        .catch(({ response: { data, status } }) => {
          if (status == 406) {
            setDialog((prev) => {
              return {
                ...prev,
                open: true,
                color: "error",
                message: data.message,
              };
            });
          }
          if (status == 400) {
            setDialog((prev) => {
              return {
                ...prev,
                open: true,
                color: "error",
                message: data.message,
              };
            });
          }
          
          console.log(data, "err in axios", status);
        });
    }
  };

  const blurHandler = () => {
    setEdited(false);
    // updateItemName(iniVal);
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
      
          multiline={multiline}
         
         sx={sx}
          
          inputProps={{
            style: {
              textAlign: "left",
              // width: "90%",
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
        isNum ? Number(iniVal).toFixed(3) : iniVal
      )}
    </TableCell>
  );
}

export default MyTableCell;
