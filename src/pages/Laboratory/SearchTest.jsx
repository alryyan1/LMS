import * as React from "react";
import AutoComplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import { useOutletContext} from 'react-router-dom'
export default function MyAutoComplete() {
  const [val, setVal] = React.useState(null);
  const {selectTestHandler ,tests,setActiveTestObj} =  useOutletContext()

  return (
    <React.Fragment>
   
        <AutoComplete
        
        size="small"
        color="secondary"
          fullWidth={true}
          sx={{ width: "100%" }}
          options={tests}
          value={val}
          getOptionKey={(option) => option.id}
          getOptionLabel={(option) => option.main_test_name}
          onChange={(e, newValue) => {
            setActiveTestObj(newValue);
            console.log(newValue);
            setVal(newValue);
          }}
          renderInput={(params) => {
            return <TextField   label="Tests" {...params} />;
          }}
        />
      
    </React.Fragment>
  );
}
