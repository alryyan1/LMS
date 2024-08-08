import {
  Box,
  Divider,
  List,
  ListItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import PatientEditSelect from "./PatientEditSelect";
import { useState } from "react";

function PresentingComplain(props) {
  const {
    value,
    index,
    patient,
    setDialog,
    setActivePatient,
    complains,
    setShift,
    ...other
  } = props;
  const [showSuggestions, setShowSeggestions] = useState(false);

  const [sentense, setSentense] = useState(patient.present_complains ?? "");
  const arr = ["alryyan", "sara", "tsabeh", "mama"];
  const updateHandler = (val) => {
    axiosClient
      .patch(`patients/${patient.id}`, {
        present_complains: val,
      })
      .then(({ data }) => {
        // console.log(data);
        if (data.status) {
          setActivePatient((prev) => {
            return { ...prev, patient: data.patient };
          });
          setShift((prev) => {
            return {
              ...prev,
              visits: prev.visits.map((v) => {
                if (v.patient_id === patient.id) {
                  return { ...v, patient: data.patient };
                }
                return v;
              }),
            };
          });
          setDialog((prev) => {
            return {
              ...prev,
              message: "Saved",
              open: true,
              color: "success",
            };
          });
        }
      })
      .catch(({ response: { data } }) => {
        console.log(data);
        setDialog((prev) => {
          return {
            ...prev,
            message: data.message,
            open: true,
            color: "error",
          };
        });
      });
  };
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Divider sx={{ mb: 1 }} variant="middle">
        Presenting Complain
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="group">
          <TextField sx={{mb:1}}
            onClick={()=>setShowSeggestions(true)}

            onChange={(e) => {
              setSentense(() => e.target.value);

              updateHandler(e.target.value);
            }}
            value={sentense}
            multiline
            fullWidth
            rows={13}
          ></TextField>
          <List>
            {showSuggestions &&
              sentense.length > 0 &&
              complains
                .filter((w) => {
                  if (String(sentense).lastIndexOf(" ") == -1) {
                    return w.includes(sentense);
                  }
                  if (
                    String(sentense.trim()).slice(
                      String(sentense).lastIndexOf(" ")
                    ).length == 0
                  ) {
                    return false;
                  }
                  // console.log(
                  //   String(sentense.trim())
                  //     .slice(String(sentense).lastIndexOf(" "))
                  //     .trim(),'includes ??',String(sentense).lastIndexOf(" ")
                  // );
                  return w.includes(
                    String(sentense.trim())
                      .slice(String(sentense).lastIndexOf(" "))
                      .trim()
                  );
                })
                .map((w) => {
                  return (
                    <ListItem
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        setSentense((prev) => {
                          updateHandler(
                            `${String(prev).slice(
                              0,
                              prev.lastIndexOf(" ")
                            )} ${w}`
                          );
                          return `${String(prev).slice(
                            0,
                            prev.lastIndexOf(" ")
                          )} ${w}`;
                        });
                      }}
                      key={w}
                    >
                      {w}
                    </ListItem>
                  );
                })}
          </List>
        </Box>
      )}
    </div>
  );
}

export default PresentingComplain;
