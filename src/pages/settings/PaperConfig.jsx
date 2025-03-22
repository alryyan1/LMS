import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import CustomCheckBox from "../../components/CustomCheckBox";
function encodeImageFileAsURL(file, colName) {
  var reader = new FileReader();
  reader.onloadend = function () {
    console.log("RESULT", reader.result);
    saveToDb(colName, reader.result);
  };
  reader.readAsDataURL(file);
}
const saveToDb = (colName, data) => {
  axiosClient.post("settings", { colName, data }).then(({ data }) => {
    console.log(data);
  });
};
function PaperConfig() {
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    axiosClient.get("settings").then(({ data }) => {
      console.log(data, "data see");
      setSettings(data);
    });
  }, []);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axiosClient.get("financeAccounts").then(({ data }) => {
      setAccounts(data);
    });
  }, []);
  console.log(settings, "settings are set");
  const handleFileChange = (e, colName) => {
    encodeImageFileAsURL(e.target.files[0], colName);
    const url = URL.createObjectURL(e.target.files[0]);
    console.log(url, "path");
    setSrc(url);
    console.log("upload", e.target.files[0]);
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const image1 = new Image(100, 100);
  image1.src = settings?.header_base64;

  const image2 = new Image(100, 100);
  image2.src = settings?.footer_base64;

  const managerStamp = new Image(100, 100);
  managerStamp.src = settings?.footer_base64;

  const auditorStamp = new Image(100, 100);
  auditorStamp.src = settings?.auditor_stamp;
  console.log(image1);
  return (
    <Grid gap={4} container>
      <Grid item xs={4}>
        <Stack key={settings?.id} gap={1} direction="column">
          <TextField
            defaultValue={settings?.hospital_name}
            sx={{ mb: 1 }}
            label="اسم المستشفي"
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "hospital_name",
                data: e.target.value,
              });
            }}
          />
          <Divider />
          <TextField
            defaultValue={settings?.currency}
            sx={{ mb: 1 }}
            label="العمله "
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "currency",
                data: e.target.value,
              });
            }}
          />
          <Divider />
          <TextField
            defaultValue={settings?.lab_name}
            sx={{ mb: 1 }}
            label="اسم المختبر"
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "lab_name",
                data: e.target.value,
              });
            }}
          />
          <TextField
            defaultValue={settings?.phone}
            sx={{ mb: 1 }}
            label="الهاتف "
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "phone",
                data: e.target.value,
              });
            }}
          />
          <Divider />
          <TextField
            defaultValue={settings?.inventory_notification_number}
            label="رقم هاتف المخزن لارسال الاشعارات"
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "inventory_notification_number",
                data: e.target.value,
              });
            }}
          />
          <Divider />
          <TextField
            defaultValue={settings?.vatin}
            label="vat in"
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "vatin",
                data: e.target.value,
              });
            }}
          />
          <Divider />
          <TextField
            defaultValue={settings?.cr}
            label="cr"
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "cr",
                data: e.target.value,
              });
            }}
          />
          <Divider />
          <TextField
            defaultValue={settings?.email}
            label="email"
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "email",
                data: e.target.value,
              });
            }}
          />
          <Divider />
          <TextField
            defaultValue={settings?.address}
            label="address"
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "address",
                data: e.target.value,
              });
            }}
          />
          <TextField
            defaultValue={settings?.instance_id}
            label="instance_id"
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "instance_id",
                data: e.target.value,
              });
            }}
          />
          <TextField
            defaultValue={settings?.token}
            label="token"
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "token",
                data: e.target.value,
              });
            }}
          />
        </Stack>
      </Grid>
      <Grid xs={3}>
        <Box key={settings?.id} sx={{ p: 1 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.is_header}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "is_header",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={"الترويسه"}
            />
          </FormGroup>
          <Divider />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.country}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "country",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={"الجنسيه"}
            />
          </FormGroup>
          <Divider />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.gov}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "gov",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={"الرقم الوطني"}
            />
          </FormGroup>
          <Divider />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.show_water_mark}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "show_water_mark",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={"العلامه المائيه"}
            />
          </FormGroup>
          <Autocomplete
            size="small"
            onChange={(e, newVal) => {
              console.log(newVal);
              axiosClient.post("settings", {
                colName: "finance_account_id",
                data: newVal.id,
              });
            }}
            getOptionKey={(op) => op.id}
            getOptionLabel={(option) => option.name}
            options={accounts}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"حساب التقديه"} // Use translation
              />
            )}
          />
             <Autocomplete
            size="small"
            onChange={(e, newVal) => {
              console.log(newVal);
              axiosClient.post("settings", {
                colName: "bank_id",
                data: newVal.id,
              });
            }}
            getOptionKey={(op) => op.id}
            getOptionLabel={(option) => option.name}
            options={accounts}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"حساب البنك"} // Use translation
              />
            )}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.edit_result_after_auth}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "edit_result_after_auth",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={"تعديل النتائج بعد التحقيق "}
            />
          </FormGroup>
          <Divider />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.barcode}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "barcode",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={" طباعه باركود مع الايصال"}
            />
          </FormGroup>
          <Divider />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.is_footer}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "is_footer",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={"فوتر"}
            />
          </FormGroup>
          <Divider />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.disable_doctor_service_check}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "disable_doctor_service_check",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={"تعطيل التحقق من خدمات الطبيب"}
            />
          </FormGroup>
          <Divider />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.is_logo}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "is_logo",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={"لوقو"}
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.send_result_after_auth}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "send_result_after_auth",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={"ارسال النتيجه بعد التحقيق"}
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={settings?.send_result_after_result}
                  onChange={(e) => {
                    axiosClient.post("settings", {
                      colName: "send_result_after_result",
                      data: e.target.checked,
                    });
                  }}
                />
              }
              label={"ارسال النتيجه بعد الطباعه"}
            />
          </FormGroup>
          <Divider />
        </Box>
      </Grid>
      <Grid xs={3}>
        <Typography textAlign={"center"} variant="h3">
          {" "}
          Header{" "}
        </Typography>
        <input
          onChange={(e) => {
            handleFileChange(e, "header_base64");
          }}
          type="file"
        ></input>
        {file && (
          <section>
            File details:
            <ul>
              <li>Name: {file.name}</li>
            </ul>
          </section>
        )}
        <img width={100} src={image1.src} alt="" />

        <Divider />
        <Typography textAlign={"center"} variant="h3">
          Footer
        </Typography>

        <input
          onChange={(e) => {
            handleFileChange(e, "footer_base64");
          }}
          type="file"
        ></input>
        {file && (
          <section>
            File details:
            <ul>
              <li>Name: {file.name}</li>
            </ul>
          </section>
        )}
        <img width={100} src={image2.src} alt="" />

        <Divider />
        <Typography textAlign={"center"} variant="h3">
          Manager Stamp
        </Typography>

        <input
          onChange={(e) => {
            handleFileChange(e, "manager_stamp");
          }}
          type="file"
        ></input>
        {file && (
          <section>
            File details:
            <ul>
              <li>Name: {file.name}</li>
            </ul>
          </section>
        )}
        <img width={100} src={managerStamp.src} alt="" />
        <Divider />
        <Typography textAlign={"center"} variant="h3">
          Financial Auditor Stamp
        </Typography>

        <input
          onChange={(e) => {
            handleFileChange(e, "auditor_stamp");
          }}
          type="file"
        ></input>
        {file && (
          <section>
            File details:
            <ul>
              <li>Name: {file.name}</li>
            </ul>
          </section>
        )}
        <img width={100} src={auditorStamp.src} alt="" />
        <Box sx={{ p: 1 }}>
          <TextField
            defaultValue={settings?.header_contentr}
            sx={{ mb: 1 }}
            rows={3}
            label="محتوي الترويسه"
            multiline
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "header_content",
                data: e.target.value,
              });
            }}
          />
          <Divider />
          <TextField
            defaultValue={settings?.footer_content}
            rows={3}
            label="محتوي الفوتر"
            multiline
            fullWidth
            onChange={(e) => {
              axiosClient.post("settings", {
                colName: "footer_content",
                data: e.target.value,
              });
            }}
          />
          <Divider />
        </Box>
      </Grid>
    </Grid>
  );
}

export default PaperConfig;
