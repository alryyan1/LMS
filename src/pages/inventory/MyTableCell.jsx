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
            stateUpdater((prev) => prev + 1);
            setDialog((prev) => {
              return {
                ...prev,
                open: true,
                msg: "تم التعديل بنجاح",
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
                msg: data.msg,
              };
            });
          }
          if (status == 400) {
            setDialog((prev) => {
              return {
                ...prev,
                open: true,
                color: "error",
                msg: data.msg,
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
          fullWidth
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
        iniVal
      )}
    </TableCell>
  );
}

export default MyTableCell;
