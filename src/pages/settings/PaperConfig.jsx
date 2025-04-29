import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  PhotoCamera,
  Image as ImageIcon,
  Description,
} from "@mui/icons-material";
import axiosClient from "../../../axios-client";
import FinancialYearSelector from "./FinancialYearSelector";

const ImageUploadSection = ({ label, currentImage, onFileChange, colName }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      onFileChange(e, colName);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardHeader
        title={label}
        avatar={
          <Avatar>
            <ImageIcon />
          </Avatar>
        }
      />
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="primary" component="label">
              <PhotoCamera />
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileSelect}
              />
            </IconButton>
            <Typography variant="body2">رفع صورة جديدة</Typography>
          </Box>

          {(previewImage || currentImage) && (
            <Box sx={{ border: "1px dashed #ccc", p: 1, borderRadius: 1 }}>
              <img
                src={previewImage || currentImage}
                alt={label}
                style={{ maxWidth: "100%", maxHeight: 150 }}
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const SettingsTextField = ({ label, defaultValue, colName, ...props }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    axiosClient.post("settings", { colName, data: newValue });
  };

  return (
    <TextField
      label={label}
      value={value || ""}
      onChange={handleChange}
      fullWidth
      margin="normal"
      {...props}
    />
  );
};

const SettingsCheckbox = ({ label, defaultChecked, colName }) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setChecked(newValue);
    axiosClient.post("settings", { colName, data: newValue });
  };

  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={handleChange} />}
      label={label}
    />
  );
};

const AccountSelect = ({ label, value, accounts, colName }) => {
  const handleChange = (e, newVal) => {
    axiosClient.post("settings", { colName, data: newVal?.id || null });
  };

  return (
    <Autocomplete
      value={value}
      size="small"
      onChange={handleChange}
      getOptionKey={(op) => op.id}
      getOptionLabel={(option) => option.name}
      options={accounts}
      renderInput={(params) => (
        <TextField {...params} label={label} margin="normal" />
      )}
    />
  );
};

const encodeImageFileAsURL = (file, colName) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    saveToDb(colName, reader.result);
  };
  reader.readAsDataURL(file);
};

const saveToDb = (colName, data) => {
  axiosClient.post("settings", { colName, data });
};

function PaperConfig() {
  const [settings, setSettings] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState({
    finance: null,
    company: null,
    bank: null,
    endurance: null,
    mainBank: null,
    mainCash: null,
    pharmacy_cash: null,
    pharmacy_bank: null,
    pharmacy_income: null,
  });

  const handleFinancialYearChange = async (dates) => {
    console.log(dates, "dates");
    try {
      await axiosClient.post("settings", {
        colName: "financial_year_start",
        data: dates.financial_year_start,
      });
      await axiosClient.post("settings", {
        colName: "financial_year_end",
        data: dates.financial_year_end,
      });
      setSettings((prev) => ({
        ...prev,
        fiscal_year_start: dates.fiscal_year_start,
        fiscal_year_end: dates.fiscal_year_end,
      }));
    } catch (error) {
      console.error("Error updating fiscal year:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsResponse = await axiosClient.get("settings");
        const accountsResponse = await axiosClient.get("financeAccounts");

        setSettings(settingsResponse.data);
        setAccounts(accountsResponse.data);

        const settingsData = settingsResponse.data;
        setSelectedAccounts({
          finance: accountsResponse.data.find(
            (s) => s.id == settingsData.finance_account_id
          ),
          company: accountsResponse.data.find(
            (s) => s.id == settingsData.company_account_id
          ),
          bank: accountsResponse.data.find((s) => s.id == settingsData.bank_id),
          endurance: accountsResponse.data.find(
            (s) => s.id == settingsData.endurance_account_id
          ),
          mainBank: accountsResponse.data.find(
            (s) => s.id == settingsData.main_bank
          ),
          mainCash: accountsResponse.data.find(
            (s) => s.id == settingsData.main_cash
          ),
          pharmacy_cash: accountsResponse.data.find(
            (s) => s.id == settingsData.pharmacy_cash
          ),
          pharmacy_bank: accountsResponse.data.find(
            (s) => s.id == settingsData.pharmacy_bank
          ),
          pharmacy_income: accountsResponse.data.find(
            (s) => s.id == settingsData.pharmacy_income
          ),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e, colName) => {
    if (e.target.files && e.target.files[0]) {
      encodeImageFileAsURL(e.target.files[0], colName);
    }
  };

  if (!settings) {
    return <Typography>جاري تحميل الإعدادات...</Typography>;
  }

  return (
    <Grid container spacing={4} direction="row" sx={{ direction: "rtl" }}>
      {/* General Settings Column */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="الإعدادات العامة" />
          <CardContent>
            <Stack spacing={2}>
              <FinancialYearSelector
                settings={settings}
                handleFinancialYearChange={handleFinancialYearChange}
              />

              <SettingsTextField
                label="اسم المستشفى"
                defaultValue={settings.hospital_name}
                colName="hospital_name"
              />

              <SettingsTextField
                label="العملة"
                defaultValue={settings.currency}
                colName="currency"
              />

              <SettingsTextField
                label="اسم المختبر"
                defaultValue={settings.lab_name}
                colName="lab_name"
              />

              <SettingsTextField
                label="الهاتف"
                defaultValue={settings.phone}
                colName="phone"
              />

              <SettingsTextField
                label="رقم إشعارات المخزن"
                defaultValue={settings.inventory_notification_number}
                colName="inventory_notification_number"
              />

              <SettingsTextField
                label="الرقم الضريبي"
                defaultValue={settings.vatin}
                colName="vatin"
              />

              <SettingsTextField
                label="السجل التجاري"
                defaultValue={settings.cr}
                colName="cr"
              />

              <SettingsTextField
                label="البريد الإلكتروني"
                defaultValue={settings.email}
                colName="email"
              />

              <SettingsTextField
                label="العنوان"
                defaultValue={settings.address}
                colName="address"
              />

              <SettingsTextField
                label="معرف المثيل"
                defaultValue={settings.instance_id}
                colName="instance_id"
              />

              <SettingsTextField
                label="الرمز المميز"
                defaultValue={settings.token}
                colName="token"
              />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Options and Accounts Column */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="خيارات النظام" />
          <CardContent>
            <Stack spacing={2}>
              <FormGroup>
                <SettingsCheckbox
                  label="عرض الترويسة"
                  defaultChecked={settings.is_header}
                  colName="is_header"
                />
                  <SettingsCheckbox
                  label="ارسال الرساله الترحيبيه"
                  defaultChecked={settings.send_welcome_message}
                  colName="send_welcome_message"
                />
                <SettingsCheckbox
                  label="عرض الجنسية"
                  defaultChecked={settings.country}
                  colName="country"
                />
                <SettingsCheckbox
                  label="عرض الرقم الوطني"
                  defaultChecked={settings.gov}
                  colName="gov"
                />
                <SettingsCheckbox
                  label="عرض العلامة المائية"
                  defaultChecked={settings.show_water_mark}
                  colName="show_water_mark"
                />
                <SettingsCheckbox
                  label="السماح بتعديل النتائج بعد التحقق"
                  defaultChecked={settings.edit_result_after_auth}
                  colName="edit_result_after_auth"
                />
                <SettingsCheckbox
                  label="طباعة باركود مع الإيصال"
                  defaultChecked={settings.barcode}
                  colName="barcode"
                />
                <SettingsCheckbox
                  label="عرض التذييل"
                  defaultChecked={settings.is_footer}
                  colName="is_footer"
                />
                <SettingsCheckbox
                  label="تعطيل التحقق من خدمات الطبيب"
                  defaultChecked={settings.disable_doctor_service_check}
                  colName="disable_doctor_service_check"
                />
                <SettingsCheckbox
                  label="عرض الشعار"
                  defaultChecked={settings.is_logo}
                  colName="is_logo"
                />
                <SettingsCheckbox
                  label="إرسال النتيجة بعد التحقق"
                  defaultChecked={settings.send_result_after_auth}
                  colName="send_result_after_auth"
                />
                <SettingsCheckbox
                  label="إرسال النتيجة بعد الطباعة"
                  defaultChecked={settings.send_result_after_result}
                  colName="send_result_after_result"
                />
              </FormGroup>

              <Divider />

              <Typography variant="h6">إعدادات الحسابات</Typography>

              <AccountSelect
                label="حساب النقدية"
                value={selectedAccounts.finance}
                accounts={accounts}
                colName="finance_account_id"
              />

              <AccountSelect
                label="حساب الشركة"
                value={selectedAccounts.company}
                accounts={accounts}
                colName="company_account_id"
              />

              <AccountSelect
                label="حساب التحمل"
                value={selectedAccounts.endurance}
                accounts={accounts}
                colName="endurance_account_id"
              />

              <AccountSelect
                label="حساب البنك"
                value={selectedAccounts.bank}
                accounts={accounts}
                colName="bank_id"
              />

              <AccountSelect
                label="الحساب البنكي الرئيسي"
                value={selectedAccounts.mainBank}
                accounts={accounts}
                colName="main_bank"
              />

              <AccountSelect
                label="الحساب النقدي الرئيسي"
                value={selectedAccounts.mainCash}
                accounts={accounts}
                colName="main_cash"
              />

              <AccountSelect
                label="الحساب النقدي للصيدليه"
                value={selectedAccounts.pharmacy_cash}
                accounts={accounts}
                colName="pharmacy_cash"
              />

              <AccountSelect
                label="الحساب البنك للصيدليه"
                value={selectedAccounts.pharmacy_bank}
                accounts={accounts}
                colName="pharmacy_bank"
              />
                 <AccountSelect
                label="الحساب الايرادات للصيدليه"
                value={selectedAccounts.pharmacy_income}
                accounts={accounts}
                colName="pharmacy_income"
              />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Images and Content Column */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="الصور والمحتوى" />
          <CardContent>
            <Stack spacing={3}>
              <ImageUploadSection
                label="صورة الترويسة"
                currentImage={settings.header_base64}
                onFileChange={handleFileChange}
                colName="header_base64"
              />

              <ImageUploadSection
                label="صورة الفوتر"
                currentImage={settings.footer_base64}
                onFileChange={handleFileChange}
                colName="footer_base64"
              />

              <ImageUploadSection
                label="ختم المدير"
                currentImage={settings.manager_stamp}
                onFileChange={handleFileChange}
                colName="manager_stamp"
              />

              <ImageUploadSection
                label="ختم المراجع المالي"
                currentImage={settings.auditor_stamp}
                onFileChange={handleFileChange}
                colName="auditor_stamp"
              />

              <SettingsTextField
                label="محتوى الترويسة"
                defaultValue={settings.header_content}
                colName="header_content"
                multiline
                rows={4}
              />

              <SettingsTextField
                label="محتوى الفوتر"
                defaultValue={settings.footer_content}
                colName="footer_content"
                multiline
                rows={4}
              />
                  <SettingsTextField
                label="محتوى الفوتر"
                defaultValue={settings.footer_content}
                colName="footer_content"
                multiline
                rows={4}
              />
                 <SettingsTextField
                label="الرساله الترحيبيه "
                defaultValue={settings.welcome_message}
                colName="welcome_message"
                multiline
                rows={4}
              />
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default PaperConfig;
