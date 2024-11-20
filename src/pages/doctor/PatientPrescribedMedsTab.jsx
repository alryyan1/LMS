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
import printJS from "print-js";
function PatientPrescribedMedsTab(props) {

  const { value, index, patient, setDialog, setActiveDoctorVisit,complains,setShift,activeDoctorVisit,user,items,userSettings, ...other } =
    props;
  const [loading, setLoading] = useState();
  const [drugMedicalRoutes, setDrugMedicalRoutes] = useState([]);
  useEffect(()=>{
    axiosClient.get('drugMedicalRoutes').then(({data})=>{
      setDrugMedicalRoutes(data)
    })
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
        Prescribed Medicines({items.length})
      </Divider>
      <Button onClick={()=>{
         const form = new URLSearchParams();
         axiosClient
           .get(`printPrescribedMedsReceipt?doctor_visit=${activeDoctorVisit.id}&user=${user.id}&base64=1`)
           .then(({ data }) => {
             form.append("data", data);
             form.append("node_direct", userSettings.node_direct);
             // console.log(data, "daa");
             if (userSettings?.web_dialog) {
               printJS({
                 printable: data.slice(data.indexOf("JVB")),
                 base64: true,
                 type: "pdf",
               });
             }
             if (userSettings?.node_dialog) {
               fetch("http://127.0.0.1:4000/", {
                 method: "POST",
                 headers: {
                   "Content-Type": "application/x-www-form-urlencoded",
                 },

                 body: form,
               }).then(() => {});
             }
           });
      }} variant="contained">PDF</Button>
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
                    show
                    colName={"course"}
                    item={medicine}
                    table="prescribedDrugs"
                  >
                    {medicine.course}
                  </MyTableCell>
                  <TableCell>
                    <MyCustomAutocompleteWithAdditionCababilty  label="method"  updater={setActiveDoctorVisit} id={medicine.id}  path={`drugMedicalRoutes/${medicine.id}`} title="add route" object={medicine.medical_drug_route} setRows={setDrugMedicalRoutes} rows={drugMedicalRoutes}/>
                  </TableCell>
                  <MyTableCell
                    show
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
                              setActiveDoctorVisit(data)
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
        
        </Box>
      )}
    </div>
  );
}

export default PatientPrescribedMedsTab;
