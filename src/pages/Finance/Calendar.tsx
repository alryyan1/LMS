import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles

const MyCalendar = ({ datesToMark,setIncomeStatement ,statements,setRows}) => {
  const [date, setDate] = useState(new Date()); // Current date of the calendar
  const [markedDates, setMarkedDates] = useState(datesToMark || []); // Initialize with provided dates

  const onChange = (date) => {
    setDate(date);
    console.log(date,'dateChanged')
    console.log(statements,'statements')
    const stmt = statements.find((s)=> dayjs(date).format('YYYY-MM-DD') == dayjs(s.created_at).format('YYYY-MM-DD'))
    setIncomeStatement(stmt)
    console.log(stmt);   
    setRows(stmt.data)
  };


  const tileClassName = ({ date, view }) => {
    // Add class to tiles in month view only
    if (view === 'month') {
      if (markedDates.some(markedDate => {
        return (
          markedDate.getFullYear() === date.getFullYear() &&
          markedDate.getMonth() === date.getMonth() &&
          markedDate.getDate() === date.getDate()
        );
      })) {
        return 'marked';
      }
    }
  };

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={date}
        tileClassName={tileClassName}
      />

      {/* Optional: Display the selected date and marked dates */}
      <p>Selected date: {date.toDateString()}</p>
      {/*
      <p>Marked dates:</p>
      <ul>
        {markedDates.map((markedDate, index) => (
          <li key={index}>{markedDate.toDateString()}</li>
        ))}
      </ul>
       */}

      <style>
        {`
          .react-calendar__tile--now {
              background: lightblue; /* Style the current day */
          }

          .marked {
            background: lightgreen;
          }
        `}
      </style>
    </div>
  );
};

export default MyCalendar;

// Example usage:
// In your parent component:
// import MyCalendar from './MyCalendar';

// const datesToMark = [
//   new Date('2023-11-05'),
//   new Date('2023-11-10'),
//   new Date('2023-11-20'),
// ];

// <MyCalendar datesToMark={datesToMark} />