import React, {useState, useEffect,useLayoutEffect, useRef} from 'react';
import {useSpring, animated} from 'react-spring'
import './DateSelector.css';

function DateSelectorScale({date, zoomfactor, immediate, down}) {

    const scale = useRef()
    const [start, setStart] = useState(date)    
    const [active, setActive] = useState(false)    
    const [timescale, setTimescale] = useState('')    
    // const [zoom, setZoom] = useState(zoomfactor)    


    useEffect(() => {  
        return () => {}          
    })
        
    const scaleText = (_start, _zoom) => {
        // console.log('_start: '+_start.toJSON()+'  zoom: '+_zoom)
        if(!scale.current) return
            
        const monthcode = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
        const isEven = num => ((num % 2) == 0) ? true : false;

        function pad(number, length) {  
            var str = '' + number;
            while (str.length < length) {
                str = '0' + str;
            }           
            return str;        
        }


        let day, month, hour, year, minute = 0
        let lastday =0
        let lastmonth = 0
        let lastyear = 0
        let lasthour = 0
        let lastminute = 0
        let tics = []    
        let putyear = (_zoom < 1000*60*60*24*30*10)
        let putmonth = (_zoom < 1000*60*60*24*3)
        let putevenday = (_zoom < 1000*60*60*4)
        let putday = (_zoom < 1000*60*70)
        let putevenhour = (_zoom < 1000*60*7)
        let puthour = (_zoom < 1000*60*3)
        let puttenminute = (_zoom < 1000*40)
        let putminute = (_zoom < 1000*2)

        // console.log('  zoom: '+((_zoom*10)/(1000*60*60*24) ) +'  puthour: '+puthour+'  putday: '+putday+'  putmonth: '+putmonth+'  putevenhour: '+putevenhour)
        let lastpos = 0
        for ( let i=0 ; i < scale.current.offsetHeight ; i+=1 ) {
            let refdate = new Date( (i- scale.current.offsetHeight/2) * _zoom + _start.getTime()  )
            day = refdate.getUTCDate()
            month = refdate.getUTCMonth()
            hour = refdate.getUTCHours()
            year = refdate.getUTCFullYear()
            minute = refdate.getUTCMinutes()

            if(puttenminute) {
                if(minute != lastminute) {
                    if((minute != 0 || hour != 0) && (minute % 10 === 0 || putminute)) {
                        tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':'+pad(minute,2)})
                    } else {
                        if (minute == 0 && hour == 0) {
                            tics.push({class:'DayTic_h', pos: i, label: day})
                            tics.push({class:'MonthTic_h', pos: i, label: monthcode[month]})
                            tics.push({class:'YearTic_h', pos: i, label: year})            
                        }
                    }
                }

    
            

            } else if (putevenhour) {
                if(hour != lasthour) {
                    if (hour != 0 &&  (hour % 3 === 0 || puthour)) {
                        tics.push({class:'HourTic', pos: i, label: pad(hour,2)+':00'})
                    } else  {
                        if (hour == 0) {
                            tics.push({class:'DayTic_h', pos: i, label: day})
                            tics.push({class:'MonthTic_h', pos: i, label: monthcode[month]})
                            tics.push({class:'YearTic_h', pos: i, label: year})            
                        }
                    }
                }
    
            } else if (putevenday) {
                if(day !== lastday) {
                    if (day != 1 && (day % 5 === 0 || putday )) {
                        tics.push({class:'DayTic', pos: i, label: day})
                    } else {
                        if (day == 1) {
                            tics.push({class:'DayTic', pos: i, label: day})
                            tics.push({class:'MonthTic_h', pos: i, label: monthcode[month]})
                            tics.push({class:'YearTic_h', pos: i, label: year})
                        }
                     }
                    
                }
    
            } else if (putmonth) {
                if(month !== lastmonth && lastday!=0 && putmonth) {
                    if (month !== 0) {
                        tics.push({class:'MonthTic', pos: i, label: monthcode[month]})
                    } else {
                        tics.push({class:'MonthTic', pos: i, label: monthcode[month]})
                        tics.push({class:'YearTic_h2', pos: i, label: year})
                    }
                }
    
            } else if (putyear) {
                if(year !== lastyear && lastmonth !== 0 ) {
                    if (month !== 0) {
                        tics.push({class:'MonthTic', pos: i, label: monthcode[month]})
                    } else {
                        // tics.push({class:'MonthTic', pos: i, label: month})
                        tics.push({class:'YearTic', pos: i, label: year})
                    }
                }
    
            }

            lastday = day
            lastyear = year
            lastmonth = month
            lasthour = hour
            lastminute = minute
        }
        
        return tics.map(item => (            <div className={item.class} key={item.class+item.pos} style={{top:item.pos}}>{item.label}</div>))
    }

    // useLayoutEffect(() => {
    //     setTimescale(scaleText(date,zoomfactor))
    // },[date,zoomfactor])


    const [{ dater, zoomer }, set] = useSpring(() => ({ dater: date.getTime(), zoomer: zoomfactor}))
    useLayoutEffect(() => {
        // console.log('zoomfactor: '+zoomfactor+'  to: '+date.toJSON())
        //if (Math.abs(zoomfactor-1000*60*60*24)< 1000*60*60*24) zoom = 1000*60*60*24
        set({ 
            to: {
                zoomer: zoomfactor, 
                dater: date.getTime()
            },
            config: {  duration: 200},
            immediate: false,
            onFrame: ()=>{
                // console.log(zoomer.value+'/ '+(new Date(dater.value)).toJSON())
                // setTimescale(scaleText(new Date(dater.value),zoomer.value))
                setTimescale(scaleText(new Date(dater.value),zoomer.value))
            }
        })

    },[ zoomfactor])

    useLayoutEffect(() => {
        // console.log('zoomfactor: '+zoomfactor+'  to: '+date.toJSON())
    // easing function
    // function ease(t) {
    //     console.log('easing')
    //     return 1 - Math.cos(t * Math.PI/2);
    //   }
    

    set({ 
            to: {
                // zoomer: zoomfactor, 
                dater: date.getTime()
                // dater: stepdater
            },
            config: {  duration: 400},
            immediate: immediate,
            onFrame: ()=>{
                // console.log(zoomer.value+'/ '+(new Date(dater.value)).toJSON())
                // setTimescale(scaleText(new Date(dater.value),zoomer.value))
                //console.log(Math.ceil(dater.value  / (1000*60*60*24)) * (1000*60*60*24))
                

                setTimescale(scaleText(new Date(dater.value),zoomfactor))
                // setTimescale(scaleText(new Date(stepdater),zoomfactor))
            }
            // onRest: () => {
            //     setTimescale(scaleText(new Date(stepdater),zoomfactor))
            // }
        })

    },[date])


    return (
        <animated.div ref={scale} className='DateSelectorScale' >
            {timescale}
        </animated.div>
    )
}
export default DateSelectorScale
