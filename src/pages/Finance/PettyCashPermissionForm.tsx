// src/components/PettyCashPermissionForm.jsx

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Box, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'moment/locale/ar'; // استيراد اللغة العربية لـ Moment.js
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import axiosClient from '../../../axios-client';
import PettyCashPermissionsTable from './PettyCashTable';

function PettyCashPermissionForm() {
    const { t, i18n } = useTranslation('pettyCashForm');
    const { control, handleSubmit, formState: { errors }, setValue } = useForm();
    const [accounts, setAccounts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        // تحميل قائمة الحسابات من الـ API
        axiosClient.get('accounts')
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => {
                console.error('Error fetching accounts:', error);
                setErrorMessage(t('error_fetching_accounts'));
            });

        // تغيير لغة Moment.js بناءً على لغة التطبيق
        moment.locale(i18n.language);
    }, [i18n.language, t]);

    const onSubmit = async (data) => {
        console.log("onSubmit function called!");  // Add this line
        try {
            const formData = new FormData();
            formData.append('permission_number', data.permission_number);
            formData.append('date', moment(selectedDate).format('YYYY-MM-DD')); // تنسيق التاريخ
            formData.append('amount', data.amount);
            formData.append('beneficiary', data.beneficiary);
            formData.append('description', data.description);
            formData.append('finance_account_id', data.finance_account_id);
            if (data.pdf_file) {
                formData.append('pdf_file', data.pdf_file[0]); // إرسال الملف
            }

            const response = await axiosClient.post('/petty-cash-permissions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // مهم لإرسال الملفات
                }
            });

            setSuccessMessage(t('permission_created_successfully'));
            setErrorMessage('');
             // Reset the form values
             setValue('permission_number', '');
             setValue('amount', '');
             setValue('beneficiary', '');
             setValue('description', '');
             setValue('finance_account_id', '');
             setValue('pdf_file', null);
             setSelectedDate(null);

        } catch (error) {
            console.error('Error creating permission:', error.response?.data?.errors);
            setErrorMessage(t('error_creating_permission'));
            setSuccessMessage('');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment} locale={i18n.language}>
            <Box sx={{ padding: 3 }}>
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                    
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Controller
                                    name="date"
                                    control={control}
                                    defaultValue={null}
                                    // REMOVED RULES!
                                    render={({ field }) => (
                                        <DatePicker
                                            label={t('date')}
                                            value={selectedDate}
                                            onChange={(date) => {
                                                setSelectedDate(date);
                                            }}
                                            renderInput={(params) => <TextField {...params} /*error={!!errors.date}*/
                                                /*helperText={errors.date?.message}*/ />} //REMOVED
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="amount"
                                control={control}
                                defaultValue=""
                                // REMOVED RULES!
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t('amount')}
                                        variant="outlined"
                                        fullWidth
                                        //error={!!errors.amount}  REMOVED
                                        //helperText={errors.amount?.message} REMOVED
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="beneficiary"
                                control={control}
                                defaultValue=""
                                 // REMOVED RULES!
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t('beneficiary')}
                                        variant="outlined"
                                        fullWidth
                                        //error={!!errors.beneficiary}  REMOVED
                                        //helperText={errors.beneficiary?.message} REMOVED
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t('description')}
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Grid>

                   

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="pdf_file"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => field.onChange(e.target.files)}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                {t('submit')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default PettyCashPermissionForm;