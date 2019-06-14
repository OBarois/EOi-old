// A refaire!!!


import { useState, useEffect, useRef } from "react";


export function useClock({ autoStart, duration, startdate }) {
    //console.log('useClock renders')
    //const { autoStart, duration } = settings || {};
  
    // let initDate = startdate
    const [date, setDate] = useState(startdate)
    const [playing, setPlaying] = useState(false)
    const ldate = useRef();

    // refresh rate in msec
    const refreshRate = useRef()
    refreshRate.current = 200

    function incrementDate(step) {
        //setDate(prevDate => { return prevDate + step  });
        ldate.current += step 
        //setDate((new Date(ldate.current)).getTime());
        setDate(ldate.current);
    }
      

      // Control functions
    const intervalRef = useRef();
    const step = useRef(refreshRate.current);
    const timeoutRef = useRef();
    

    function increaseSpeed() {
        step.current = (step.current > 0)? step.current *= 2:step.current /= 2
        if(Math.abs(step.current) < refreshRate.current) step.current = refreshRate.current
    }
    function decreaseSpeed() {
        step.current = (step.current > 0)? step.current /= 2:step.current *= 2
        if(Math.abs(step.current) < refreshRate.current) step.current = -1 * refreshRate.current
     }

    function start() {
        console.log("starting Timer... (will stop in "+duration/1000+" sec)")
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => incrementDate(step.current), refreshRate.current);
            setPlaying(true)
        }
        timeoutRef.current = setTimeout(() => {
            togglePause()
            //start()
          }, duration);
    }

    function togglePause() {
        console.log('toggle clock')
        if(timeoutRef.current) clearTimeout(timeoutRef.current)
        if (intervalRef.current) {
            setPlaying(false)
            clearInterval(intervalRef.current)
            intervalRef.current = undefined
        } else start()
    }

    function reset() {
        console.log('reset')
        if (intervalRef.current) {
            console.log('stopping')
            clearInterval(intervalRef.current)
            intervalRef.current = undefined
            setPlaying(false)
        } else {
            console.log('nothing to stop!')
        }
        // ldate.current = (new Date()).getTime()
        forceDate((new Date()).getTime())
        step.current = refreshRate.current
        setDate(ldate.current )    
        
    }

     
    function forceDate(newdate) {
        console.log('forceDate to: ' + (new Date(newdate).toJSON()))
        ldate.current = newdate
        
    }


    // didMount effect
    useEffect(() => {
        console.log('render useclock')
        // setDate((new Date()).getTime())
        ldate.current = new Date().getTime()
        if (autoStart) {
            start();
        }
        //return reset;
    }, []);

  
  return { date, playing, togglePause, reset, increaseSpeed, decreaseSpeed, forceDate };
}
