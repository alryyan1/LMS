import {
  Autocomplete, // Import Autocomplete
  Badge,
  Box, // Import Box for layout
  Button,
  Checkbox, // Could use Checkbox or Select for hasPetty
  FormControl, // Import FormControl
  FormControlLabel, // Import FormControlLabel
  Grid,
  IconButton,
  InputLabel, // Import InputLabel
  MenuItem, // Import MenuItem for Select
  Paper,
  Select, // Import Select
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead, // Import TableHead for proper structure
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react"; // Import useMemo
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import dayjs from "dayjs";
import AddEntryForm from "./AddEntryForm.tsx";
import {
  formatNumber,
  host,
  schema,
  sendNotifications,
  webUrl,
} from "../constants.js";
import DateComponent from "./DateComponent.tsx";
// import GeminiImageUploader from "./Gemini.tsx"; // Uncomment if needed
import EmptyDialog from "../Dialogs/EmptyDialog.tsx";
import { Eye, Plus, XCircle } from "lucide-react"; // Import XCircle for clear filters

// --- Define expected types (optional but recommended) ---
// interface Account {
//   id: number;
//   name: string;
// }
// interface EntryDetail {
//   id: number;
//   amount: number;
//   account_id: number; // Assuming this field exists
//   account?: Account;
// }
// interface Entry {
//   id: number;
//   created_at: string;
//   description: string;
//   cancel: boolean;
//   hasPetty: boolean;
//   debit: EntryDetail[];
//   credit: EntryDetail[];
//   doctor_shift_id?: number | null;
//   user_net?: number | null;
//   file_name?: string | null;
// }
// ---------------------------------------------------------

function AccountEntries() {
  const [allEntries, setAllEntries] = useState([]); // Store the master list
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false); // Loading state for accounts
  const [showAddForm, setShowAddForm] = useState(false);
  // const { dilog, setDialog } = useOutletContext(); // Assuming setDialog might be used in AddEntryForm
  const [settings, setSettings] = useState(null);
  const [firstDate, setFirstDate] = useState(dayjs().startOf("month"));
  const [secondDate, setSecondDate] = useState(dayjs());
  const [allAccounts, setAllAccounts] = useState([]); // State for accounts list

  // --- Filter States ---
  const [selectedAccountId, setSelectedAccountId] = useState(null); // Use null for 'all'
  const [filterHasPetty, setFilterHasPetty] = useState("all"); // 'all', 'yes', 'no'
  const [searchTerm, setSearchTerm] = useState(""); // For description search

  useEffect(() => {
    document.title = "قيود اليومية";
    // Fetch Accounts for the filter dropdown
    setLoadingAccounts(true);
    axiosClient.get("accounts") // Replace with your actual accounts endpoint
      .then(({ data }) => {
        // Assuming data is the array of accounts or { data: [...] }
        setAllAccounts(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Failed to fetch accounts:", err))
      .finally(() => setLoadingAccounts(false));

    // Fetch initial settings and entries
    setLoading(true);
    axiosClient.get("settings")
      .then(({ data: settingsData }) => {
        setSettings(settingsData);
        const startDate = dayjs(settingsData.financial_year_start);
        const endDate = dayjs(settingsData.financial_year_end);
        setFirstDate(startDate);
        setSecondDate(endDate);
        return axiosClient.get(
          `financeEntries?first=${startDate.format("YYYY-MM-DD")}&second=${endDate.format("YYYY-MM-DD")}` // Use YYYY-MM-DD consistently
        );
      })
      .then(({ data: entriesData }) => {
         // Assuming data is the array of entries or { data: [...] }
        setAllEntries(Array.isArray(entriesData?.data) ? entriesData.data : Array.isArray(entriesData) ? entriesData : []);
        // setEntries(entriesData.data || entriesData); // Initialize displayed entries
        console.log(entriesData, "initial entries");
      })
      .catch(error => {
        console.error("Error fetching settings or entries:", error);
        setAllEntries([]); // Clear entries on error
      })
      .finally(() => setLoading(false));

  }, []); // Run only on mount


  // Function to fetch entries based on date range
  const fetchEntriesByDate = (start, end) => {
    setLoading(true);
    axiosClient(
        `financeEntries?first=${start.format("YYYY-MM-DD")}&second=${end.format("YYYY-MM-DD")}` // Use YYYY-MM-DD
      )
        .then(({ data }) => {
            setAllEntries(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
        })
        .catch(err => {
            console.error("Error fetching entries by date:", err);
            setAllEntries([]);
        })
        .finally(() => setLoading(false));
  }

  // --- Filtering Logic ---
  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      // 1. Filter by Search Term (Description)
      const descriptionMatch = searchTerm
        ? entry.description?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // 2. Filter by Account
      // Check if the selected account exists in either debit or credit parts
      const accountMatch = selectedAccountId
        ? entry.debit.some((d) => d.account_id === selectedAccountId || d.account?.id === selectedAccountId) || // Adjust based on your data structure
          entry.credit.some((c) => c.account_id === selectedAccountId || c.account?.id === selectedAccountId)
        : true;

      // 3. Filter by hasPetty status
      const pettyMatch =
        filterHasPetty === "all"
          ? true
          : filterHasPetty === "yes"
          ? entry.hasPetty === true
          : entry.hasPetty === false; // Or !entry.hasPetty

      return descriptionMatch && accountMatch && pettyMatch;
    });
  }, [allEntries, searchTerm, selectedAccountId, filterHasPetty]);
  // ----------------------

  const updateFile = (file, entry) => {
    // ... (keep your existing updateFile logic)
     if (file) {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("entry_id", entry.id);
      axiosClient.post("handleIncomeProoveFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(({data}) => {
         // Optimistically update the entry in the state if API returns updated entry
         if (data?.data) {
             setAllEntries(prev => prev.map(item => item.id === entry.id ? {...item, file_name: data.data.file_name} : item));
         }
         console.log('File upload response:', data);
      }).catch(err => {
          console.error("File upload failed:", err);
          // Add user feedback (e.g., toast notification)
      });
    }
  };

  const handleCreatePettyCash = (entry) => {
     let result = confirm(
        "هل تريد انشاء اذن الصرف؟"
    );
    if (result) {
        const amount = entry.credit.reduce((prev, curr) => prev + curr.amount, 0);
        setLoading(true); // Indicate processing
        axiosClient
        .post("createPettyCash", {
            amount: amount,
            finance_entry_id: entry.id,
            description: entry.description,
        })
        .then(({ data }) => {
            console.log(data);
            if (data?.data?.entry) {
                // Update the specific entry in the state
                setAllEntries((prev) => {
                    return prev.map((item) =>
                        item.id === entry.id
                        ? data.data.entry // Replace with the updated entry from response
                        : item
                    );
                });
                // Send notification
                sendNotifications(
                    data.data.id, // Assuming data.data.id is the petty cash ID
                    "اذن صرف جديد",
                    `${data.data.description} \n  المبلغ  ${formatNumber(data.data.amount)}   `
                );
            } else {
                 console.warn("Create petty cash response structure unexpected:", data);
                 // Optionally refetch entries if update isn't reliable
                 fetchEntriesByDate(firstDate, secondDate);
            }
        })
        .catch(err => {
            console.error("Failed to create petty cash:", err);
            // Add user feedback
            alert("فشل انشاء اذن الصرف.");
        })
        .finally(() => setLoading(false));
    }
  }

  const handleReverseEntry = (entry) => {
     const result = confirm(
        "سيتم فقط عكس القيد والاشاره بشطب القيد الحالي. هل انت متأكد؟"
    );
    if (result) {
        setLoading(true);
        axiosClient
        .post(`reverseEntry/${entry.id}`) // Removed body if not needed, or ensure it's correct { entry_id: entry.id }
        .then(({ data }) => {
            console.log(data, "entry reverse response");
            if (data?.data) { // Check if the updated entry is returned
                setAllEntries((prev) => {
                    return prev.map((e) => {
                        if (e.id == data.data.id) {
                            return data.data; // Replace with reversed entry data
                        } else {
                            return e;
                        }
                    });
                });
                // Optionally add the *new* reversed entry if the API creates one instead of updating
                // if (data.newEntry) {
                //    setAllEntries(prev => [...prev, data.newEntry]);
                // }
                 alert("تم عكس القيد بنجاح.");
            } else {
                console.warn("Reverse entry response structure unexpected:", data);
                // Refetch to be safe
                fetchEntriesByDate(firstDate, secondDate);
            }
        })
        .catch(err => {
            console.error("Failed to reverse entry:", err);
            alert("فشل عكس القيد.");
        })
        .finally(() => setLoading(false));
    }
  }

  const clearFilters = () => {
    setSelectedAccountId(null);
    setFilterHasPetty('all');
    setSearchTerm('');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}> {/* Increased padding */}
          {/* --- Top Action Bar --- */}
          <Stack direction="row" spacing={1} alignItems="center" mb={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<Plus size={18}/>}
              onClick={() => setShowAddForm(true)}
              size="small"
            >
              إضافة قيد
            </Button>
             {/* --- Date Component --- */}
            <DateComponent
                // Pass fetch function instead of manipulating state directly
                onDateChange={fetchEntriesByDate}
                setFirstDate={setFirstDate}
                setSecondDate={setSecondDate}
                firstDate={firstDate}
                secondDate={secondDate}
                // Removed unused props: api, setData, accounts, setAccounts
            />
            <Button
              variant="outlined"
              size="small"
              href={`${webUrl}entries?first=${firstDate.format("YYYY-MM-DD")}&second=${secondDate.format("YYYY-MM-DD")}`}
              target="_blank" // Open PDF in new tab
            >
              PDF
            </Button>
            <Button
              variant="outlined"
              size="small"
              href={`${webUrl}entries-excel?first=${firstDate.format("YYYY-MM-DD")}&second=${secondDate.format("YYYY-MM-DD")}`}
            >
              Excel
            </Button>
          </Stack>

          {/* --- Filters Section --- */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
             <Grid container spacing={2} alignItems="flex-end">
                {/* Description Search */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="بحث بالبيان"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>

                {/* Account Filter */}
                <Grid item xs={12} sm={6} md={3}>
                    <Autocomplete
                        fullWidth
                        options={allAccounts}
                        getOptionLabel={(option) => option.name || ""}
                        value={allAccounts.find(acc => acc.id === selectedAccountId) || null}
                        onChange={(event, newValue) => {
                            setSelectedAccountId(newValue ? newValue.id : null);
                        }}
                        loading={loadingAccounts}
                        renderInput={(params) => (
                            <TextField {...params} label="فلتر بالحساب" size="small" />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id} // Important for object values
                    />
                </Grid>

                {/* hasPetty Filter */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="has-petty-filter-label">إذن صرف؟</InputLabel>
                        <Select
                            labelId="has-petty-filter-label"
                            label="إذن صرف؟"
                            value={filterHasPetty}
                            onChange={(e) => setFilterHasPetty(e.target.value)}
                        >
                            <MenuItem value="all">الكل</MenuItem>
                            <MenuItem value="yes">نعم</MenuItem>
                            <MenuItem value="no">لا</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Clear Filters Button */}
                 <Grid item xs={12} sm={6} md={2}>
                    <Button
                        fullWidth
                        variant="text"
                        size="small"
                        onClick={clearFilters}
                        startIcon={<XCircle size={16}/>}
                        disabled={!selectedAccountId && filterHasPetty === 'all' && !searchTerm}
                    >
                        مسح الفلاتر
                    </Button>
                </Grid>
             </Grid>
          </Paper>

          {/* --- Entries Table --- */}
          {loading ? (
            <Skeleton variant="rectangular" height={window.innerHeight - 300} /> // Adjust height
          ) : (
            <TableContainer
              sx={{ maxHeight: `${window.innerHeight - 300}px`, overflow: "auto" }} // Adjusted height
            >
              <Table stickyHeader sx={{ width: "100%" }} dir="rtl" size="small">
                {/* Use TableHead */}
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 'bold', backgroundColor: 'grey.200' } }}>
                    <TableCell>التاريخ</TableCell>
                    <TableCell>رقم القيد</TableCell>
                    <TableCell>البيان</TableCell>
                    <TableCell align="center">مدين</TableCell> {/* Align */}
                    <TableCell align="center">دائن</TableCell> {/* Align */}
                    <TableCell align="center">اذن صرف</TableCell> {/* Align */}
                    <TableCell align="center">مستند القبض</TableCell> {/* Align */}
                    <TableCell align="center">إجراء</TableCell> {/* Combined actions */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEntries.length === 0 && !loading ? (
                     <TableRow>
                        <TableCell colSpan={8} align="center" sx={{py: 5}}>
                           <Typography color="text.secondary">لا توجد قيود تطابق البحث.</Typography>
                        </TableCell>
                     </TableRow>
                  ) : (
                  filteredEntries.map((entry, i) => {
                    // Calculate row spans accurately
                    const debitCount = entry.debit?.length || 0;
                    const creditCount = entry.credit?.length || 0;
                    const totalDetailRows = Math.max(1, debitCount) + Math.max(1, creditCount); // Need at least one row even if empty
                    const totalEntryRows = totalDetailRows + 1; // Add 1 for the description row

                     const rowStyle = {
                        textDecoration: entry.cancel ? "line-through" : "none",
                        opacity: entry.cancel ? 0.6 : 1,
                        backgroundColor: i % 2 !== 0 ? "action.hover" : "transparent", // Subtle alternating background
                        color: entry.hasPetty ? theme => theme.palette.info.dark : 'inherit' // Example: highlight petty cash entries
                     };


                    let showLink = false;
                    let link = "";
                    if (entry.doctor_shift_id != null || entry.user_net != null)
                      showLink = true;
                    if (entry.doctor_shift_id != null) {
                      link = `${webUrl}clinics/doctor/report?doctorshift=${entry.doctor_shift_id}`;
                    }
                    if (entry.user_net != null) {
                      link = `${webUrl}clinics/all?user_id=${entry.user_net}`;
                    }

                    // --- Render Rows ---
                    // This structure is complex due to rowSpans. Consider simplifying if possible.
                    // A common alternative is repeating Date/ID/Actions for each detail row.
                    return (
                      <>
                        {/* First Row: Date, ID, First Debit, Petty Cash, Receipt, Actions */}
                        <TableRow sx={rowStyle}>
                           {/* Date and ID Cells with RowSpan */}
                           <TableCell rowSpan={totalEntryRows} sx={{ verticalAlign: 'top', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                              {dayjs(entry.created_at).format("YYYY-MM-DD")}
                           </TableCell>
                           <TableCell rowSpan={totalEntryRows} sx={{ verticalAlign: 'top', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                              {entry.id}
                           </TableCell>

                           {/* First Debit Account (or empty if no debits) */}
                           <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                              {debitCount > 0 ? (
                                 debitCount > 1 ? `من مذكورين / ${entry.debit[0]?.account?.name}` : `من ح / ${entry.debit[0]?.account?.name}`
                              ) : ''}
                           </TableCell>
                           <TableCell align="right">
                                {debitCount > 0 ? formatNumber(entry.debit[0]?.amount) : ''}
                           </TableCell>
                           <TableCell align="right"></TableCell> {/* Placeholder for credit amount */}

                           {/* Petty Cash Button Cell (rowSpan over detail rows) */}
                           <TableCell rowSpan={totalDetailRows} sx={{ verticalAlign: 'top', textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                               <Button
                                 size="small"
                                 variant={entry.hasPetty ? "outlined" : "contained"} // Style indicates status
                                 color={entry.hasPetty ? "success" : "primary"}
                                 disabled={entry.hasPetty || entry.cancel} // Disable if already has or cancelled
                                 onClick={() => handleCreatePettyCash(entry)}
                                >
                                    {entry.hasPetty ? "تم الإنشاء" : "إنشاء"}
                                </Button>
                           </TableCell>

                            {/* Receipt Upload/View Cell (rowSpan over detail rows) */}
                           <TableCell rowSpan={totalDetailRows} sx={{ verticalAlign: 'top', textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                                {entry.file_name ? (
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <IconButton size="small" href={entry.file_name} target="_blank" color="info">
                                            <Eye />
                                        </IconButton>
                                        {/* Optionally allow re-upload */}
                                        <IconButton size="small" component="label" disabled={entry.cancel}>
                                             <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateFile(e.target.files[0], entry)} />
                                             <Plus color="orange"/> {/* Indicate re-upload */}
                                        </IconButton>
                                    </Stack>
                                ) : (
                                    <Button size="small" component="label" disabled={entry.cancel} variant="outlined">
                                        رفع ملف
                                        <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateFile(e.target.files[0], entry)} />
                                    </Button>
                                )}
                           </TableCell>

                            {/* Cancel Button Cell (rowSpan over all rows) */}
                            <TableCell rowSpan={totalEntryRows} sx={{ verticalAlign: 'top', textAlign: 'center' }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    disabled={entry.cancel}
                                    onClick={() => handleReverseEntry(entry)}
                                >
                                    {entry.cancel ? "ملغي" : "إلغاء"}
                                </Button>
                           </TableCell>
                        </TableRow>

                        {/* Remaining Debit Rows */}
                        {entry.debit?.slice(1).map((e, debitIndex) => (
                          <TableRow key={`dr-${e.id}`} sx={rowStyle}>
                             <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{`....... ح / ${e?.account?.name}`}</TableCell>
                             <TableCell align="right">{formatNumber(e?.amount)}</TableCell>
                             <TableCell align="right"></TableCell>{/* Credit placeholder */}
                          </TableRow>
                        ))}

                        {/* First Credit Row */}
                        <TableRow key={`cr-${entry.credit?.[0]?.id || 'first'}`} sx={rowStyle}>
                             <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                                {creditCount > 0 ? (
                                    creditCount > 1 ? `إلى مذكورين / ${entry.credit[0]?.account?.name}` : `إلى ح / ${entry.credit[0]?.account?.name}`
                                ) : ''}
                             </TableCell>
                             <TableCell align="right"></TableCell> {/* Debit placeholder */}
                             <TableCell align="right">
                                 {creditCount > 0 ? formatNumber(entry.credit[0]?.amount) : ''}
                             </TableCell>
                        </TableRow>

                         {/* Remaining Credit Rows */}
                        {entry.credit?.slice(1).map((e, creditIndex) => (
                          <TableRow key={`cr-${e.id}`} sx={rowStyle}>
                             <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{`....... ح / ${e?.account?.name}`}</TableCell>
                             <TableCell align="right"></TableCell>{/* Debit placeholder */}
                             <TableCell align="right">{formatNumber(e?.amount)}</TableCell>
                          </TableRow>
                        ))}


                        {/* Description Row */}
                        <TableRow sx={rowStyle}>
                          <TableCell
                            colSpan={3} // Span across Desc, Debit, Credit columns
                            sx={{
                              fontWeight: "normal", // Less emphasis than header
                              fontSize: "0.8rem",
                              color: "text.secondary",
                              borderTop: '1px dashed rgba(224, 224, 224, 1)', // Separator line
                              padding: '4px 8px', // Adjust padding
                            }}
                          >
                            {showLink ? (
                              <Button
                                size="small"
                                variant="text" // Less prominent than outlined
                                target="_blank"
                                href={link}
                                sx={{ p: 0, textTransform: 'none', justifyContent: 'flex-start' }} // Align left
                              >
                                {entry.description}
                              </Button>
                            ) : (
                               // Make description readable, not an input unless editing is intended
                               <Typography  variant="h6" display="block">
                                  {entry.description}
                               </Typography>
                            // If you need editing, use a controlled TextField and an edit state
                            // <TextField variant="standard" InputProps={{ disableUnderline: true }} sx={{width: '100%'}} multiline defaultValue={entry.description} size="small"/>
                            )}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  }))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Grid>

      {/* Add Entry Dialog */}
      <EmptyDialog setShow={setShowAddForm} show={showAddForm}>
        <AddEntryForm
          // Pass necessary props down
          // setUpdate={setUpdate} // If AddEntryForm uses this to trigger refetch
          setEntries={setAllEntries} // AddEntryForm should update the main list
          loading={loading} // Pass loading state if needed inside form
          // setDialog={setDialog} // Pass if used
          setLoading={setLoading} // Pass if form controls global loading
          onAddSuccess={() => {
             setShowAddForm(false); // Close dialog on success
             fetchEntriesByDate(firstDate, secondDate); // Refetch data after adding
          }}
          onClose={() => setShowAddForm(false)} // Handle closing without adding
        />
      </EmptyDialog>
    </Grid>
  );
}

export default AccountEntries;