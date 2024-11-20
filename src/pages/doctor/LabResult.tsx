import {
  Box,
  Card,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { t } from "i18next";
import ResultSection from "../Laboratory/ResultSection";
import { DoctorVisit, Labrequest } from "../../types/Patient";
interface LabResultsProps {
  value: number;
  index: number;
  patient: DoctorVisit;
  setShift: (shift: any) => void;
}
function LabResults(props:LabResultsProps) {
  const {
    value,
    index,
    patient,
    setShift,
    ...other
  } = props;
  const [selectedTest, setSelectedTest] = useState<Labrequest|null>(null);

  const [selectedReslult, setSelectedResult] = useState(null);
  useEffect(()=>{
    if (patient.patient.labrequests.length > 0) {
      setSelectedTest(patient.patient.labrequests[0]);
    }
  },[])
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Divider sx={{ mb: 1 }} variant="middle">
        Lab Results
      </Divider>
      {value === index && (
        <Grid gap={1} container className="">
          <Grid   style={{ backgroundColor: "#ffffff73" }}  xs={2}>
            <Card   style={{ backgroundColor: "#ffffff73" }} sx={{ height: "80vh", overflow: "auto" }}>
              {patient && patient.patient.labrequests.length > 0 && (
                <List sx={{ direction: "ltr" }}>
                  {patient.patient.labrequests.map((test) => {
                    return (
                      <ListItem
                        onClick={() => {
                          setSelectedTest(test);
                          setSelectedResult(null);
                          console.log(test, "selected test");
                        }}
                        style={
                          selectedTest && selectedTest.id == test.id
                            ? {
                                backgroundColor: "lightblue",
                              }
                            : null
                        }
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "lightblue",
                            color: "white",
                          },
                        }}
                        key={test.main_test.id}
                      >
                        <ListItemText primary={test.main_test.main_test_name} />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card   style={{ backgroundColor: "#ffffff73" }}
              sx={{ height: "80vh", overflow: "auto", p: 1 }}
              key={selectedTest?.id}
            >
              {patient.patient.result_auth ?  (
                <ResultSection 
                is_doctor={true}
                disabled={true}
                  selectedReslult={selectedReslult}
                  selectedTest={selectedTest}
                  setSelectedResult={setSelectedResult}
                  setShift={setShift}
                />
              ):<>
              <Typography textAlign={'center'} variant="h2">RESULT </Typography>
              <Typography textAlign={'center'} variant="h2"> IS NOT </Typography>
              <Typography textAlign={'center'} variant="h3"> AUTHENTICATED</Typography>
              </>}
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default LabResults;
