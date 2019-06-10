import React, {useState, useEffect,useLayoutEffect, useRef} from 'react';
import './DateSelector.css';

function DateSelectorScale({date, zoomfactor}) {

const scale = useRef()
// const [startdate, ] = useState(date)    
const [timescale, setTimescale] = useState('')    


useEffect(() => {     
    console.log(scale.current.offsetHeight)
},[])
    
const scaleText = (startdate, zoom) => {
    console.log('startdate: '+startdate.toJSON()+'  zoom: '+zoom)
    if(!scale.current) return
        
    const monthcode = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
    let day, month, hour, year = 0
    let lastday =0
    let lastmonth = 0
    let tics = []    
    let putday = (zoom < 1000*60*60*24)
    // console.log(startdate.toJSON())
    for ( let i=0 ; i < scale.current.offsetHeight ; i+=1 ) {
        let refdate = new Date( (i- scale.current.offsetHeight/2) * zoom + startdate.getTime()  )
        // console.log(i * zoomfactor + date.getTime())

        // console.log(refdate.toJSON())
        day = refdate.getUTCDate()
        month = monthcode[refdate.getUTCMonth()]
        hour = refdate.getUTCHours()
        year = refdate.getUTCFullYear()
        if(day !== lastday && lastday!=0 && putday) tics.push({class:'DayTic', pos: i, label: day})
        // if( (day == 1 || day == 15) && day !== lastday ) {
        if(month !== lastmonth && lastday!=0) {
                tics.push({class:'MonthTic', pos: i, label: month})
            tics.push({class:'YearTic', pos: i, label: year})
        }
        //if(year != lastyear) tics.push({class:'YearTic', pos: (i-props.min)/zoomfactor, label: year})
        //if(hour != lasthour) tics.push({class:'HourTic', pos: (i-props.min)/zoomfactor, label: '.'})
        lastday = day
        lastmonth = month
    }
    
    return tics.map(item => (            <div className={item.class} key={item.class+item.pos} style={{top:item.pos}}>{item.label}</div>))
}

useLayoutEffect(() => {
    setTimescale(scaleText(date,zoomfactor))
},[date, zoomfactor])


return (
    <div ref={scale} className='DateSelectorScale' >
        {timescale}
    </div>
  )
}
export default DateSelectorScale
