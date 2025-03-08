import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  TextField,
  FormHelperText,
  Card,
  CardContent,
  Box,
  Stack,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import axiosClient from '../../../axios-client';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function DoctorScheduleManager() {
  const [doctorId, setDoctorId] = useState('');  // Replace with actual doctor selection logic
  const [schedules, setSchedules] = useState(
    daysOfWeek.map((day, index) => ({
      dayOfWeek: index + 1,  // 1-based indexing for days
      morning: {enabled: false, startTime:null, endTime:null,},
      evening: {enabled: false, startTime:null, endTime:null,},
    }))
  );

  // Replace with your actual list of doctors (fetch from API, etc.)
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Smith' },
    { id: 2, name: 'Dr. Jones' },
    { id: 3, name: 'Dr. Doe' },
  ]);
  const [formErrors, setFormErrors] = useState({});

    // Add validation logic to validate each time slot (morning/evening)
    const validateForm = () => {
        const errors = {};
        let isValid = true;

        schedules.forEach((schedule, index) => {
            if (schedule.morning.enabled) {
                if (!schedule.morning.startTime || !schedule.morning.endTime) {
                    errors[index] = 'Morning time must have start and end time';
                    isValid = false;
                }
            }
            if (schedule.evening.enabled) {
                if (!schedule.evening.startTime || !schedule.evening.endTime) {
                    errors[index] = 'Evening time must have start and end time';
                    isValid = false;
                }
            }
        });

        setFormErrors(errors);
        return isValid;
    };


  const handleTimeChange = (index, slot, timeType, time) => {
        const newSchedules = [...schedules];
        newSchedules[index][slot][timeType] = time;
        setSchedules(newSchedules);
    };

  const handleSlotToggle = (index, slot) => {
        const newSchedules = [...schedules];
        newSchedules[index][slot].enabled = !newSchedules[index][slot].enabled;
        setSchedules(newSchedules);
    };


  const handleSubmit = async () => {
    if (validateForm()) {
      // Prepare data for the API
      const scheduleData = schedules.flatMap(schedule => {
        const dayOfWeek = schedule.dayOfWeek;
        const doctorId = doctorId;

        const slots = [];

        if (schedule.morning.enabled) {
          slots.push({
            doctor_id: doctorId,
            day_of_week: dayOfWeek,
            time_slot: 'morning',
            start_time: schedule.morning.startTime ? dayjs(schedule.morning.startTime).format('HH:mm:ss') : null,
            end_time: schedule.morning.endTime ? dayjs(schedule.morning.endTime).format('HH:mm:ss') : null,
          });
        }

        if (schedule.evening.enabled) {
          slots.push({
            doctor_id: doctorId,
            day_of_week: dayOfWeek,
            time_slot: 'evening',
            start_time: schedule.evening.startTime ? dayjs(schedule.evening.startTime).format('HH:mm:ss') : null,
            end_time: schedule.evening.endTime ? dayjs(schedule.evening.endTime).format('HH:mm:ss') : null,
          });
        }

        return slots;
      });

      try {
        const response = await axiosClient.post(`doctors/${doctorId}/schedules`, scheduleData); // Relative URL
        console.log('Schedule saved successfully:', response.data); // Log success

        // Optionally, show a success message to the user
      } catch (error) {
        console.error('Error saving schedule:', error);
        // Handle errors more gracefully (display to user, log, etc.)
      }
    } else {
      console.log('Form has errors');
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Manage Doctor Schedule
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
          <Select
            labelId="doctor-select-label"
            id="doctor-select"
            value={doctorId}
            label="Select Doctor"
            onChange={(event) => setDoctorId(event.target.value)}
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={3}>
          {schedules.map((schedule, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{daysOfWeek[index]}</Typography>

                  <Box mt={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Morning</Typography>
                      <Checkbox
                        checked={schedule.morning.enabled}
                        onChange={() => handleSlotToggle(index, 'morning')}
                      />
                    </Stack>
                    {schedule.morning.enabled && (
                      <>
                        <TimePicker
                          label="Start Time"
                          value={schedule.morning.startTime}
                          onChange={(time) => handleTimeChange(index, 'morning', 'startTime', time)}
                          renderInput={(params) => <TextField {...params} margin="dense" fullWidth size="small" />}
                        />

                        <TimePicker
                          label="End Time"
                          value={schedule.morning.endTime}
                          onChange={(time) => handleTimeChange(index, 'morning', 'endTime', time)}
                          renderInput={(params) => <TextField {...params} margin="dense" fullWidth size="small" />}
                        />
                      </>
                    )}
                  </Box>

                  <Box mt={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">Evening</Typography>
                      <Checkbox
                        checked={schedule.evening.enabled}
                        onChange={() => handleSlotToggle(index, 'evening')}
                      />
                    </Stack>
                    {schedule.evening.enabled && (
                      <>
                        <TimePicker
                          label="Start Time"
                          value={schedule.evening.startTime}
                          onChange={(time) => handleTimeChange(index, 'evening', 'startTime', time)}
                          renderInput={(params) => <TextField {...params} margin="dense" fullWidth size="small" />}
                        />
                        <TimePicker
                          label="End Time"
                          value={schedule.evening.endTime}
                          onChange={(time) => handleTimeChange(index, 'evening', 'endTime', time)}
                          renderInput={(params) => <TextField {...params} margin="dense" fullWidth size="small" />}
                        />
                      </>
                    )}
                  </Box>
                  {formErrors[index] && (
                    <FormHelperText error>
                      {formErrors[index]}
                    </FormHelperText>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
          Save Schedule
        </Button>
      </Container>
    </LocalizationProvider>
  );
}

export default DoctorScheduleManager;