import { useState, useEffect, useRef } from "react";


export function useDateIncrementor({ autoStart, initdate }) {
    // console.log('useClock renders')
    //const { autoStart, duration } = settings || {};
  
    // let initDate = startdate
    const [date, setDate] = useState(initdate)
    // const [playing, setPlaying] = useState()
    // const [stepstate, setStepstate] = useState(1000*60*60)
    // const [refreshrate, setrefreshrate] = useState(200)
    const playing = useRef()

    const refreshrate = useRef() 
    // step.current = 1000*60*60
    refreshrate.current = 1000

    const step = useRef()
    if(!step.current) step.current = refreshrate.current
    
    const ldate = useRef()
    if(!ldate.current) ldate.current = initdate.getTime()

      // Control functions
    const intervalRef = useRef()
    

    // function increaseSpeed() {
    //     setStep ( () => {
    //         let newstate = (step > 0)? step * 2:step / 2
    //         if(Math.abs(newstate) < refreshrate) newstate = refreshrate
    //         return newstate
    //     })
    // }
    // function decreaseSpeed() {
    //     setStep (() => {
    //         let newstate = (step > 0)? step / 2:step * 2
    //         if(Math.abs(newstate) < refreshrate) newstate = refreshrate
    //         return newstate
    //     })
    // }
    function increaseSpeed() {
        // stop()
        step.current = (step.current > 0)? step.current *= 2:step.current /= 2
        if(Math.abs(step.current) < refreshrate.current) step.current = refreshrate.current
        console.log('step: '+step.current)
        // setStepstate((st)=>st*2)
        // start()
    }
    function decreaseSpeed() {
        step.current = (step.current > 0)? step.current /= 2:step.current *= 2
        if(Math.abs(step.current) < refreshrate.current) step.current = -1 * refreshrate.current
        console.log('step: '+step.current)
        // setStepstate((st)=>st/2)
    }

    function togglePause(date) {
        if (playing.current) {
            stop()
        } else {
            start(date)
        }
    }

    function increment() {
        ldate.current += step.current
        // console.log("incrementing: "+ ldate.current+" / "+step.current)

        // setDate(new Date(initdate.getTime()+step.current))

        setDate(new Date(ldate.current))

    }
    
    function start() {
        console.log('start clock')
        // ldate.current = date.getTime()
        playing.current = true
        intervalRef.current = setInterval( 
            increment,
            // ()=>{
            // ldate.current += step.current
            // console.log("incrementing: "+ ldate.current)
    
            // setDate(new Date(ldate.current))},
            refreshrate.current
        )
        
        

    }
    
    function stop() {
        console.log('stop clock')
        if (intervalRef.current) clearInterval(intervalRef.current)
        playing.current = false
    }
    

    function reset() {
        stop()
        ldate.current = new Date().getTime()
        setDate(new Date(ldate.current))

    }

     
    function forceDate(newdate) {
        console.log('forcedate useclock: '+newdate.toJSON())
        ldate.current = newdate.getTime()
        setDate(new Date(ldate.current))
    }

    useEffect(() => {
        console.log('dateIncrementor date changed '+initdate.toJSON())
        if (!playing.current) {
            console.log("changing")
            ldate.current = initdate.getTime()        
        }
    }, [initdate])



    // didMount effect
    // useEffect(() => {
    //     console.log('render useclock')
    //     // setDate((new Date()).getTime())
    //     ldate.current = new Date().getTime()
    //     if (autoStart) {
    //         start();
    //     }
    //     //return reset;
    // }, [autoStart]);

  
  return { date, playing, togglePause, reset,  increaseSpeed, decreaseSpeed, forceDate };
}
