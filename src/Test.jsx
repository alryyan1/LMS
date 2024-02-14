import * as React from "react";
import AutoComplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
const doctors = ["alryyan", "tsabeh"];
export default function MyAutoComplete({ tests, selectTestHandler }) {
  const [val, setVal] = React.useState(null);

  return (
    <React.Fragment>
      {tests.length > 0 ? (
        <AutoComplete
          sx={{ width: "200px" }}
          options={tests}
          value={val}
          getOptionKey={(option) => option.id}
          getOptionLabel={(option) => option.main_test_name}
          onChange={(e, newValue) => {
            selectTestHandler(newValue);
            console.log(newValue);
            setVal(newValue);
          }}
          renderInput={(params) => {
            return <TextField label="doctors" {...params} />;
          }}
        />
      ) : (
        ""
      )}
    </React.Fragment>
  );
}
