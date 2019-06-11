import React, {useState, useEffect} from 'react';
import DateLabel from '../datelabel'
import DateController from '../datecontroller'
import DateSelector from '../dateselector'


function DateManager({startdate, onDateChange}) {

    

    const [currentdate, setCurrentDate] = useState(startdate)
    const [labeldate, setLabelDate] = useState(startdate)

    const handleClick = (increment) => {
      let newdate =  new Date(labeldate.getTime()+increment)
      console.log('Change startdate: '+newdate.toJSON())
      // setViewdate(newdate)
      setCurrentDate(newdate)
  }

  const handleChange = (date) => {
    setLabelDate(date)
    onDateChange(date)
  }

  useEffect(() => {
    console.log('startdate in date manager: '+startdate.toJSON())
    setCurrentDate(startdate)
  },[startdate])


    return (
        <div >
          {/* <DateController onDateChange={handleClick}/> */}
          <DateLabel date={labeldate} highlight='none' searching='true'/>
          <DateSelector startdate={currentdate} onDateChange={handleChange}/>
        </div>
    ) 
}
export default DateManager