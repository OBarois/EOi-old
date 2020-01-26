import React, {useState, useEffect} from 'react';
import DateLabel from './components/datelabel'
import DateSelector from './components/dateselector'


function DateManager({startdate, onDateChange, onFinalDateChange, animated}) {

    const [selectorStartdate, setSelectorStartdate] = useState(startdate)
    const [dateLabelHighlight,setDateLabelHighlight] = useState(1)
    const [dateLabelDate,setDateLabeDate] = useState(startdate)

    const handleSelectorDateChange = (date) => {
        setDateLabeDate(date)
        onDateChange(date)
    }

    const handleSelectorFinalDateChange = (date) => {
        // console.log('handleSelectorFinalDateChange:' + date.toJSON())
        onFinalDateChange(date)
    }

    useEffect(() => {
        setSelectorStartdate(startdate)
    },[startdate]);



    return (
        <div >
          <DateLabel date={dateLabelDate} animated={animated} highlight={dateLabelHighlight}/>
          <DateSelector startdate={selectorStartdate} 
                onDateChange={handleSelectorDateChange} 
                onFinalDateChange={handleSelectorFinalDateChange} 
                onStepChange={setDateLabelHighlight}/>
        </div>
    ) 
}
export default DateManager