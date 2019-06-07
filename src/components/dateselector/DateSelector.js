import React from 'react';
import './DateSelector.css';

function DateSelector({viewdate, onDateChange}) {

  const handleClick = () => {
    onDateChange(new Date())
  }

  return (
    <div className='DateSelector' onClick={handleClick}>
      {'dateselector: ' + viewdate.toJSON()}
    </div>
  )
}
export default DateSelector
