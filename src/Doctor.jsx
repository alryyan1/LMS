// import CircularProgess from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper';
import { TextField } from '@mui/material';
import { Add } from '@mui/icons-material';

const Doctor = ()=>{
    return (
        <div>
            doctos page
            <Add></Add>
            <Paper sx={{padding:4}} elevation={3}>
                <TextField label={'اسم الطبيب'}></TextField>
                <TextField label={'رقم الهاتف'}></TextField>
            </Paper>
        </div>
    )
}

export default Doctor;