import React, { useState, useEffect } from 'react';
import axiosClient from '../../../axios-client';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Box
} from '@mui/material';

function AccountForm({ account, onAccountAdded, onAccountUpdated, onCancel }) {
    const [code, setCode] = useState(account ? account.code : '');
    const [name, setName] = useState(account ? account.name : '');
    const [description, setDescription] = useState(account ? account.description : '');
    const [parents, setParents] = useState([]);
    const [parentId, setParentId] = useState(account?.parent?.id || '');


    useEffect(() => {
        const fetchParents = async () => {
            try {
                const response = await axiosClient.get('accounts');
                setParents(response.data);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };
        fetchParents();
        if (account && account.parent) {
            setParentId(account.parent.id);
        }


    }, [account]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accountData = {
            code: code,
            name: name,
            description: description,
            parent_id: parentId === '' ? null : parentId,
        };

        try {
            if (account) {
                await axiosClient.put(`accounts/${account.id}`, accountData);
                onAccountUpdated();
            } else {
               const response =  await axiosClient.post('accounts', accountData);
                const newAccount =  response.data
                // add the new account to the parents
                setParents((prev)=>{
                     return [...prev, newAccount]
 
                })
                onAccountAdded();
            }

            // Reset the form after successful submission
            setCode('');
            setName('');
            setDescription('');
            setParentId('');


        } catch (error) {
            console.error("Error submitting account:", error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <TextField
                        label="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="parent-select-label">Parent</InputLabel>
                        <Select
                            labelId="parent-select-label"
                            id="parent-select"
                            value={parentId}
                            label="Parent"
                            onChange={(e) => setParentId(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>
                            {parents.map(parent => (
                                <MenuItem key={parent.id} value={parent.id}>
                                    {parent.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button type="submit" variant="contained" color="primary">
                        {account ? 'Update' : 'Add'} Account
                    </Button>
                    {onCancel && (
                        <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}

export default AccountForm;