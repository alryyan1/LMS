import {
  Box,
  Divider,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import AutocompleteResultOptions from "../../components/AutocompleteResultOptions";
import OrganismPanel from "./OrganismPanel";
import axiosClient from "../../../axios-client";

function ResultSection({
  selectedTest,
  setShift,
  setActivePatient,
  setSelectedResult,
  selectedReslult,
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
      sx={{mb:1}}
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={handleChange}
        variant="standard"
      >
        <Tab label="Main"></Tab>
        <Tab label="Other"></Tab>
      </Tabs>
      <div
        role="tabpanel"
        hidden={value !== 0}
        id={`simple-tabpanel-${0}`}
        aria-labelledby={`simple-tab-${0}`}
      >
        {value === 0 && (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell width="80%">Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTest &&
                  selectedTest.requested_results.map((req, i) => {
                    console.log(selectedTest, "req result in table");
                    if (req.child_test == null) {
                      return;
                    }
                    return (
                      <TableRow key={req.id}>
                        <TableCell sx={{ p: 0.5, textAlign: "right" }}>
                          {req.child_test?.child_test_name}
                        </TableCell>
                        <TableCell sx={{ p: 0.5 }}>
                          <AutocompleteResultOptions
                            index={i}
                            setShift={setShift}
                            setActivePatient={setActivePatient}
                            setSelectedResult={setSelectedResult}
                            result={req.result}
                            id={req.id}
                            req={req}
                            child_test={req.child_test}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            {selectedReslult && (
              <Box key={selectedReslult.id} sx={{ p: 1, mt: 1 }}>
                <Typography>Normal Range</Typography>
                <TextField
                  onChange={(val) => {
                    axiosClient.patch(
                      `requestedResult/normalRange/${selectedReslult.id}`,
                      { val: val.target.value }
                    );
                  }}
                  multiline
                  fullWidth
                  defaultValue={selectedReslult.normal_range}
                />
              </Box>
            )}
            <Divider />

            {selectedTest && (
              <Box sx={{ p: 1, mt: 1 }}>
                <Typography>Comment</Typography>
                <TextField
                  onChange={(val) => {
                    axiosClient.patch(`comment/${selectedTest.id}`, {
                      val: val.target.value,
                    });
                  }}
                  multiline
                  fullWidth
                  defaultValue={selectedTest.comment}
                />
              </Box>
            )}
          </>
        )}
      </div>
      <div
        role="tabpanel"
        hidden={value !== 1}
        id={`simple-tabpanel-${1}`}
        aria-labelledby={`simple-tab-${1}`}
      >
        {value === 1 && (
          <>
            {" "}
            {selectedTest && (
              <div>
                <OrganismPanel setShift={setShift} selectedTest={selectedTest}></OrganismPanel>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ResultSection;
