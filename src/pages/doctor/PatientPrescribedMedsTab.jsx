import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import AddPrescribedDrugAutocomplete from "./AddPrescribedDrugAutocomplete";
import MyTableCell from "../inventory/MyTableCell";
import { DeleteOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { webUrl } from "../constants";
import { useStateContext } from "../../appContext";
import DrugCategoryAutocomplete from "../../components/DrugCategoryAutocomplete";
import MyCustomAutocompleteWithAdditionCababilty from "./MyCustomAutocompleteWithAdditionCababilty";
import { ItemTypes } from "@minoru/react-dnd-treeview";
function PatientPrescribedMedsTab(props) {

  const { value, index, patient, setDialog, change,complains,setShift,activeDoctorVisit,user,items, ...other } =
    props;
  const [loading, setLoading] = useState();
  const [showSuggestions, setShowSeggestions] = useState(false);
  const [drugMedicalRoutes, setDrugMedicalRoutes] = useState([]);
  useEffect(()=>{
    axiosClient.get('drugMedicalRoutes').then(({data})=>{
      setDrugMedicalRoutes(data)
    })
  },[])
  
  const [sentense, setSentense] = useState(patient.prescription_notes ?? "");
  const arr = ["alryyan", "sara", "tsabeh", "mama"];
  const updateHandler = (val)=>{
    axiosClient
    .patch(`patients/${patient.id}`, {
      prescription_notes: val,
    })
    .then(({ data }) => {
      // console.log(data);
      if (data.status) {
      
        change(data.patient)
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
  }
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Divider sx={{ mb: 1 }} variant="middle">
        Prescribed Medicines({items.length})
      </Divider>
      <Button variant="contained" href={`${webUrl}printPrescribedMedsReceipt?doctor_visit=${activeDoctorVisit.id}&user=${user?.id}`}>PDF</Button>

      {value === index && (
        <Box sx={{ justifyContent: "space-around", m: 1 }} className="">
          <AddPrescribedDrugAutocomplete
           items={items}
          setShift={setShift}
          change={change}
            patient={patient}
            setDialog={setDialog}
          />
          <Table sx={{ mt: 1 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Drug Name</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>dlt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patient.prescriptions.map((medicine, i) => (
                <TableRow key={i}>
                  <TableCell>{medicine.item.market_name}</TableCell>
                  <MyTableCell
                    
                    colName={"course"}
                    item={medicine}
                    table="prescribedDrugs"
                  >
                    {medicine.course}
                  </MyTableCell>
                  <TableCell>
                    <MyCustomAutocompleteWithAdditionCababilty  label="method"  updater={change} id={medicine.id}  path={`drugMedicalRoutes/${medicine.id}`} title="add route" object={medicine.medical_drug_route} setRows={setDrugMedicalRoutes} rows={drugMedicalRoutes}/>
                  </TableCell>
                  <MyTableCell
                    
                    colName={"days"}
                    item={medicine}
                    table="prescribedDrugs"
                  >
                    {medicine.days}
                  </MyTableCell>
                  <MyTableCell
                    multiline
                    colName={"note"}
                    item={medicine}
                    table="prescribedDrugs"
                  >
                    {medicine.note}
                  </MyTableCell>
                  <TableCell>
                    <LoadingButton
                      loading={loading}
                      onClick={() => {
                        setLoading(true);
                        axiosClient
                          .delete(`prescribedDrugs/${medicine.id}`)
                          .then(({ data }) => {
                            console.log(data, "delete prescribed drugs data");
                            if (data.status) {
                              change(data.patient)
                              setDialog((prev) => {
                                return {
                                  ...prev,
                                  open: true,
                                  color: "success",
                                  message: "Medicine deleted successfully",
                                };
                              });
                            }
                          })
                          .finally(() => setLoading(false));
                      }}
                    >
                      <DeleteOutline />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Divider />
          <TextField
            
          // onBlur={()=>setShowSeggestions(false)}
            onClick={()=>setShowSeggestions(true)}
            onChange={(e) => {
               
              setSentense(() => e.target.value);
              updateHandler(e.target.value)
              // console.log(
              //   String(e.target.value).slice(
              //     String(e.target.value).lastIndexOf(" ")
              //   ),
              //   "sliced"
              // );
              // const word = arr.filter((w) =>
              //   w.includes(
              //     String(e.target.value)
              //       .slice(String(e.target.value).lastIndexOf(" "))
              //       .trim()
              //   )
              // )[0];
              // console.log(word, "word first match");
              // if (word) {
              //   alert(word);
              //   setSentense(
              //     (prev) =>
              //       `${String(prev).slice(0, prev.lastIndexOf(" "))} ${word}`
              //   );
              // }
             
            }}
            color="info"
            value={sentense}
            sx={{ mt: 3 }}
            label="Notes"
            fullWidth
            multiline
            rows={5}
          ></TextField>
          <List>
            {showSuggestions && sentense.length > 0 && complains
              .filter((w) => {
                if (String(sentense).lastIndexOf(" ") == -1) {
                  return  w.includes(sentense)
                }
                if ( String(sentense.trim())
                  .slice(String(sentense).lastIndexOf(" ")).length  == 0 ) {
                  return false;
                }
                // console.log(
                //   String(sentense.trim())
                //     .slice(String(sentense).lastIndexOf(" "))
                //     .trim(),'includes ??',String(sentense).lastIndexOf(" ")
                // );
             return   w.includes(
                  String(sentense.trim())
                    .slice(String(sentense).lastIndexOf(" "))
                    .trim()
                );
              })
              .map((w) => {
                return <ListItem sx={{cursor:'pointer'}} onClick={()=>{
                  setSentense(
                        (prev) =>
                          {
                            updateHandler(`${String(prev).slice(0, prev.lastIndexOf(" "))} ${w}`)
                           return `${String(prev).slice(0, prev.lastIndexOf(" "))} ${w}`
                          }
                      );
                     
                }} key={w}>{w}</ListItem>;
              })}
          </List>
        </Box>
      )}
    </div>
  );
}

export default PatientPrescribedMedsTab;
