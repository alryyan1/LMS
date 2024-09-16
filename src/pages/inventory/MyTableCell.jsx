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
  change=null,
  isNum = false,
  setDialog= null,
  setDeposit=null
}) {
  const [edited, setEdited] = useState(show);
  const [intial, setInitialVal] = useState(children);
  const [iniVal, setInitVal] = useState(children);
  const clickHandler = () => {
    if (!show) {
      setEdited(true);
    }
  };
  const changeHandler = (e) => {
    // console.log("val", e.target.value, "init val", iniVal);

    setInitVal(e.target.value);
  };
  useEffect(() => {

    // console.log("useeffect", iniVal);
    const timer = setTimeout(() => {
      updateItemName(iniVal);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [iniVal]);
  const updateItemName = (val) => {
    // console.log("update function started");
    if (intial != iniVal) {
      // console.log("diffent value");
      axiosClient
        .patch(`${table}/${item.id}`, {
          colName: colName,
          val,
          test_id,
          service_id,
          child_id,
        })
        .then((data) => {
          // console.log(data, "data");
          if (data.status) {
            if (setData) {
              // console.log(data.data,'inside updater function')
              setData(data.data.data)
              
            }
            if (setShift) {
              setShift(data.data.shift)
            }
            if (stateUpdater) {
            stateUpdater((prev) => prev + 1);
              
            }
            if (change) {
              change(data.data.deposit)
            }
         
            if(setDialog){
              // alert('d')
                setDialog((prev) => {
              return {
                ...prev,
                open: true,
                message: "Edit was successfull",
                color: "success",
              };
            });
            }
          
          }
        })
        .catch(({ response: { data, status } }) => {
          if (status == 406) {
            if (setDialog) {
               setDialog((prev) => {
              return {
                ...prev,
                open: true,
                color: "error",
                message: data.message,
              };
            });
            }
           
          }
          if (status == 400) {
            if (setDialog) {
               setDialog((prev) => {
              return {
                ...prev,
                open: true,
                color: "error",
                message: data.message,
              };
            });
            }
           
          }
          
          // console.log(data, "err in axios", status);
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
        isNum ? <span style={{    
          color: "black",
          fontSize: "large",
          fontWeight: "bolder",
        }}>{Number(iniVal).toFixed(3)} </span> : <span  style={{    
          color: "black",
          fontSize: "16px",
          fontWeight: "bolder",
        }}>{iniVal}</span>
      )}
    </TableCell>
  );
}

export default MyTableCell;
