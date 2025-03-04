// src/components/PettyCashPermissionsTable.tsx

import React, { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import "moment/locale/ar";
import axiosClient from "../../../axios-client";
import { webUrl } from "../constants";
import { Plus, Printer } from "lucide-react";
import EmptyDialog from "../Dialogs/EmptyDialog";
import PettyCashPermissionForm from "./PettyCashPermissionForm";

// Define the type for a single petty cash permission
interface PettyCashPermission {
  id: number;
  permission_number: string;
  date: string;
  amount: number;
  beneficiary: string;
  description: string | null;
  pdf_file: string | null;
  finance_account_id: number;
  department_id: number | null;
  created_at: string;
  updated_at: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

function PettyCashPermissionsTable() {
  const { t } = useTranslation("PettyCashTable");

  const [permissions, setPermissions] = useState<PettyCashPermission[]>([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<number | null>(
    null
  );
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionToEdit, setPermissionToEdit] =
    useState<PettyCashPermission | null>(null);
  const { control, handleSubmit, reset, setValue, register } =
    useForm<PettyCashPermission>(); // Define type here

  const [accounts, setAccounts] = useState<
    { id: number; account_name: string }[]
  >([]);

  useEffect(() => {
    fetchPermissions();
    fetchAccounts(); // Fetch accounts for the edit form dropdown
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await axiosClient.get<PettyCashPermission[]>(
        "/petty-cash-permissions"
      );
      setPermissions(response.data);
    } catch (error: any) {
      console.error("Error fetching permissions:", error);
      showSnackbar(t("error_fetching_permissions"), "error");
    }
  };

  const fetchAccounts = async () => {
    try {
      const response =
        await axiosClient.get<{ id: number; account_name: string }[]>(
          "/accounts"
        );
      setAccounts(response.data);
    } catch (error: any) {
      console.error("Error fetching accounts:", error);
      showSnackbar(t("error_fetching_accounts"), "error");
    }
  };

  const handleEdit = (id: number) => {
    const permission = permissions.find((p) => p.id === id);
    if (permission) {
      setPermissionToEdit(permission);
      setEditDialogOpen(true);
      // Populate the form with the data of the selected permission
      reset(permission); // Use reset instead of setting individual values.
      // Also, set the date using setValue and moment
      setValue("date", moment(permission.date));
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setPermissionToEdit(null);
  };

  const onSubmit: SubmitHandler<PettyCashPermission> = async (data: PettyCashPermission) => {
    console.log(data,'data')
    try {
        const formData = new FormData();
        formData.append('date', moment(data.date).format('YYYY-MM-DD'));
        formData.append('amount', String(data.amount));
        formData.append('beneficiary', data.beneficiary);
        formData.append('description', data.description || '');  // Handle null description

        // Handle the PDF file (if a new file is selected)
        const pdfFile = control._formValues.pdf_file?.[0];
        if (pdfFile) {
            formData.append('pdf_file', pdfFile);
        }

        await axiosClient.post(`/update-petty-cash-permissions/${data.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        fetchPermissions();
        showSnackbar(t('permission_updated_successfully'), 'success');
        handleCloseEditDialog();
    } catch (error: any) {
        console.error('Error updating permission:', error);
        showSnackbar(t('error_updating_permission'), 'error');
    }
};

  const handleDelete = (id: number) => {
    setPermissionToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteConfirmationOpen(false);
    try {
      await axiosClient.delete(`/petty-cash-permissions/${permissionToDelete}`);
      fetchPermissions();
      showSnackbar(t("permission_deleted_successfully"), "success");
    } catch (error: any) {
      console.error("Error deleting permission:", error);
      showSnackbar(t("error_deleting_permission"), "error");
    } finally {
      setPermissionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setPermissionToDelete(null);
  };

  const handleViewPdf = (filename: string) => {
    window.open(`${webUrl}uploads/petty_cash/${filename}`, "_blank");
  };

  const showSnackbar = (
    message: string,
    severity: SnackbarState["severity"]
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const [show,setShow] = useState(false)

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} locale={t("locale")}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Typography variant="h3" textAlign={'center'}>اذن الصرف</Typography>
        <TableContainer>
            {/* <Button
            onClick={()=>{
                setShow(true)
  
            }}
            ><Plus /></Button> */}
          <Table  size="small"
          className="table"
            sx={{ minWidth: 650 ,direction:'ltr'}}
            aria-label="petty cash permissions table"
          >
            <TableHead>
              <TableRow>
                <TableCell>{t("id")}</TableCell>
                <TableCell>{t("permission_number")}</TableCell>
                <TableCell>{t("date")}</TableCell>
                <TableCell>{t("amount")}</TableCell>
                <TableCell>{t("beneficiary")}</TableCell>
                <TableCell>{t("description")}</TableCell>
                <TableCell>{t("pdf_file")}</TableCell>
                <TableCell>{t("actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.id}</TableCell>
                  <TableCell>{permission.finance_entry_id}</TableCell>
                  <TableCell>{permission.date}</TableCell>
                  <TableCell>{permission.amount}</TableCell>
                  <TableCell>{permission.beneficiary}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell>
                    <Stack gap={1} direction='row'>
 {permission.pdf_file && (
                      <Tooltip title={t("view_pdf")}>
                        <IconButton
                          onClick={() => handleViewPdf(permission.pdf_file)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={t("view_pdf")}>
                        <IconButton
                        href={`${webUrl}pettycash`}
                        >
                          <Printer />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                   
                  </TableCell>
                  <TableCell>
                    <Tooltip title={t("edit")}>
                      <IconButton onClick={() => handleEdit(permission.id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("delete")}>
                      <IconButton onClick={() => handleDelete(permission.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <EmptyDialog show={show} setShow={setShow}>
            <PettyCashPermissionForm/>
          </EmptyDialog>
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmationOpen} onClose={cancelDelete}>
          <DialogTitle>{t("confirm_delete")}</DialogTitle>
          <DialogContent>{t("are_you_sure_delete")}</DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>{t("cancel")}</Button>
            <Button onClick={confirmDelete} color="error">
              {t("delete")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>{t("edit_permission")}</DialogTitle>
          <DialogContent>
            {permissionToEdit && (
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 1 }}
              >
                <TextField
                 disabled
                  margin="normal"
                  fullWidth
                  label={t("finance_entry")}
                  {...register("finance_entry")}
                />
                <FormControl fullWidth margin="normal">
                  <Controller
                    control={control}
                    name="date"
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        label={t("date")}
                        value={field.value ? moment(field.value) : null}
                        onChange={(date) => {
                          setValue("date", date); // Update the form value
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </FormControl>
                <TextField
                  margin="normal"
                  fullWidth
                  label={t("amount")}
                  {...register("amount", { valueAsNumber: true })}
                  type="number"
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label={t("beneficiary")}
                  {...register("beneficiary")}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label={t("description")}
                  multiline
                  rows={4}
                  {...register("description")}
                />

                
                {/* PDF File Upload */}
                <FormControl fullWidth margin="normal">
                  <InputLabel id="pdf-file-label">{t("pdf_file")}</InputLabel>
                  <input
                    type="file"
                    accept=".pdf"
                    {...register("pdf_file")}
                    id="pdf-file"
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {t("save")}
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>{t("cancel")}</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </LocalizationProvider>
  );
}

export default PettyCashPermissionsTable;
