import React from 'react';
import './DateController.css';

function DateController({onDateChange}) {

    const handleClick = () => {
        console.log('date controll')
        onDateChange(1000*60*60*24)
    }

    return (
        <div className='DateController' onClick={handleClick}/>
    )
}
export default DateController
