// src/components/PettyCashPermissionsTable.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react"; // Import useMemo

// ... other imports ...
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DateField,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import EmptyDialog from "../Dialogs/EmptyDialog";
import PettyCashPermissionForm from "./PettyCashPermissionForm";
import MyLoadingButton from "../../components/MyLoadingButton";
import { formatNumber, sendNotifications, webUrl } from "../constants";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axiosClient from "../../../axios-client";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { GridVisibilityOffIcon } from "@mui/x-data-grid";
import { DeleteIcon, EditIcon, Plus, Printer } from "lucide-react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import AddEntryForm from "./AddEntryForm";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { Account, Entry } from "../../types/type"; // Assuming types are defined correctly elsewhere or define basic ones here

// Define the type for a single petty cash permission
// Ensure these fields are included based on your actual API response
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
  // entry?: Entry; // Make optional if not always present
  creditAccountNames: string;
  finance_entry_id?: number | null; // Make optional if needed
  user_approved_time?: string | null; // Assuming this is the field for manager approval
  auditor_approved_time?: string | null; // Assuming this is the field for auditor approval
}

interface Account {
  // Define a basic Account type if not imported
  id: number;
  name: string;
}

interface Entry {
  // Define a basic Entry type if not imported
  id: number;
  hasPetty: boolean;
  // ... other entry fields if needed
}

// Define the SnackbarState interface
interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

function PettyCashPermissionsTable() {
  const { t } = useTranslation("PettyCashTable");
  const [page, setPage] = useState(10); // Consider if pagination state needs adjustment with filtering
  const navigate = useNavigate();
  const location = useLocation();

  // --- Data States ---
  const [allPermissions, setAllPermissions] = useState<PettyCashPermission[]>(
    []
  ); // Holds all fetched data
  console.log(allPermissions, "allPermissions");
  const [links, setLinks] = useState([]); // For pagination
  const [entries, setEntires] = useState<Entry[]>([]); // For linking entry
  const [accounts, setAccounts] = useState<Account[]>([]); // For account filter

  const [showAddEntryForm, setShowAddEntryForm] = useState(false); // For adding new entry

  // --- Filter States ---
  const [beneficiary, setBeneficiary] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [firstDate, setFirstDate] = useState(dayjs());
  const [secondDate, setSecondDate] = useState(dayjs());
  const [managerApprovedFilter, setManagerApprovedFilter] =
    useState<string>("all"); // 'all', 'approved', 'not_approved'
  const [auditorApprovedFilter, setAuditorApprovedFilter] =
    useState<string>("all"); // 'all', 'approved', 'not_approved'

  // --- UI / Dialog States ---
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<number | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionToEdit, setPermissionToEdit] =
    useState<PettyCashPermission | null>(null);
  const [showAddForm, setShowAddForm] = useState(false); // Renamed from 'show' for clarity
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const { control, handleSubmit, reset, setValue, register } =
    useForm<PettyCashPermission>();

  // --- Fetch Initial Data ---
  useEffect(() => {
    // fetchInitialPermissions(); // Fetch permissions based on initial date range
    fetchAccounts();
    fetchEntries(); // Fetch entries for linking
  }, []);

  // --- Fetching Functions ---
  const fetchPermissionsData = async (
    url: string = "/petty-cash-permissions", // Default endpoint
    params: Record<string, any> = {} // Allow passing params
  ) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(url, { params });
      // Assuming pagination structure might differ from filter structure
      if (response.data.data && response.data.links) {
        // Paginated response
        setAllPermissions(response.data.data);
        setLinks(response.data.links);
      } else if (Array.isArray(response.data)) {
        // Filter response (might not be paginated)
        setAllPermissions(response.data);
        setLinks([]); // Clear pagination links if filter returns flat array
      } else {
        console.warn(
          "Unexpected permissions response structure:",
          response.data
        );
        setAllPermissions([]);
        setLinks([]);
      }
    } catch (error: any) {
      console.error("Error fetching permissions:", error);
      showSnackbar(t("error_fetching_permissions"), "error");
      setAllPermissions([]); // Clear data on error
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  //  const fetchInitialPermissions = () => {
  //     fetchPermissionsData("/petty-cash-permissions", {
  //         // Include initial params if needed by backend for default view, e.g., date range
  //         first: firstDate.format("YYYY-MM-DD"),
  //         second: secondDate.format("YYYY-MM-DD"),
  //         rows: page // If backend supports row limit
  //     });
  //  }

  const fetchAccounts = async () => {
    try {
      // Adjust endpoint/structure if needed
      const response = await axiosClient.get("/accounts");
      // Assuming response.data is the array or response.data.data
      setAccounts(
        Array.isArray(response.data) ? response.data : response.data?.data || []
      );
    } catch (error: any) {
      console.error("Error fetching accounts:", error);
      showSnackbar(t("error_fetching_accounts"), "error");
    }
  };

  const fetchEntries = async () => {
    try {
      // Adjust endpoint if needed
      const response = await axiosClient.get("financeEntries");
      // Assuming response.data is the array or response.data.data
      setEntires(
        Array.isArray(response.data) ? response.data : response.data?.data || []
      );
    } catch (error) {
      console.error("Error fetching finance entries:", error);
      // Handle error appropriately
    }
  };

  // --- Filter Application ---
  const applyFilters = () => {
    axiosClient.get("settings").then(({ data }) => {
      setFirstDate(dayjs(data.financial_year_start));
      setSecondDate(dayjs(data.financial_year_end));
        const params = new URLSearchParams(location.search);
    if (!params.has("first")) {
      params.set("first",  data.financial_year_start);
       params.set("second", data.financial_year_end); 
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
      fetchPermissionsData("petty-cash-permissions-filter", {
        // filter: true, // Send flag if backend needs it
        first: data.financial_year_start, // Consistent format
        second: data.financial_year_end,
        beneficiary: beneficiary || undefined, // Send only if not null/empty
        account: selectedAccount?.id || undefined, // Send only if selected
      });
    });
    // Fetch data based on Date, Beneficiary, Account from the backend

    // Approval filters (managerApprovedFilter, auditorApprovedFilter) will be applied client-side via useMemo
  };

  // Trigger backend fetch when primary filters change
  useEffect(() => {
    // Apply filters automatically when beneficiary or account changes
    // Debounce this if it causes too many requests
    applyFilters();
  }, [beneficiary, selectedAccount?.id]);
  // Note: Date filter is applied via the "Go" button's searchHandler

  const searchHandler = () => {
    applyFilters(); // Use the common filter function
  };

  // --- Client-Side Filtering (Approval Status) ---
  const filteredPermissions = useMemo(() => {
    return allPermissions.filter((permission) => {
      // Manager Approval Filter
      const managerPass =
        managerApprovedFilter === "all"
          ? true
          : managerApprovedFilter === "approved"
            ? !!permission.user_approved_time // Check if timestamp exists (is truthy)
            : !permission.user_approved_time; // Check if timestamp doesn't exist (is falsy)

      // Auditor Approval Filter
      const auditorPass =
        auditorApprovedFilter === "all"
          ? true
          : auditorApprovedFilter === "approved"
            ? !!permission.auditor_approved_time
            : !permission.auditor_approved_time;

      return managerPass && auditorPass;
    });
  }, [allPermissions, managerApprovedFilter, auditorApprovedFilter]);

  // --- Action Handlers (Edit, Delete, View PDF, Update Entry Link) ---

  const handleEdit = (id: number) => {
    // Find from allPermissions as filtered list might not have it if filters active
    const permission = allPermissions.find((p) => p.id === id);
    if (permission) {
      setPermissionToEdit(permission);
      setEditDialogOpen(true);
      reset(permission);
      // Ensure date is set correctly using the expected format/library
      // setValue("date", dayjs(permission.date)); // If using dayjs in form
      setValue("date", moment(permission.date)); // If using moment in form
    }
  };

  const handleUpdateEntryLink = (
    permissionId: number,
    newEntryId: number | null
  ) => {
    if (!newEntryId) return; // Do nothing if no entry selected

    axiosClient
      .patch(`setFinanceEntry/${permissionId}`, {
        finance_entry_id: newEntryId,
      })
      .then(({ data }) => {
        // Update the specific permission in the main list
        setAllPermissions((prev) => {
          return prev.map((p) =>
            p.id === permissionId ? data.data : p // Assuming API returns updated permission object
          );
        });
        showSnackbar("تم ربط القيد بنجاح", "success");
      })
      .catch((err) => {
        console.error("Error linking entry:", err);
        showSnackbar("فشل ربط القيد", "error");
      });
  };

  const handleApprove = (
    permissionId: number,
    colName: "user_approved_time" | "auditor_approved_time"
  ) => {
    const actionType = colName === "user_approved_time" ? "المدير" : "المراجع";
    let result = confirm(
      `سيتم اعتماد اذن الصرف من قبل ${actionType}. هل انت متأكد؟`
    );
    if (result) {
      setLoading(true); // Indicate processing
      axiosClient
        .get(`expense-approve/${permissionId}?colName=${colName}`)
        .then(({ data }) => {
          if (data?.data) {
            // Update the specific permission in the main list
            setAllPermissions((prev) => {
              return prev.map((p) => (p.id === permissionId ? data.data : p));
            });

            // Send Notification
            sendNotifications(
              data.data.id,
              `اعتماد ${actionType}`,
              `${data.data.description} \n المبلغ ${formatNumber(data.data.amount)}`
            );
            showSnackbar(`تم اعتماد ${actionType} بنجاح`, "success");
          } else {
            console.warn("Approval response unexpected:", data);
            showSnackbar(`حدث خطأ اثناء اعتماد ${actionType}`, "warning");
          }
        })
        .catch((err) => {
          console.error(`Error approving ${actionType}:`, err);
          showSnackbar(`فشل اعتماد ${actionType}`, "error");
        })
        .finally(() => setLoading(false));
    }
  };

  // ... (keep handleCloseEditDialog, onSubmit, handleDelete, confirmDelete, cancelDelete, handleViewPdf, showSnackbar, handleCloseSnackbar) ...
  // Ensure onSubmit and confirmDelete update `allPermissions` and then potentially trigger refetch or rely on useMemo

  const onSubmitEdit: SubmitHandler<PettyCashPermission> = async (data) => {
    if (!permissionToEdit) return;
    console.log(data, "edit data");
    setLoading(true);
    try {
      // Create FormData manually to handle file upload correctly
      const formData = new FormData();
      formData.append("date", moment(data.date).format("YYYY-MM-DD")); // Format date
      formData.append("amount", String(data.amount));
      formData.append("beneficiary", data.beneficiary);
      if (data.description) formData.append("description", data.description);
      // finance_account_id might need to be handled if it's editable

      // Handle file: Only append if a new file is selected in the form
      const pdfFileInput = document.getElementById(
        "pdf-file-edit"
      ) as HTMLInputElement; // Get input directly
      if (pdfFileInput && pdfFileInput.files && pdfFileInput.files.length > 0) {
        formData.append("pdf_file", pdfFileInput.files[0]);
      }

      // IMPORTANT: Use POST with _method=PATCH if backend expects it for FormData updates
      //  formData.append("_method", "PATCH"); // Or PUT depending on backend route definition

      const response = await axiosClient.post(
        // Use POST with _method
        `/update-petty-cash-permissions/${permissionToEdit.id}`, // Adjust endpoint if needed
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the state with the potentially updated permission from the response
      setAllPermissions((prev) =>
        prev.map((p) =>
          p.id === permissionToEdit.id
            ? response.data.data || { ...p, ...data }
            : p
        )
      ); // optimistic update or use response

      showSnackbar(t("permission_updated_successfully"), "success");
      handleCloseEditDialog();
    } catch (error: any) {
      console.error("Error updating permission:", error);
      showSnackbar(t("error_updating_permission"), "error");
      // Optionally show more specific error messages from backend response
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!permissionToDelete) return;
    setLoading(true);
    setDeleteConfirmationOpen(false);
    try {
      await axiosClient.delete(`/petty-cash-permissions/${permissionToDelete}`);
      // Remove the deleted permission from the state
      setAllPermissions((prev) =>
        prev.filter((p) => p.id !== permissionToDelete)
      );
      showSnackbar(t("permission_deleted_successfully"), "success");
    } catch (error: any) {
      console.error("Error deleting permission:", error);
      showSnackbar(t("error_deleting_permission"), "error");
    } finally {
      setPermissionToDelete(null);
      setLoading(false);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setPermissionToEdit(null);
    reset(); // Reset form on close
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setPermissionToDelete(null);
  };

  const handleViewPdf = (filename: string) => {
    // Ensure the base URL is correct
    window.open(`${webUrl}uploads/petty_cash/${filename}`, "_blank"); // Adjust path if needed (e.g., /storage/..)
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event, // Make event optional
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const updateItemsTable = useCallback(
    (
      link: { url?: string | null },
      setLoadingCallback: (loading: boolean) => void
    ) => {
      if (!link.url) return;
      setLoadingCallback(true); // Use the passed setLoading
      axiosClient(`${link.url}&first=${firstDate.format('YYYY-MM-DD')}&second=${secondDate.format('YYYY-MM-DD')}`) // Assumes link.url already includes necessary params like 'rows'
        .then(({ data }) => {
          setAllPermissions(data.data); // Update main data list
          setLinks(data.links);
        })
        .catch((error) => {
          console.error("Error updating items table via pagination:", error);
        })
        .finally(() => {
          setLoadingCallback(false); // Use the passed setLoading
        });
    },
    []
  ); // Dependencies might be needed if `page` affects the base URL structure
  useEffect(() => {
    setLoading(true);
    //fetch all Accounts
    axiosClient(`financeAccounts`)
      .then(({ data }) => {
        setAccounts(data);
        console.log(data, "accounts");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      adapterLocale={t("locale") || "en"}
    >
      <Paper sx={{ mb: 2, p: 2 }}>
        {" "}
        {/* Filter Bar Paper */}
        <Grid container spacing={2} alignItems="center">
          {/* Date Filters */}
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                format="DD-MM-YYYY" // Consistent format
                value={firstDate}
                onChange={(val) => val && setFirstDate(val)}
                label="From"
                fullWidth
                size="small"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                format="DD-MM-YYYY"
                value={secondDate}
                onChange={(val) => val && setSecondDate(val)}
                label="To"
                fullWidth
                size="small"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={2} lg={1}>
            <LoadingButton
              onClick={searchHandler}
              loading={loading}
              variant="contained"
              fullWidth
              size="medium" // Match DateField height
            >
              Go
            </LoadingButton>
          </Grid>

          {/* Beneficiary Filter */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              size="small"
              label="بحث بالمتسفيد"
              value={beneficiary || ""}
              onChange={(e) => setBeneficiary(e.target.value || null)} // Set null if empty
            />
          </Grid>

          {/* Account Filter */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Autocomplete
              fullWidth
              size="small"
              options={accounts}
              getOptionLabel={(option) => option.name || ""} // Use name field
              value={selectedAccount}
              onChange={(event, newValue) => {
                setSelectedAccount(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label={"بحث بحساب الدائن"} />
              )}
            />
          </Grid>

          {/* --- Approval Filters --- */}
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="manager-approve-filter-label">
                اعتماد المدير
              </InputLabel>
              <Select
                labelId="manager-approve-filter-label"
                label="اعتماد المدير"
                value={managerApprovedFilter}
                onChange={(e) => setManagerApprovedFilter(e.target.value)}
              >
                <MenuItem value="all">الكل</MenuItem>
                <MenuItem value="approved">معتمد</MenuItem>
                <MenuItem value="not_approved">غير معتمد</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="auditor-approve-filter-label">
                اعتماد المراجع
              </InputLabel>
              <Select
                labelId="auditor-approve-filter-label"
                label="اعتماد المراجع"
                value={auditorApprovedFilter}
                onChange={(e) => setAuditorApprovedFilter(e.target.value)}
              >
                <MenuItem value="all">الكل</MenuItem>
                <MenuItem value="approved">معتمد</MenuItem>
                <MenuItem value="not_approved">غير معتمد</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Export Buttons */}
          <Grid item xs={6} sm={3} md={2} lg={1}>
            <Tooltip title="Excel">
              <IconButton
                fullWidth // Make button take grid item width
                variant="outlined" // Use variant for button-like appearance
                size="medium"
                color="success"
                href={`${webUrl}pettyAll-excel?first=${firstDate.format("YYYY-MM-DD")}&second=${secondDate.format("YYYY-MM-DD")}${selectedAccount?.id ? `&account=${selectedAccount.id}` : ""}${beneficiary ? `&beneficiary=${encodeURIComponent(beneficiary)}` : ""}`} // Add beneficiary to export if needed
              >
                Excel {/* Or use an Icon */}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={6} sm={3} md={2} lg={1}>
            <Tooltip title="PDF">
              <IconButton
                fullWidth
                variant="outlined"
                size="medium"
                color="error"
                href={`${webUrl}pettycashAllReport?first=${firstDate.format("YYYY-MM-DD")}&second=${secondDate.format("YYYY-MM-DD")}${selectedAccount?.id ? `&account=${selectedAccount.id}` : ""}${beneficiary ? `&beneficiary=${encodeURIComponent(beneficiary)}` : ""}`} // Add beneficiary to export if needed
                target="_blank" // Open PDF in new tab
              >
                PDF {/* Or use an Icon */}
              </IconButton>
            </Tooltip>
          </Grid>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus />
            اذن صرف جديد
          </Button>
        </Grid>
      </Paper>

      <Typography variant="h5" textAlign={"center"} gutterBottom>
        اذون الصرف {/* Better heading */}
      </Typography>

      <TableContainer style={{ direction: "rtl" }} component={Paper}>
        {" "}
        {/* Wrap table in Paper */}
        {/* Add Button (Optional) */}
        <Table
          size="small"
          className="table"
          stickyHeader // Keep header visible on scroll
          sx={{ minWidth: 1200 }} // Increase minWidth for more columns
          aria-label="petty cash permissions table"
        >
          <TableHead className="thead">
            <TableRow
              sx={{
                "& th": { fontWeight: "bold", backgroundColor: "grey.200" },
              }}
            >
              <TableCell>رقم الاذن</TableCell>
              <TableCell>رقم القيد</TableCell> {/* Finance Entry ID */}
              <TableCell>{t("date")}</TableCell>
              <TableCell align="right">{t("amount")}</TableCell>{" "}
              {/* Align numbers */}
              <TableCell>{t("beneficiary")}</TableCell>
              <TableCell>{t("description")}</TableCell>
              <TableCell>حساب الدائن</TableCell> {/* Credit Account */}
              <TableCell align="center">اعتماد المدير</TableCell>{" "}
              {/* Manager Approval */}
              <TableCell align="center">اعتماد المراجع</TableCell>{" "}
              {/* Auditor Approval */}
              <TableCell align="center">المرفقات</TableCell> {/* Attachments */}
              <TableCell align="center">{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map over the client-side filtered permissions */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredPermissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    لا توجد أذونات صرف تطابق البحث.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPermissions.map((permission) => (
                <TableRow key={permission.id} hover>
                  <TableCell>{permission.id}</TableCell>
                  <TableCell>
                    {/* Logic to link Finance Entry */}
                    {permission.finance_entry_id == null ? (
                      // <Autocomplete
                      //    size="small"
                      //    sx={{ width: "150px" }} // Adjust width
                      //    options={entries.filter((e)=>!e.hasPetty)} // Show only unlinked entries
                      //    getOptionLabel={(option) => String(option.id) || ""}
                      //    isOptionEqualToValue={(option, value) => option.id === value.id}
                      //    onChange={(e, newVal) => {
                      //        handleUpdateEntryLink(permission.id, newVal?.id ?? null);
                      //    }}
                      //    renderInput={(params) => (
                      //       <TextField {...params} label={"ربط قيد"} />
                      //    )}
                      //  />
                      <Button
                        onClick={() => {
                          setShowAddEntryForm(true);
                          setPermissionToEdit(permission);
                        }}
                      >
                        انشاء قيد
                      </Button>
                    ) : (
                      <Typography variant="body2">
                        {permission.finance_entry_id}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {dayjs(permission.date).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(permission.amount)}
                  </TableCell>
                  <TableCell>{permission.beneficiary}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Tooltip title={permission.description || ""}>
                      <span>{permission.description}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{permission.creditAccountNames}</TableCell>

                  {/* Manager Approval Column */}
                  <TableCell align="center">
                    {permission.user_approved_time ? (
                      <Tooltip
                        title={`Approved on: ${dayjs(permission.user_approved_time).format("YYYY-MM-DD HH:mm")}`}
                      >
                        <Chip
                          label="معتمد"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      </Tooltip>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleApprove(permission.id, "user_approved_time")
                        }
                        disabled={loading} // Disable while any loading action is happening
                      >
                        اعتماد
                      </Button>
                    )}
                  </TableCell>

                  {/* Auditor Approval Column */}
                  <TableCell align="center">
                    {permission.auditor_approved_time ? (
                      <Tooltip
                        title={`Approved on: ${dayjs(permission.auditor_approved_time).format("YYYY-MM-DD HH:mm")}`}
                      >
                        <Chip
                          label="معتمد"
                          color="secondary"
                          size="small"
                          variant="outlined"
                        />
                      </Tooltip>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        onClick={() =>
                          handleApprove(permission.id, "auditor_approved_time")
                        }

                        // Add tooltip explaining why it might be disabled
                      >
                        اعتماد
                      </Button>
                    )}
                  </TableCell>

                  {/* Attachments Column */}
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >
                      {permission.pdf_file && (
                        <Tooltip title={t("view_pdf")}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewPdf(permission.pdf_file)}
                          >
                            <GridVisibilityOffIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={"طباعة"}>
                        <IconButton
                          size="small"
                          href={`${webUrl}pettycash2/${permission.id}`}
                          target="_blank"
                        >
                          <Printer size={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >
                      <Tooltip title={t("edit")}>
                        <span>
                          {" "}
                          {/* Span needed for tooltip on disabled button */}
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(permission.id)}
                            disabled={
                              !!permission.user_approved_time ||
                              !!permission.auditor_approved_time
                            }
                          >
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* --- Pagination Controls --- */}
        <Grid sx={{ p: 2, justifyContent: "center" }} container spacing={1}>
          {links.map((link, i) => {
            console.log(link, "link");
            // Simplified Pagination (adjust based on your actual link structure)
            const isFirst = i === 0;
            const isLast = i === links.length - 1;
            const isPageNumber = !isFirst && !isLast;
            let label = link.label;
            if (isFirst) label = <ArrowBack />;
            if (isLast) label = <ArrowForward />;
            // Decode HTML entities like « if present
            //  label = <span dangerouslySetInnerHTML={{ __html: label }} />;

            return (
              <Grid item key={link.label || i}>
                <MyLoadingButton
                  active={link.active} // Use active flag from backend link
                  onClick={(setLoadingCallback) => {
                    // Expects setLoading passed from MyLoadingButton
                    if (link.url) updateItemsTable(link, setLoadingCallback);
                  }}
                  variant={link.active ? "contained" : "outlined"}
                  disabled={!link.url || loading}
                  size="small"
                >
                  {label}
                </MyLoadingButton>
              </Grid>
            );
          })}
        </Grid>
      </TableContainer>

      {/* --- Dialogs --- */}

      {/* Add Form Dialog (using EmptyDialog) */}
      <EmptyDialog show={showAddForm} setShow={setShowAddForm}>
        <PettyCashPermissionForm
          setAllPermissions={setAllPermissions}
          onSuccess={() => {
            // Add onSuccess callback
            setShowAddForm(false);
            // fetchInitialPermissions(); // Refetch data after adding
          }}
          onClose={() => setShowAddForm(false)} // Add onClose callback
        />
      </EmptyDialog>
      <EmptyDialog show={showAddEntryForm} setShow={setShowAddEntryForm}>
        <AddEntryForm
          setAllPermissions={setAllPermissions}
          setLoading={setLoading}
          setDialog={() => {}}
          setUpdate={() => {}}
          loading={loading}
          permissionId={permissionToEdit?.id || 0}
          amount={permissionToEdit?.amount || 0}
          desc={permissionToEdit?.description || ""}
        />
      </EmptyDialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmationOpen} onClose={cancelDelete}>
        {/* ... (keep content the same) ... */}
        <DialogTitle>{t("confirm_delete")}</DialogTitle>
        <DialogContent>
          <Typography>{t("are_you_sure_delete")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>{t("cancel")}</Button>
          <Button onClick={confirmDelete} color="error" disabled={loading}>
            {loading ? "Deleting..." : t("delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm" // Adjusted size
      >
        <DialogTitle>{t("edit_permission")}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmitEdit)}>
          {" "}
          {/* Use specific submit handler */}
          <DialogContent>
            {/* Form fields - Use Controller for MUI components */}
            {permissionToEdit && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                {/* Display ID and Entry ID if needed, but likely not editable */}
                <TextField
                  disabled
                  label="ID"
                  defaultValue={permissionToEdit.id}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                  size="small"
                />
                <TextField
                  disabled
                  label="رقم القيد"
                  defaultValue={permissionToEdit.finance_entry_id || "N/A"}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                  size="small"
                />

                <Controller
                  name="date"
                  control={control}
                  rules={{ required: "Date is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider
                      dateAdapter={AdapterMoment}
                      adapterLocale={t("locale") || "en"}
                    >
                      <DatePicker
                        label={t("date")}
                        value={field.value ? moment(field.value) : null}
                        onChange={(date) => field.onChange(date)} // Use field.onChange
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />

                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: "Amount is required",
                    min: { value: 0.01, message: "Amount must be positive" },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label={t("amount")}
                      type="number"
                      error={!!error}
                      helperText={error?.message}
                      inputProps={{ step: "0.01" }} // Allow decimals
                    />
                  )}
                />

                <Controller
                  name="beneficiary"
                  control={control}
                  rules={{ required: "Beneficiary is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label={t("beneficiary")}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      label={t("description")}
                      multiline
                      rows={3}
                    />
                  )}
                />
                {/* Simplified File Input */}
                <Button component="label" variant="outlined" size="small">
                  {t("pdf_file")} (Optional)
                  <input
                    id="pdf-file-edit"
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.png,.jpeg"
                  />
                  {/* Removed register - handle file via direct DOM access or state */}
                </Button>
                {/* Display current file if exists */}
                {permissionToEdit.pdf_file && (
                  <Typography variant="caption">
                    Current: {permissionToEdit.pdf_file}
                  </Typography>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseEditDialog}>{t("cancel")}</Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {t("save")}
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      {/* ... (keep snackbar component the same) ... */}
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
    </LocalizationProvider>
  );
}

export default PettyCashPermissionsTable;
