import React from 'react';
import DateLabel from '../datelabel'
import DateSelector from '../dateselector'


function DateManager({startdate, viewdate, searching, onDateChange}) {

    

    return (
        <div>
        <DateLabel viewdate={viewdate} highlight='month' searching='true'/>
        <DateSelector startdate={startdate} onDateChange={onDateChange}/>
        </div>
    ) 
}
export default DateManager