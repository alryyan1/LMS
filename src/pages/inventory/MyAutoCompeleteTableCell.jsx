import { Autocomplete, TableCell, TextField } from "@mui/material";
import { useState } from "react";
import { url } from "../constants";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MyAutoCompeleteTableCell({
  children,
  item,
  sections,
  colName,
  val,
  table = "items",
  child_id = null,
  stateUpdater = null
}) {
  const [edited, setEdited] = useState(false);
  const { dialog, setDialog } = useOutletContext();
  const [selectedSection, setSelectedSection] = useState(val);
  const clickHandler = () => {
    setEdited(true);
  };
  const changeHandler = (e, newVal) => {
    console.log(newVal, "new val");
    setSelectedSection(newVal);
    console.log(e.target.value, "section id is ");
  };

  const updateItemSectionId = (val) => {
    axiosClient.patch(`${table}/${item.id}`, { colName: colName, val: selectedSection.id ,child_id})
      .then(({data}) => console.log(data)).finally(()=>{
        if (stateUpdater) {
          stateUpdater((prev)=>prev+1)
          
        }
      });
  };

  //  const inputHandler = (e)=>{
  //   console.log(e)
  //   console.log('called')
  //       //check key code
  //       if(e.keyCode === 13){

  //       }
  //  }
  const blurHandler = () => {
    setEdited(false);
    setEdited(false);
    setDialog((prev) => {
      return { ...prev, open: true, msg: "Edit was successfull", color: "success" };
    });
    updateItemSectionId(selectedSection.id);
  };

  return (
    <TableCell onClick={clickHandler}>
      {edited ? (
        <Autocomplete
          fullWidth
          isOptionEqualToValue={(option, value) => {
            // console.log(option,'option',value,"value")
            return option.id === value.id;
          }}
          onBlur={blurHandler}
          value={selectedSection}
          sx={{ mb: 1 }}
          options={sections}
          onChange={changeHandler}
          getOptionLabel={(option) => option.name || ""}
          renderInput={(params) => {
            return <TextField {...params} label="القسم" variant="filled" />;
          }}
        ></Autocomplete>
      ) : (
        selectedSection?.name
      )}
    </TableCell>
  );
}

export default MyAutoCompeleteTableCell;
