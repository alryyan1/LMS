import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
  } from "@mui/material";
  import pic1 from "../../assets/images/1.png";
import pic2 from "../../assets/images/2.png";
import pic3 from "../../assets/images/3.png";
import pic4 from "../../assets/images/4.png";
import pic5 from "../../assets/images/5.png";
import pic6 from "../../assets/images/6.png";
import pic7 from "../../assets/images/7.png";
import printJS from "print-js";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";
const images = [pic1, pic2, pic3, pic4, pic5, pic6, pic7];

  function Collection(props) {
    const { value, index, patient, setDialog, change,complains,setShift, ...other } =
      props;

      const containers = patient?.labrequests.map((req) => {
        return req.main_test.container;
      });
      const filteredContainers = containers?.filter(
        (item, index, array) => array.map((i) => i.id).indexOf(item.id) == index
      );
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Divider sx={{ mb: 1 }} variant="middle">
         Sample Collection
        </Divider>
        {value === index && (
          <Box sx={{ justifyContent: "space-around", m: 1 }} className="">
           
           
          
          {patient && patient.labrequests.length > 0 && (
            <List>
              {patient.labrequests.map((test) => {
                return (
                  <ListItem
                    sx={{
                      "&:hover": {
                        backgroundColor: "lightblue",
                        color: "white",
                      },
                    }}
                    key={test.main_test.id}
                  >
                    <ListItemButton
                     
                    
                    
                    >
                      <ListItemText primary={test.main_test.main_test_name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
         <Paper style={{ backgroundColor: "#ffffff73" }} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
          {filteredContainers?.map((c) => {
            return (
              <img key={c.id} height={300} src={images[c.id - 1]} alt="" />
            );
          })}
        </Paper>
        <LoadingButton
                onClick={() => {
                  axiosClient.get(`patient/barcode/${patient.id}`).then(({data})=>{
                  console.log(data,'barcode')
                  })

                  axiosClient
                    .get(`patient/sampleCollected/${patient.id}`)
                    .then(({ data }) => {
                    //  setShift(data.shift);
                    });
  
                    fetch("http://127.0.0.1:5000/", {
                      method: "POST",
                      headers: {
                        "Content-Type": "APPLICATION/JSON",
                      },

                      body: JSON.stringify(patient),
                    }).then(() => {});
                  axiosClient
                    .get(`printBarcode?pid=${patient.id}&base64=1`)
                    .then(({ data }) => {
                      const form = new URLSearchParams();

                      form.append("data", data);
                      console.log(data, "daa");
                      printJS({
                        printable: data.slice(data.indexOf("JVB")),
                        base64: true,
                        type: "pdf",
                      });

                      // fetch("http://127.0.0.1:4000/", {
                      //   method: "POST",
                      //   headers: {
                      //     "Content-Type": "application/x-www-form-urlencoded",
                      //   },

                      //   body: form,
                      // }).then(() => {});
                    });
                }}
                sx={{ mt: 1 }}
                fullWidth
                variant="contained"
              >
                Print Barcode
              </LoadingButton>
          </Box>
        )}
      </div>
    );
  }
  
  export default Collection;
  