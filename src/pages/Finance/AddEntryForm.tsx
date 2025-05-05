import { Autocomplete, Button, Paper, Stack, TextField, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../axios-client";
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs'; // Import dayjs
import DynamicTable from "./IncomeStatement";
import { Account } from "../../types/type";
import { host, schema } from "../constants";

// const initialDebitCreditEntry = { id: uuidv4(), account: null, amount: '' }; // Define initial debit/credit entry
// const initialCreditEntry = { id: uuidv4(), account: null, amount: '' }; // Define initial debit/credit entry
interface AddEntryFormProps {
  setLoading: (loading: boolean) => void; // Function to set loading state
  setDialog: (dialog: boolean) => void; // Function to set dialog state
  loading: boolean; // Loading state
  setEntries: (entries: any[]) => void; // Function to set entries state
  setUpdate: (update: number) => void; // Function to set update state
  desc?: string; // Optional description prop
  amount?: number; // Optional amount prop
  permissionId?: number; // Optional permission ID prop
  setAllPermissions: (permissions: any[]) => void; // Function to set all permissions state
}
function AddEntryForm({ setLoading, setDialog, loading, setEntries, setUpdate,desc ,amount,permissionId,setAllPermissions}: AddEntryFormProps) {
  const [accounts, setAccounts] = useState([]);
  const initialDebitCreditEntry = { id: uuidv4(), account: null, amount:amount }; // Define initial debit/credit entry
  const initialCreditEntry = { id: uuidv4(), account: null, amount:amount }; // Define initial debit/credit entry
  const [balanceError, setBalanceError] = useState(''); // State for balance error message
  const { t } = useTranslation('addEntry'); // Initialize translation hook
const [selectedAccounts,setSelectedAccounts]= useState<Account[]>([])
  const {
    register,
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    trigger, // Import trigger
  } = useForm({
    defaultValues: {
      amount: amount || '', // Set default amount if provided
      description: desc?.toString() || '',
      date: dayjs(), // Set default date to today
      debits: [initialDebitCreditEntry], // Initialize with one debit entry
      credits: [initialDebitCreditEntry], // Initialize with one credit entry
    },
  });
  console.log(desc, 'desc', amount, 'amount')
  const [debitAccounts, setDebitAccounts] = useState([initialDebitCreditEntry]);
  const [creditAccounts, setCreditAccounts] = useState([initialDebitCreditEntry]);

  const submitHandler = async (formData) => {
    // Validate balance before submission
    const debitSum = formData.debits.reduce((sum, debit) => sum + Number(debit.amount || 0), 0);
    const creditSum = formData.credits.reduce((sum, credit) => sum + Number(credit.amount || 0), 0);

    if (debitSum !== creditSum) {
      setBalanceError(t('balanceError')); // Use translation for balance error
      return; // Stop submission
    } else {
      setBalanceError(''); // Clear any previous error
    }

    setLoading(true);
    try {
      // Format the date to send to the backend (YYYY-MM-DD)
      const formattedDate = dayjs(formData.date).format('YYYY-MM-DD');

      // Transform debit and credit arrays to send objects with account ID and amount
      const transformedDebits = formData.debits.map(debit => ({
        account: debit.account?.id,
        amount: debit.amount,
      })).filter(debit => debit.account !== undefined && debit.account !== null);

      const transformedCredits = formData.credits.map(credit => ({
        account: credit.account?.id,
        amount: credit.amount,
      })).filter(credit => credit.account !== undefined && credit.account !== null);


      const { data } = await axiosClient.post("createFinanceEntries", {
        ...formData,
        date: formattedDate, // Send the formatted date
        debits: transformedDebits,
        credits: transformedCredits,
        permission_id: permissionId,
      });

      console.log(data, "created");
      if (data.status) {
        console.log(data.data, 'data      ss s s ');
        setAllPermissions((prev) => prev.map((p)=>{
          if(p.id === permissionId){
            return {...data.petty}
          }
          return p
        }));
        // Reset the form to its initial state
        reset({
          amount: '',
          description: '',
          date: dayjs(), // Reset to today's date
          debits: [initialDebitCreditEntry],
          credits: [initialDebitCreditEntry],
        });
        setSelectedAccounts([]);
        //send notification
        if(setEntries){

          setEntries((prev)=>([data.data,...prev]));
        }

        // Reset the local debit and credit account states
        setDebitAccounts([initialDebitCreditEntry]);
        setCreditAccounts([initialDebitCreditEntry]);

        // setUpdate((prev) => prev + 1);
      
        setLoading(false);
      }
    } catch ( error ) {
        console.log(error)
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    axiosClient.get('financeAccounts').then(({ data }) => {
      setAccounts(data);
    });
  }, []);

  const addDebitAccount = () => {
    setDebitAccounts([...debitAccounts, initialDebitCreditEntry]);
  };

  const addCreditAccount = () => {
    setCreditAccounts([...creditAccounts, initialCreditEntry]);
  };

  // Function to get selected debit account IDs
  const getSelectedDebitAccountIds = () => {
    return debitAccounts.map(debit => debit.account?.id).filter(id => id !== undefined && id !== null);
  };

  // Function to get selected credit account IDs
  const getSelectedCreditAccountIds = () => {
    return creditAccounts.map(credit => credit.account?.id).filter(id => id !== undefined && id !== null);
  };

  const isDebitOptionDisabled = (option) => {
    const selectedDebitIds = getSelectedDebitAccountIds();
    console.log(debitAccounts,' selected')
    return selectedAccounts.map((a)=>a.id).includes(option.id) || option.children.length > 0;
  };

  const isCreditOptionDisabled = (option) => {
    const selectedCreditIds = getSelectedCreditAccountIds();
    return selectedAccounts.map((a)=>a.id).includes(option.id) || option.children.length > 0;
  };

  return (
    <Paper sx={{ p: 1,width:'500px' }}>
      <Typography textAlign={"center"} variant="h5">
        {t('newEntry')} {/* Use translation */}
      </Typography>
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <Stack gap={1}>

          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="date"
              control={control}
              defaultValue={dayjs()} // Initial value if needed
              render={({ field }) => (
                <DatePicker
                format="YYYY-MM-DD"
                  label={t('date')} // Use translation
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="filled"
                      error={!!errors.date}
                      helperText={errors.date?.message}
                    />
                  )}
                />
              )}
            />
          </LocalizationProvider>

          <TextField
            multiline
            rows={4}
            fullWidth
            error={errors.description != null}
            {...register("description", {
              required: { value: true, message: t('descriptionRequired') }, // Use translation
            })}
            id="outlined-basic"
            label={t('entryDescription')}
            variant="filled"
            helperText={errors.description && errors.description.message}
          />

          {/* Debits Section */}
          <Typography variant="subtitle1">
            {t('debits')} {/* Use translation */}
          </Typography>
          {debitAccounts.map((debit, index) => (
            <Grid container spacing={2} key={debit.id}>
              <Grid item xs={8}>
                <Controller
                  name={`debits[${index}].account`}
                  control={control}
                  rules={{ required: t('debitAccountRequired') }} // Use translation
                  render={({ field }) => (
                    <Autocomplete
                      value={field.value || null}
                      onChange={(e, newVal) => {
                        setSelectedAccounts((prev)=>{
                          return [...prev , newVal]
                        })
                        field.onChange(newVal);
                      }}
                      getOptionKey={(op) => op.id}
                      getOptionLabel={(option) => option.name}
                      options={accounts}
                      getOptionDisabled={isDebitOptionDisabled}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`${t('debitAccount')} ${index + 1}`} // Use translation
                          error={!!errors.debits?.[index]?.account}
                          helperText={errors.debits?.[index]?.account?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label={t('amount')} // Use translation
                  type="number"
                  fullWidth
                  {...register(`debits[${index}].amount`, {
                    required: t('amountRequired'), // Use translation
                    valueAsNumber: true, // Ensures the value is a number
                  })}
                  error={!!errors.debits?.[index]?.amount}
                  helperText={errors.debits?.[index]?.amount?.message}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          ))}
          <Button onClick={addDebitAccount}>{t('addDebitAccount')}</Button> {/* Use translation */}

          {/* Credits Section */}
          <Typography variant="subtitle1">
            {t('credits')} {/* Use translation */}
          </Typography>
          {creditAccounts.map((credit, index) => (
            <Grid container spacing={2} key={credit.id}>
              <Grid item xs={8}>
                <Controller
                  name={`credits[${index}].account`}
                  control={control}
                  rules={{ required: t('creditAccountRequired') }} // Use translation
                  render={({ field }) => (
                    <Autocomplete
                      value={field.value || null}
                      onChange={(e, newVal) => {
                        field.onChange(newVal);
                      }}
                      getOptionKey={(op) => op.id}
                      getOptionLabel={(option) => option.name}
                      options={accounts}
                      getOptionDisabled={isCreditOptionDisabled}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`${t('creditAccount')} ${index + 1}`} // Use translation
                          error={!!errors.credits?.[index]?.account}
                          helperText={errors.credits?.[index]?.account?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label={t('amount')} // Use translation
                  type="number"
                  fullWidth
                  {...register(`credits[${index}].amount`, {
                    required: t('amountRequired'), // Use translation
                    valueAsNumber: true, // Ensures the value is a number
                  })}
                  error={!!errors.credits?.[index]?.amount}
                  helperText={errors.credits?.[index]?.amount?.message}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          ))}
          <Button onClick={addCreditAccount}>{t('addCreditAccount')}</Button> {/* Use translation */}

           {/* Balance Error Message */}
           {balanceError && (
            <Typography color="error" textAlign="center">
              {balanceError}
            </Typography>
          )}

          <LoadingButton
            fullWidth
            loading={loading}
            variant="contained"
            type="submit"
          >
            {t('save')} {/* Use translation */}
          </LoadingButton>
        </Stack>
      </form>
      {/* <DynamicTable/> */}
    </Paper>
  );
}

export default AddEntryForm;