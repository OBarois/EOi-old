import React, {useState, useEffect} from 'react';
import DateLabel from '../datelabel'
import DateController from '../datecontroller'
import DateSelector from '../dateselector'


function DateManager({startdate, onDateChange, searching}) {

    

  const [selectorStartdate, setselectorStartdate] = useState(startdate)
  const [controllerStartdate, setscontrollerStartdate] = useState(startdate)
  const [labeldate, setLabelDate] = useState(startdate)


  const handleSelectorDateChange = (date) => {
    // console.log('handleSelectorDateChange:' + date.toJSON())

    setLabelDate(date)
    onDateChange(date)
    setscontrollerStartdate(date)
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
          <DateSelector startdate={selectorStartdate} onDateChange={handleSelectorDateChange}/>
        </div>
    ) 
}
export default DateManager