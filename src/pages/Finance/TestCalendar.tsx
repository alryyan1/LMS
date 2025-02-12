import React from 'react';
import MyCalendar from './Calendar';

function TestCalendar({statements,setIncomeStatement,setRows}) {
  const datesToMark = statements.map((s)=>new Date(s.created_at))
  console.log(datesToMark);

  return (
    <div>
      <h1>My Calendar</h1>
      <MyCalendar setRows={setRows} statements={statements} setIncomeStatement={setIncomeStatement} datesToMark={datesToMark} />
    </div>
  );
}

export default TestCalendar;