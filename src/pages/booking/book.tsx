import React, { useState, useEffect } from 'react';
import axiosClient from '../../../axios-client'; // Adjust path as needed
import {
  Container,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Stack,
  Autocomplete,
  TextField,
  Paper,
  Divider,
  Grid, // Added Grid
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { green, blue, grey } from '@mui/material/colors';  // Import Material UI colors
import { Doctor } from '../../types/Patient';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { toast } from 'react-toastify';

const daysOfWeek = [
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
  'الأحد',
];

function DoctorScheduleManager() {
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]); // Use types here.

  // Structure for managing individual time slots
  const [schedules, setSchedules] = useState(
    daysOfWeek.map((day, index) => ({
      dayOfWeek: index + 1,
      morning: { enabled: false, },
      evening: { enabled: false, },
    }))
  );

  useEffect(() => {
    setLoading(true);
    axiosClient.get('doctors')
      .then(({ data }) => {
        setDoctors(data);
      })
      .catch(error => console.error("Error fetching doctors:", error))
      .finally(() => setLoading(false));
  }, []);



  const handleSelectedDoctorSchedule = async (doctor) => {
  

          //Transform the way this setschedule
          const newSchedules = daysOfWeek.map((day, index) => {
              const dayOfWeek = index + 1;
              const morningSchedule = doctor.schedules?.find(s => s.day_of_week === dayOfWeek && s.time_slot === 'morning');
              const eveningSchedule = doctor.schedules?.find(s => s.day_of_week === dayOfWeek && s.time_slot === 'evening');

              return {
                  dayOfWeek: dayOfWeek,
                  morning: {
                      enabled: !!morningSchedule,
                   
                  },
                  evening: {
                      enabled: !!eveningSchedule,
                  },
              };
          });
          setSchedules(newSchedules);
          console.log('Schedules have been loaded for doctor:', doctor.name);

      
  };

  const handleSlotToggle = (index, slot) => {
    const newSchedules = [...schedules];
    newSchedules[index][slot].enabled = !newSchedules[index][slot].enabled;
    setSchedules(newSchedules);
  };


  const handleSubmit = async () => {
   
      // Prepare data for the API
      const scheduleData = schedules.flatMap(schedule => {
        const dayOfWeek = schedule.dayOfWeek;
      

        const slots = [];

        if (schedule.morning.enabled) {
          slots.push({
            doctor_id: doctorId,
            day_of_week: dayOfWeek,
            time_slot: 'morning',
          
          });
        }

        if (schedule.evening.enabled) {
          slots.push({
            doctor_id: doctorId,
            day_of_week: dayOfWeek,
            time_slot: 'evening',
            
          });
        }
        console.log(slots);
        return slots;
      });

      try {
        const response = await axiosClient.post(`doctors/${doctorId}/schedules`, scheduleData); // Relative URL
        console.log('Schedule saved successfully:', response.data); // Log success
        toast.success(response.data.message)

        // Optionally, show a success message to the user
      } catch (error) {
        console.error('Error saving schedule:', error);
        // Handle errors more gracefully (display to user, log, etc.)
      }
  
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          إدارة جدول الطبيب
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Autocomplete
              onChange={(e, newVal) => {
                newVal ? setDoctorId(newVal.id) : setDoctorId(null)
                handleSelectedDoctorSchedule(newVal);
              }} //Important set the docotr ID
              getOptionLabel={(option) => option ? option.name : ''}
              options={doctors}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="اختر الطبيب"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />

            <Grid container spacing={3} mt={2}>
              {/* Column 1 */}
              <Grid item xs={12} md={6}>
                {daysOfWeek.slice(0, Math.ceil(daysOfWeek.length / 2)).map((day, index) => (
                  <Paper key={index} elevation={2} style={{ marginBottom: '10px', padding: '10px' }}>
                    <Box display="flex"  flexDirection="column"  alignItems="flex-center">
                      <Typography variant='h4' textAlign={'center'} >{day}</Typography>
                      <Divider sx={{ width: '100%', mb: 1 }} />
                      <Stack direction="row" alignItems="center" justifyContent="space-around" width="100%">
                        {/* Morning Slot */}
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography textAlign={'center'} variant="body2" color={grey[700]}>الفترة الصباحية</Typography>
                            <Checkbox
                              checked={schedules[index].morning.enabled}
                              onChange={() => handleSlotToggle(index, 'morning')}
                              sx={{
                                color: green[500],
                                '& .MuiSvgIcon-root': { fontSize: 20 },
                              }}
                            />
                          </Stack>
                       
                        </Box>

                        {/* Evening Slot */}
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2" color={grey[700]}>الفترة المسائية</Typography>
                            <Checkbox
                              checked={schedules[index].evening.enabled}
                              onChange={() => handleSlotToggle(index, 'evening')}
                              sx={{
                                color: blue[500],
                                '& .MuiSvgIcon-root': { fontSize: 20 },
                              }}
                            />
                          </Stack>
                
                        </Box>
                      </Stack>
                    </Box>
                  </Paper>
                ))}
              </Grid>

              {/* Column 2 */}
              <Grid item xs={12} md={6}>
                {daysOfWeek.slice(Math.ceil(daysOfWeek.length / 2)).map((day, index) => {
                  const actualIndex = index + Math.ceil(daysOfWeek.length / 2); // adjust index from first column 
                  return (
                    <Paper key={actualIndex} elevation={2} style={{ marginBottom: '10px', padding: '10px' }}>
                      <Box display="flex" flexDirection="column" alignItems="flex-center">
                        <Typography textAlign={'center'} variant="h4">{day}</Typography>
                        <Divider sx={{ width: '100%', mb: 1 }} />
                        <Stack direction="row" alignItems="center" justifyContent="space-around" width="100%">
                          {/* Morning Slot */}
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="body2" color={grey[700]}>الفترة الصباحية</Typography>
                              <Checkbox
                                checked={schedules[actualIndex].morning.enabled}
                                onChange={() => handleSlotToggle(actualIndex, 'morning')}
                                sx={{
                                  color: green[500],
                                  '& .MuiSvgIcon-root': { fontSize: 20 },
                                }}
                              />
                            </Stack>
                       
                          </Box>

                          {/* Evening Slot */}
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="body2" color={grey[700]}>الفترة المسائية</Typography>
                              <Checkbox
                                checked={schedules[actualIndex].evening.enabled}
                                onChange={() => handleSlotToggle(actualIndex, 'evening')}
                                sx={{
                                  color: blue[500],
                                  '& .MuiSvgIcon-root': { fontSize: 20 },
                                }}
                              />
                            </Stack>
                         
                          </Box>
                        </Stack>
                      </Box>
                    </Paper>
                  );
                })}
              </Grid>
            </Grid>

            <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
              حفظ الجدول
            </Button>
          </>
        )}
      </Container>
    </LocalizationProvider>
  );
}

export default DoctorScheduleManager;