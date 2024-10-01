import { Box, Divider, List, ListItem, TextField } from "@mui/material";
import axiosClient from "../../../axios-client";
import { useState } from "react";

function ProvisionalDiagnosis(props) {
  const { value, index, patient, setDialog, setShift, change,diagnosis, ...other } =
    props;
  const [showSuggestions, setShowSeggestions] = useState(false);
  const [sentense, setSentense] = useState(patient.provisional_diagnosis ?? "");
  const updateHandler = (val) => {
    axiosClient
      .patch(`patients/${patient.id}`, {
        provisional_diagnosis: val,
      })
      .then(({ data }) => {
        // console.log(data);
        if (data.status) {
    
          change(data.patient);
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
        Provisional Diagnosis
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
            rows={3}
          ></TextField>
             <List>
            {showSuggestions &&
              sentense.length > 0 &&
              diagnosis
                .filter((w) => {
                  console.log(w,'word ')

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
                  console.log('fiter includes here')
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

export default ProvisionalDiagnosis;
