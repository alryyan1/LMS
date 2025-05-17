import {
  Autocomplete, // Import Autocomplete
  // Badge, // No longer needed if using text prefixes
  Box, // Import Box for layout
  Button,
  // Checkbox, // Not used here
  Chip, // Keep Chip for potential future use or minor indicators
  FormControl, // Import FormControl
  // FormControlLabel, // Not used here
  Grid,
  IconButton,
  InputLabel, // Import InputLabel
  MenuItem, // Import MenuItem for Select
  Pagination, // <-- Import Pagination
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
  useTheme, // Import useTheme to access theme colors
} from "@mui/material";
import { Fragment, useEffect, useMemo, useState, ChangeEvent } from "react"; // Import Fragment, ChangeEvent
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import dayjs from "dayjs";
import AddEntryForm from "./AddEntryForm.js"; // Ensure correct path if needed
import {
  formatNumber,
  // host, // Not used here
  // schema, // Not used here
  sendNotifications,
  webUrl,
} from "../constants.js";
import DateComponent from "./DateComponent.js"; // Ensure correct path if needed
// import GeminiImageUploader from "./Gemini.tsx"; // Uncomment if needed
import EmptyDialog from "../Dialogs/EmptyDialog.js"; // Ensure correct path if needed
import { Eye, Plus, XCircle, RotateCcw, Receipt, FileUp, Delete } from "lucide-react"; // Added more specific icons

// --- Define expected types (optional but recommended) ---
interface Account {
  id: number;
  name: string;
}
interface EntryDetail {
  id: number;
  amount: number;
  account_id: number; // Assuming this field exists
  account?: Account;
}
interface Entry {
  id: number;
  created_at: string;
  description: string;
  cancel: boolean;
  hasPetty: boolean;
  debit: EntryDetail[];
  credit: EntryDetail[];
  doctor_shift_id?: number | null;
  user_net?: number | null;
  file_name?: string | null;
}
// ---------------------------------------------------------

function AccountEntries() {
  const [allEntries, setAllEntries] = useState<Entry[]>([]); // Store the master list with type
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false); // Loading state for accounts
  const [showAddForm, setShowAddForm] = useState(false);
  // const { dilog, setDialog } = useOutletContext(); // Assuming setDialog might be used in AddEntryForm
  const [settings, setSettings] = useState(null);
  const [firstDate, setFirstDate] = useState(dayjs().startOf("month"));
  const [secondDate, setSecondDate] = useState(dayjs());
  const [allAccounts, setAllAccounts] = useState<Account[]>([]); // State for accounts list with type
  const theme = useTheme(); // Access theme for styling

  // --- Filter States ---
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null); // Use null for 'all'
  const [filterHasPetty, setFilterHasPetty] = useState<string>("all"); // 'all', 'yes', 'no'
  const [searchTerm, setSearchTerm] = useState<string>(""); // For description search

  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of entries per page

  // --- Styling Constants ---
  const headerCellStyle = {
      fontWeight: 'bold',
      backgroundColor: 'grey.200',
      textAlign: 'center',
      borderRight: '1px solid rgba(224, 224, 224, 0.5)', // Lighter border
      borderBottom: '2px solid rgba(0, 0, 0, 0.12)', // Stronger bottom border for header
      whiteSpace: 'nowrap', // Prevent wrapping
      px: 1, // Add some horizontal padding
  };
  const cellBorderStyle = {
      borderRight: '1px solid rgba(224, 224, 224, 0.5)',
      borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
  };
   const centeredCellStyle = {
      ...cellBorderStyle,
      textAlign: 'center',
      verticalAlign: 'middle',
   };

   // Separate styles for debit/credit amounts
   const debitAmountCellStyle = {
      ...cellBorderStyle,
      textAlign: 'left', // Debit amounts right-aligned
      verticalAlign: 'top',
      fontFamily: 'monospace',
      fontSize: '1.1rem',
      px: 1,
   };
   const creditAmountCellStyle = {
      ...cellBorderStyle,
      textAlign: 'left', // Credit amounts left-aligned
      verticalAlign: 'top',
      fontFamily: 'monospace',
      fontSize: '1.1rem',
      px: 1,
   };

   const accountCellStyle = {
      ...cellBorderStyle,
      textAlign: 'right', // Align account names right (RTL default)
      verticalAlign: 'top',
      fontSize: '0.85rem',
      px: 1,
   };
   const indentedAccountCellStyle = {
      ...accountCellStyle,
      paddingRight: theme.spacing(4), // Indent credit accounts
   };
   const descriptionCellStyle = {
       ...cellBorderStyle,
       fontSize: "0.8rem",
       color: "text.secondary",
       padding: '4px 8px',
       textAlign: 'right',
       verticalAlign: 'top',
       borderTop: '1px dashed rgba(224, 224, 224, 0.8)',
   };


  useEffect(() => {
    document.title = "قيود اليومية";
    // Fetch Accounts
    setLoadingAccounts(true);
    axiosClient.get("accounts")
      .then(({ data }) => {
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
          `financeEntries?first=${startDate.format("YYYY-MM-DD")}&second=${endDate.format("YYYY-MM-DD")}`
        );
      })
      .then(({ data: entriesData }) => {
        setAllEntries(Array.isArray(entriesData?.data) ? entriesData.data : Array.isArray(entriesData) ? entriesData : []);
        console.log(entriesData, "initial entries");
      })
      .catch(error => {
        console.error("Error fetching settings or entries:", error);
        setAllEntries([]);
      })
      .finally(() => setLoading(false));

  }, []);


  const fetchEntriesByDate = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    setLoading(true);
    axiosClient(
        `financeEntries?first=${start.format("YYYY-MM-DD")}&second=${end.format("YYYY-MM-DD")}`
      )
        .then(({ data }) => {
            setAllEntries(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
            setPage(1); // Reset to first page after fetching new data
        })
        .catch(err => {
            console.error("Error fetching entries by date:", err);
            setAllEntries([]);
        })
        .finally(() => setLoading(false));
  }

  const filteredEntries = useMemo(() => {
    const filtered = allEntries.filter((entry) => {
      const descriptionMatch = searchTerm
        ? entry.description?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const accountMatch = selectedAccountId
        ? entry.debit.some((d) => d.account_id === selectedAccountId || d.account?.id === selectedAccountId) ||
          entry.credit.some((c) => c.account_id === selectedAccountId || c.account?.id === selectedAccountId)
        : true;
      const pettyMatch =
        filterHasPetty === "all"
          ? true
          : filterHasPetty === "yes"
          ? entry.hasPetty === true
          : entry.hasPetty === false;
      return descriptionMatch && accountMatch && pettyMatch;
    });
     // Reset page if current page becomes invalid after filtering
     const newPageCount = Math.ceil(filtered.length / rowsPerPage);
     if(page > newPageCount && newPageCount > 0) {
         setPage(1) // Or setPage(newPageCount) maybe? Resetting to 1 is safer.
     } else if (filtered.length === 0) {
         setPage(1); // Reset if no results
     }
     return filtered;
  }, [allEntries, searchTerm, selectedAccountId, filterHasPetty, page, rowsPerPage]); // Add page and rowsPerPage dependencies

  // --- Calculate data for the current page ---
  const entriesToShow = useMemo(() => {
      const startIndex = (page - 1) * rowsPerPage;
      return filteredEntries.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredEntries, page, rowsPerPage]);

  const pageCount = useMemo(() => {
      return Math.ceil(filteredEntries.length / rowsPerPage);
  }, [filteredEntries, rowsPerPage]);

  // --- Event Handlers ---
  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
      setPage(value);
      // Optional: scroll to top if desired
      // window.scrollTo(0, 0);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<{ value: unknown }>) => {
      setRowsPerPage(parseInt(event.target.value as string, 10));
      setPage(1); // Reset to page 1 when rows per page changes
  };

  const updateFile = (file: File | null, entry: Entry) => {
     if (file) {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("entry_id", entry.id.toString());
      axiosClient.post("handleIncomeProoveFile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then(({data}) => {
         if (data?.data?.file_name || data?.data) { // Check if file name exists or if whole entry is returned
             // Update the master list first
             const updatedAllEntries = allEntries.map(item =>
                 item.id === entry.id ? { ...item, file_name: data.data.file_name ?? item.file_name, ...data.data } : item
             );
             setAllEntries(updatedAllEntries);
         }
         console.log('File upload response:', data);
      }).catch(err => {
          console.error("File upload failed:", err);
          alert("فشل رفع الملف.");
      });
    }
  };

  const handleCreatePettyCash = (entry: Entry) => {
     let result = confirm("هل تريد انشاء اذن الصرف؟");
     if (result) {
        const amount = entry.credit.reduce((prev, curr) => prev + curr.amount, 0);
        setLoading(true);
        axiosClient
        .post("createPettyCash", {
            amount: amount,
            finance_entry_id: entry.id,
            description: entry.description,
        })
        .then(({ data }) => {
            if (data?.data?.entry) {
                // Update master list
                const updatedAllEntries = allEntries.map((item) => item.id === entry.id ? data.data.entry : item);
                setAllEntries(updatedAllEntries);
                sendNotifications(
                    data.data.id,
                    "اذن صرف جديد",
                    `${data.data.description} \n  المبلغ  ${formatNumber(data.data.amount)}   `
                );
            } else {
                 console.warn("Create petty cash response structure unexpected:", data);
                 // Refetch might be needed if state update isn't guaranteed
                 // fetchEntriesByDate(firstDate, secondDate);
            }
        })
        .catch(err => {
            console.error("Failed to create petty cash:", err);
            alert("فشل انشاء اذن الصرف.");
        })
        .finally(() => setLoading(false));
    }
  }

  const handleReverseEntry = (entry: Entry) => {
     const result = confirm("سيتم عكس القيد والاشاره بشطب القيد الحالي. هل انت متأكد؟");
     if (result) {
        setLoading(true);
        axiosClient
        .post(`reverseEntry/${entry.id}`)
        .then(({ data }) => {
            if (data?.data) {
                 // Update master list
                const updatedAllEntries = allEntries.map((e) => e.id === entry.id ? data.data : e);
                setAllEntries(updatedAllEntries);
                 alert("تم عكس القيد بنجاح.");
            } else {
                console.warn("Reverse entry response structure unexpected:", data);
                 // Refetch might be needed if state update isn't guaranteed
                // fetchEntriesByDate(firstDate, secondDate);
            }
        })
        .catch(err => {
            console.error("Failed to reverse entry:", err);
            alert("فشل عكس القيد.");
        })
        .finally(() => setLoading(false));
    }
  }

  const deleteEntry = (entry) =>{
        const result = confirm("هل انت متأكد من حذف القيد؟");
        if (result) {
            setLoading(true);
            axiosClient
            .delete(`financeEntries/${entry.id}`)
            .then(({ data }) => {
                    // Update master list
                    const updatedAllEntries = allEntries.filter((e) => e.id !== entry.id);
                    setAllEntries(updatedAllEntries);
                    alert("تم حذف القيد بنجاح.");
                
            })
            .catch(err => {
                console.error("Failed to delete entry:", err);
                alert("فشل حذف القيد.");
            })
            .finally(() => setLoading(false));
        }   
  }

  const clearFilters = () => {
    setSelectedAccountId(null);
    setFilterHasPetty('all');
    setSearchTerm('');
    setPage(1); // Reset page when clearing filters
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, overflow: 'hidden' }}> {/* Prevent horizontal overflow */}
          {/* --- Top Action Bar --- */}
          <Stack direction="row" spacing={1} alignItems="center" mb={2} flexWrap="wrap">
            <Button variant="contained" startIcon={<Plus size={18}/>} onClick={() => setShowAddForm(true)} size="small">
              إضافة قيد
            </Button>
            <DateComponent
                onDateChange={fetchEntriesByDate}
                setFirstDate={setFirstDate}
                setSecondDate={setSecondDate}
                firstDate={firstDate}
                secondDate={secondDate}
            />
            {/* Add check for filteredEntries length before showing PDF/Excel buttons? */}
            <Button variant="outlined" size="small" href={`${webUrl}entries?first=${firstDate.format("YYYY-MM-DD")}&second=${secondDate.format("YYYY-MM-DD")}`} target="_blank">
              PDF
            </Button>
            <Button variant="outlined" size="small" href={`${webUrl}entries-excel?first=${firstDate.format("YYYY-MM-DD")}&second=${secondDate.format("YYYY-MM-DD")}`}>
              Excel
            </Button>
          </Stack>

          {/* --- Filters Section --- */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
             <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={6} md={4}>
                    <TextField fullWidth label="بحث بالبيان" variant="outlined" size="small" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}/>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Autocomplete
                        fullWidth
                        options={allAccounts}
                        getOptionLabel={(option) => option.name || ""}
                        value={allAccounts.find(acc => acc.id === selectedAccountId) || null}
                        onChange={(event, newValue) => {setSelectedAccountId(newValue ? newValue.id : null); setPage(1);}}
                        loading={loadingAccounts}
                        renderInput={(params) => (<TextField {...params} label="فلتر بالحساب" size="small" />)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="has-petty-filter-label">إذن صرف؟</InputLabel>
                        <Select labelId="has-petty-filter-label" label="إذن صرف؟" value={filterHasPetty} onChange={(e) => {setFilterHasPetty(e.target.value as string); setPage(1);}}>
                            <MenuItem value="all">الكل</MenuItem>
                            <MenuItem value="yes">نعم</MenuItem>
                            <MenuItem value="no">لا</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                 <Grid item xs={12} sm={6} md={2}>
                    <Button fullWidth variant="text" size="small" onClick={clearFilters} startIcon={<XCircle size={16}/>} disabled={!selectedAccountId && filterHasPetty === 'all' && !searchTerm}>
                        مسح الفلاتر
                    </Button>
                </Grid>
             </Grid>
          </Paper>

          {/* --- Entries Table --- */}
          {loading ? (
            <Skeleton variant="rectangular" height={window.innerHeight - 250} /> // Adjust height slightly
          ) : (
             <> {/* Use Fragment to wrap TableContainer and Pagination */}
                <TableContainer sx={{ maxHeight: `${window.innerHeight - 250}px`, overflow: "auto" }}> {/* Adjust height */}
                {/* Use borderCollapse: 'collapse' for standard table border behavior */}
                <Table stickyHeader sx={{ width: "100%", borderCollapse: 'collapse' }} dir="rtl" size="small">
                    <TableHead>
                    <TableRow sx={{ '& th': headerCellStyle }}>
                        {/* Removed specific radius styles for collapse mode */}
                        <TableCell sx={{ minWidth: 100 }}>التاريخ</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>رقم القيد</TableCell>
                        <TableCell sx={{ minWidth: 350, textAlign: 'right' }}>الحساب / البيان</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>مدين</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>دائن</TableCell>
                        <TableCell sx={{ minWidth: 180, borderRight: 'none' }}>إجراءات</TableCell>
                    </TableRow>
                    </TableHead>
                    {/* Removed the Box wrapper */}
                    <TableBody>
                    {entriesToShow.length === 0 ? ( // Check entriesToShow for current page
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 5, border: 'none' }}>
                            <Typography color="text.secondary">
                                {allEntries.length > 0 ? 'لا توجد قيود تطابق البحث في هذه الصفحة.' : 'لا توجد قيود للعرض.'}
                            </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        // *** Map over entriesToShow instead of filteredEntries ***
                        entriesToShow.map((entry) => {
                            const debitCount = entry.debit?.length || 0;
                            const creditCount = entry.credit?.length || 0;
                            const totalRowsForEntry = debitCount + creditCount + 1;

                            // Counter for alternating row style within an entry
                            let rowIndexWithinEntry = 0;

                            const getRowStyle = () => {
                                const isOddRow = rowIndexWithinEntry % 2 !== 0;
                                rowIndexWithinEntry++; // Increment for the next row
                                return {
                                    textDecoration: entry.cancel ? "line-through" : "none",
                                    opacity: entry.cancel ? 0.6 : 1,
                                    // Apply alternating background color
                                    backgroundColor: isOddRow ? theme.palette.action.hover : 'transparent',
                                    // Ensure cancelled entry background overrides alternating color
                                    ...(entry.cancel && { backgroundColor: theme.palette.action.disabledBackground }),
                                    '& td': { verticalAlign: 'top' }, // Default top align cells
                                    // Add a subtle top border to visually separate rows within the entry block
                                    '&:not(:first-of-type) td': {
                                        borderTop: `1px solid ${theme.palette.divider}`
                                    }
                                };
                            };

                            // Style for the last row of the entry to add a stronger bottom border
                            const lastRowStyle = {
                                '& td': {
                                    borderBottom: `2px solid ${theme.palette.divider}`, // Separator between entries
                                }
                            };

                            let showLink = false;
                            let link = "";
                            if (entry.doctor_shift_id != null || entry.user_net != null) showLink = true;
                            if (entry.doctor_shift_id != null) link = `${webUrl}clinics/doctor/report?doctorshift=${entry.doctor_shift_id}`;
                            if (entry.user_net != null) link = `${webUrl}clinics/all?user_id=${entry.user_net}`;

                            return (
                            // Use React.Fragment to group rows logically for styling
                            <Fragment key={entry.id}>
                                {/* --- Debit Rows --- */}
                                {entry.debit.map((d, index) => (
                                    <TableRow sx={getRowStyle()} key={`dr-${d.id}`}>
                                        {/* Render Date, ID, Actions only on the first row */}
                                        {index === 0 && (
                                            <>
                                                <TableCell rowSpan={totalRowsForEntry} sx={{...centeredCellStyle, borderBottom: 'none',textAlign:'center'}}>
                                                    {dayjs(entry.created_at).format("YYYY-MM-DD")}
                                                </TableCell>
                                                <TableCell  rowSpan={totalRowsForEntry} sx={{...centeredCellStyle, borderBottom: 'none',textAlign:'center'}}>
                                                    {entry.id}
                                                </TableCell>
                                            </>
                                        )}
                                        {/* Account Name */}
                                        <TableCell sx={{...accountCellStyle, textAlign: 'left'}}>
                                            <Typography sx={{color:'purple',fontSize:'1rem',fontWeight:'bolder'}} textAlign={'left'} variant="body2" component="span">
                                                {index === 0 && debitCount > 1 && 'من مذكورين:'}
                                                {index === 0 && debitCount === 1 && 'من ح/'}
                                                {index !== 0 && 'ح/'}
                                                {' '} {d.account?.name}
                                            </Typography>
                                        </TableCell>
                                        {/* Debit Amount */}
                                        <TableCell  sx={debitAmountCellStyle}>{formatNumber(d.amount)}</TableCell>
                                        {/* Credit Amount (empty) */}
                                        <TableCell sx={creditAmountCellStyle}></TableCell>
                                        {/* Render Actions only on the first row */}
                                        {index === 0 && (
                                            <TableCell rowSpan={totalRowsForEntry} sx={{ ...centeredCellStyle, borderRight: 'none', borderBottom: 'none', verticalAlign: 'middle' }}>
                                                <Stack direction="column" spacing={0.5} alignItems="center">
                                                    <Button
                                                        size="small"
                                                        variant={entry.hasPetty ? "outlined" : "contained"}
                                                        color={entry.hasPetty ? "success" : "info"}
                                                        disabled={entry.hasPetty || entry.cancel}
                                                        onClick={() => handleCreatePettyCash(entry)}
                                                        startIcon={<Receipt size={14}/>}
                                                        sx={{width: '120px', fontSize: '0.75rem'}}
                                                    >
                                                        {entry.hasPetty ? "تم الصرف" : "إذن صرف"}
                                                    </Button>
                                                    {entry.file_name ? (
                                                        <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                                                            <IconButton size="small" href={entry.file_name} target="_blank" color="primary" title="عرض المستند">
                                                                <Eye size={16}/>
                                                            </IconButton>
                                                            <IconButton size="small" component="label" disabled={entry.cancel} color="warning" title="تغيير المستند">
                                                                <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateFile(e.target.files ? e.target.files[0] : null, entry)} />
                                                                <FileUp size={16}/>
                                                            </IconButton>
                                                        </Stack>
                                                    ) : (
                                                        <Button size="small" component="label" disabled={entry.cancel} variant="outlined" startIcon={<FileUp size={14}/>} sx={{width: '120px', fontSize: '0.75rem'}}>
                                                            رفع مستند
                                                            <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateFile(e.target.files ? e.target.files[0] : null, entry)} />
                                                        </Button>
                                                    )}
                                                    <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    disabled={entry.cancel}
                                                    onClick={() => deleteEntry(entry)}
                                                    startIcon={<Delete size={14}/>}
                                                    sx={{width: '120px', fontSize: '0.75rem'}}
                                                    >
                                                    حذف القيد
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}

                                {/* --- Credit Rows --- */}
                                {entry.credit.map((c, index) => (
                                    <TableRow sx={getRowStyle()} key={`cr-${c.id}`}>
                                        {/* Account Name (Indented) */}
                                        <TableCell  sx={{...indentedAccountCellStyle,textAlign:'right'}}>
                                            <Typography sx={{color:'blue',fontSize:'1rem',fontWeight:'bolder'}}  textAlign={'right'} variant="body2" component="span">
                                                {index === 0 && creditCount > 1 && 'إلى مذكورين:'}
                                                {index === 0 && creditCount === 1 && 'إلى ح/'}
                                                {index !== 0 && 'ح/'}
                                                {' '} {c.account?.name}
                                            </Typography>
                                        </TableCell>
                                        {/* Debit Amount (empty) */}
                                        <TableCell sx={debitAmountCellStyle}></TableCell>
                                        {/* Credit Amount */}
                                        <TableCell sx={creditAmountCellStyle}>{formatNumber(c.amount)}</TableCell>
                                    </TableRow>
                                ))}

                                {/* --- Description Row --- */}
                                <TableRow sx={{...getRowStyle(), ...lastRowStyle}}>
                                    <TableCell
                                        colSpan={3} // Span Account, Debit, Credit columns
                                        // Remove bottom border from cell style, apply via lastRowStyle on TR
                                        sx={{...descriptionCellStyle, borderBottom: 'none',textAlign:'center'}}
                                    >
                                        {showLink ? (
                                            <Button size="small" variant="text" target="_blank" href={link} sx={{ p: 0, textTransform: 'none', justifyContent: 'flex-start', fontSize: 'inherit', color: 'inherit', '&:hover': {backgroundColor: 'transparent'} }}>
                                                {entry.description}
                                            </Button>
                                        ) : (
                                          <Paper>
                                             <Typography  textAlign={'center'} variant="h6" component="span" display="block">
                                                {entry.description}
                                            </Typography>
                                          </Paper>
                                           
                                        )}
                                    </TableCell>
                                </TableRow>
                            </Fragment> // End of React.Fragment wrapping the entry rows
                            );
                        })) // End map entriesToShow
                      }
                    </TableBody>
                </Table>
                </TableContainer>

                 {/* --- Pagination Controls --- */}
                 {pageCount > 1 && ( // Only show pagination if there's more than one page
                    <Stack spacing={2} sx={{ p: 2, alignItems: 'center', direction: 'ltr' }}>
                         {/* Optional: Rows per page selector */}
                         {/* <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
                            <Select
                                labelId="rows-per-page-label"
                                value={rowsPerPage}
                                label="Rows per page"
                                onChange={handleRowsPerPageChange}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                         </FormControl> */}
                         <Pagination
                            count={pageCount}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                         />
                    </Stack>
                 )}
             </> // End Fragment wrapping TableContainer and Pagination
          )}
        </Paper>
      </Grid>

      {/* Add Entry Dialog */}
      <EmptyDialog setShow={setShowAddForm} show={showAddForm}>
        <AddEntryForm
          setEntries={setAllEntries} // Pass the setter for the *master* list
          loading={loading}
          setLoading={setLoading}
          onAddSuccess={() => {
             setShowAddForm(false);
             // You might not need to refetch *all* data here.
             // AddEntryForm could potentially return the new entry,
             // allowing you to prepend/append it to `allEntries` directly.
             // However, refetching ensures consistency if other users added entries.
             fetchEntriesByDate(firstDate, secondDate);
          }}
          onClose={() => setShowAddForm(false)}
        />
      </EmptyDialog>
    </Grid>
  );
}

export default AccountEntries;