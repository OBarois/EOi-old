import React, {useState, useEffect, useRef} from 'react';
import DateLabel from '../datelabel'
import DateController from '../datecontroller'
import DateSelector from '../dateselector'
import { useHotkeys } from 'react-hotkeys-hook'



function DateManager({startdate, onDateChange, onFinalDateChange, searching}) {

    

    const [selectorStartdate, setselectorStartdate] = useState(startdate)
    const [controllerStartdate, setscontrollerStartdate] = useState(startdate)
    const [labeldate, setLabelDate] = useState(startdate)



    const [increment, setIncrement] = useState(1000)
    // const [ticker, setTicker] = useState( () => {
    //     return setInterval( (selectorStartdate)=>{
    //         setselectorStartdate( (initdate = selectorStartdate) => new Date(initdate.getTime()+ increment))
    //     },
    //     200
    //     )
    // }
    // )
    

    // const refinterval = useRef()
    // const refincrement = useRef(false)
    // const increment = () => {
    //     if (!refincrement.current) {
    //         refinterval.current = setInterval( ()=>{
    //             console.log('increment from '+selectorStartdate.toJSON())
    //             setselectorStartdate(new Date(selectorStartdate.getTime()+ 1000*60*60*24))
    //         },
    //         1000
    //         )
    //         refincrement.current = true
    //     } else {
    //         clearInterval(refinterval.current)
    //         refincrement.current = false
    //     }
    // }

    // useHotkeys("a",increment)
    

    const handleSelectorDateChange = (date) => {
        // console.log('handleSelectorDateChange:' + date.toJSON())
        setLabelDate(date)
        onDateChange(date)
        // setscontrollerStartdate(date)
    }

    const handleSelectorFinalDateChange = (date) => {
        // console.log('handleSelectorFinalDateChange:' + date.toJSON())
        setscontrollerStartdate(date)
        // onFinalDateChange(date)

    }
    
    const handleControllerDateChange = (date) => {
        // console.log('handleControllerDateChange' + date.toJSON())
        setselectorStartdate(date)
    }

    useEffect(() => {
        // console.log('startdate in date manager: '+startdate.toJSON())
        setselectorStartdate(startdate)
    },[startdate])



    return (
        <div >
          <DateController startdate={controllerStartdate} onDateChange={handleControllerDateChange}/>
          <DateLabel date={labeldate} highlight='none' animated={searching}/>
          <DateSelector startdate={selectorStartdate} onDateChange={handleSelectorDateChange} onFinalDateChange={handleSelectorFinalDateChange}/>
        </div>
    ) 
}
export default DateManager