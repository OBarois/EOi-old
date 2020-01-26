import React, {useEffect, useRef, useState} from 'react';
import { useDateIncrementor } from "./useDateIncrementor"
import { useHotkeys } from 'react-hotkeys-hook'


import './DateController.css';

function DateController({ initdate, onDateChange}) {

    const [startingDate, setStartingDate] = useState(initdate)

    // useClock must be redone to support real time increments
    const {
        date,
        playing,
        togglePause,
        reset,
        increaseSpeed,
        decreaseSpeed,
        forceDate
    } = useDateIncrementor({
        initdate: startingDate
    })



    useHotkeys("t",togglePause)
    useHotkeys("r",reset)
    // useHotkeys("r",()=>{reset() })
    useHotkeys(".",increaseSpeed)
    useHotkeys(",",decreaseSpeed)

    


    useEffect(() => {
        if(date) {
            console.log("date from useDateIncrementor: "+date.toJSON())
            onDateChange(date)
        }
    },[date, playing]);

    useEffect(() => {
        console.log("initdate changed: "+initdate.toJSON())
        forceDate(initdate)
    },[initdate]);

    const lastTap = useRef()
    const handleClick = () => {
        const now = Date.now();
        if (lastTap.current && (now - lastTap.current) < 300) {
          reset();
        } else {
            lastTap.current = now
            togglePause()
        }
      }


    return (
        <div className='DateController' onClick={handleClick}/>
    )
}
export default DateController
