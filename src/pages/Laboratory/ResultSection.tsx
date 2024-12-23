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
import { DoctorVisit, Labrequest, RequestedResult } from "../../types/Patient";
interface ResultSectionProps {
  selectedTest: Labrequest;
  setSelectedResult: (prev: any) => void;
  selectedReslult: RequestedResult;
  disabled: boolean;
  resultUpdated:number;
  setActivePatient:(patient:DoctorVisit)=>void
  is_doctor: boolean; // true for doctor, false for patient
}
function ResultSection({
  selectedTest,
  setSelectedResult,
  selectedReslult,
  disabled = false,
  is_doctor = false,
  setActivePatient,
  resultUpdated
}:ResultSectionProps) {
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
            <Table  key={resultUpdated + selectedTest?.id} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell width="70%">Result</TableCell>
                  {/* <TableCell>Normal Range</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTest &&
                  selectedTest.requested_results.map((req, i) => {
                  
                   
                    if (req.child_test == null) {
                      return;
                    }
                    const low = Number( req.child_test.lowest)
                    const max =  Number(req.child_test.max)
                    const result =  Number(req.result)
                    let type = ''
                    if (result !='') {
                        if (low > 0 && max > 0) {
                       if (result < low || result > max) {
                        // alert('err')
                         type='error'
                       }
                    }
                    }
                  
                    return (
                      <TableRow >
                        <TableCell className="" sx={{ p: 0.5, textAlign: "right",backgroundColor:(theme)=> type =='error'? theme.palette.error.light : '' }}>
                          {req.child_test?.child_test_name}
                        </TableCell>
                        <TableCell sx={{ p: 0.5 }}>
                          {is_doctor ? <Typography textAlign={'center'}>{req.result}</Typography> :
                          <AutocompleteResultOptions 
                          setActivePatient={setActivePatient}
                          disabled={disabled}
                          type={type}
                            index={i}
                            setSelectedResult={setSelectedResult}
                            result={req.result}
                            id={req.id}
                            req={req}
                            child_test={req.child_test}
                          />}
                        </TableCell>
                        {/* <TableCell sx={{ p: 0.5 }}> */}
                          {/* {req.normal_range} */}
                        {/* </TableCell> */}
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
                <OrganismPanel setActivePatient={setActivePatient} selectedTest={selectedTest}></OrganismPanel>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ResultSection;
