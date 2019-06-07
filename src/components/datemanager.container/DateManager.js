import React from 'react';
import DateLabel from '../datelabel'
import DateSelector from '../dateselector'


function DateManager({viewdate, searching, onDateChange}) {



  return (
    <div>
      <DateLabel viewdate={viewdate} highlight='month' searching='true'/>
      <DateSelector viewdate={viewdate} onDateChange={onDateChange}/>
    </div>
  ) 
}
export default DateManager