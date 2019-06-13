import React, {useEffect} from 'react';
import { useClock } from "./useClock"
import { useHotkeys } from 'react-hotkeys-hook'


import './DateController.css';

function DateController({startdate, onDateChange}) {

    const {
        date,
        playing,
        togglePause,
        reset,
        increaseSpeed,
        decreaseSpeed,
        forceDate
    } = useClock({
        autoStart: false,
        duration: 600000,
        startdate: startdate.getTime()
    })


    useHotkeys("t",togglePause)
    useHotkeys("r",reset)
    useHotkeys(".",increaseSpeed)
    useHotkeys(",",decreaseSpeed)


    // const handleClick = () => {
    //     console.log('date controll')
    //     onDateChange(1000*60*60*24)
    // }

    useEffect(() => {
        // console.log("date from useClock: "+new Date(date).toJSON())
        onDateChange(new Date(date))
        //forceDate(date)
        //setAppdate({appdate: new Date(date)})
    },[date]);

    useEffect(() => {
        // console.log("date from useClock: "+new Date(date).toJSON())
        forceDate(startdate.getTime())
        //forceDate(date)
        //setAppdate({appdate: new Date(date)})
    },[startdate]);

    // useEffect(() => {
    //     //console.log("useEffect (appdate) in ClockController")
    //     //setAppdate(date)
    //     forceDate(startdate.getTime())
    //     //setAppdate({appdate: new Date(date)})
    // },[startdate]);


    return (
        <div className='DateController' onClick={reset}/>
    )
}
export default DateController
