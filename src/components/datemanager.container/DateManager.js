import React, {useState, useEffect} from 'react';
import DateLabel from '../datelabel'
import DateController from '../datecontroller'
import DateSelector from '../dateselector'


function DateManager({startdate, onDateChange, searching}) {

    

  const [selectorStartdate, setselectorStartdate] = useState(startdate)
  const [controllerStartdate, setscontrollerStartdate] = useState(startdate)
  const [labeldate, setLabelDate] = useState(startdate)

    const handleClick = (increment) => {
      let newdate =  new Date(labeldate.getTime()+increment)
      console.log('Change startdate: '+newdate.toJSON())
      // setViewdate(newdate)
      setselectorStartdate(newdate)
  }

  const handleSelectorDateChange = (date) => {
    // console.log('handleSelectorDateChange')

    setLabelDate(date)
    onDateChange(date)
  }
  const handleControllerDateChange = (date) => {
    console.log('handleControllerDateChange')
    // setLabelDate(date)
    // onDateChange(date)
    setselectorStartdate(date)

    // setselectorStartdate(date)
  }

  useEffect(() => {
    console.log('startdate in date manager: '+startdate.toJSON())
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