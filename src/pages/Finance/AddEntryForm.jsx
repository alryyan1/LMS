import { Autocomplete, Button, Paper, Stack, TextField, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../axios-client";
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const initialDebitCreditEntry = { id: uuidv4(), account: null, amount: '' }; // Define initial debit/credit entry

function AddEntryForm({ setLoading, setDialog, loading, setEntries, setUpdate }) {
  const [accounts, setAccounts] = useState([]);
  const [balanceError, setBalanceError] = useState(''); // State for balance error message
  const { t } = useTranslation('addEntry'); // Initialize translation hook

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
    trigger, // Import trigger
  } = useForm({
    defaultValues: {
      amount: '',
      description: '',
      debits: [initialDebitCreditEntry], // Initialize with one debit entry
      credits: [initialDebitCreditEntry], // Initialize with one credit entry
    },
  });

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
        debits: transformedDebits,
        credits: transformedCredits,
      });

      console.log(data, "created");
      if (data.status) {
        console.log(data.data, 'data');
        // Reset the form to its initial state
        reset({
          amount: '',
          description: '',
          debits: [initialDebitCreditEntry],
          credits: [initialDebitCreditEntry],
        });

        // Reset the local debit and credit account states
        setDebitAccounts([initialDebitCreditEntry]);
        setCreditAccounts([initialDebitCreditEntry]);

        setUpdate((prev) => prev + 1);
        setDialog((prev) => ({
          ...prev,
          color: "success",
          open: true,
          message: t('additionSuccess'), // Use translation for addition success message
        }));
        setLoading(false);
      }
    } catch ({ response: { data } }) {
      setDialog((prev) => ({
        ...prev,
        color: "error",
        open: true,
        message: data.message,
      }));
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
    setCreditAccounts([...creditAccounts, initialDebitCreditEntry]);
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
    return selectedDebitIds.includes(option.id);
  };

  const isCreditOptionDisabled = (option) => {
    const selectedCreditIds = getSelectedCreditAccountIds();
    return selectedCreditIds.includes(option.id);
  };

  return (
    <Paper sx={{ p: 1 }}>
      <Typography textAlign={"center"} variant="h5">
        {t('newEntry')} {/* Use translation */}
      </Typography>
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <Stack gap={1}>
          {/* <TextField
            fullWidth
            error={errors.description != null}
            {...register("amount", {
              required: { value: true, message: t('amountRequired') }, // Use translation
            })}
            type="number"
            id="outlined-basic"
            label={t('amount')}
            variant="filled"
            helperText={errors.amount && errors.amount.message}
          /> */}
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
    </Paper>
  );
}

export default AddEntryForm;