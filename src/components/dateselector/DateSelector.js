import React, {useState, useLayoutEffect, useRef} from 'react';
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { add, sub, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'

import './DateSelector.css';

function DateSelector({startdate, onDateChange}) {

    const STEPS = [ 1000*60*60 , 1000*60*10, 1000*60*1.8, 1000*27, 1000*60*60*24]

    const selector = useRef()
    const offset = useRef()
    const refscaledate = useRef()
    refscaledate.current = startdate
    // offset.current=[0,0]
    
    const [scaledate, setScaledate ] = useState(startdate)
    const [newstart, setNewstart ] = useState(startdate)
    // const [offset, setOffset ] = useState([0,0])
    // const [step, setStep ] = useState(1)
    const [active, setActive ] = useState(false)

    // zoomfactor: how long is a pixel in ms
    const [zoomfactor, setZoomfactor ] = useState(STEPS[0])
    


    const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

    const bind = useGesture({

        onDrag: ({ active, event, first, down, delta, velocity, direction, temp = {
            xy: xy.getValue(),
            laststeparea: 0,
            deltaoffset: [0,0]
            }
        }) => {
            let Xoffset = selector.current.parentElement.offsetWidth - (event.pageX?event.pageX:selector.current.parentElement.offsetWidth)
            let steparea = Math.min(STEPS.length-1,Math.floor((Xoffset-selector.current.offsetWidth)/100+1))
            // if (!steparea) { steparea = 0}

            steparea = (steparea > STEPS.length-1)?STEPS.length:steparea
            steparea = (steparea < 0)?0:steparea
            // console.log(steparea)
            let step = 1
            
            // if (Xoffset > selector.current.offsetWidth) steparea = 1
            // if (Xoffset > selector.current.offsetWidth + 100) steparea = 2

            for ( let i = 0 ; i < STEPS.length ; i++ ) {

            }
            
            if (steparea !== temp.laststeparea) {
                
                setZoomfactor(STEPS[steparea])
                setNewstart(scaledate)
                temp.laststeparea = steparea
                temp.xy = [0,0]
                temp.deltaoffset = delta
                
            } 

            if (first) setActive(true)
            if (!down) offset.current = [0,0]

            velocity = (velocity<.1)?0:velocity  
            // console.log(sub(delta,temp.deltaoffset)+ '    xy: '+temp.xy) 
            // console.log(offset.current)
            set({ 
                // xy: add(scale(sub(delta,temp.deltaoffset),step), temp.xy), 
                xy: add(add(scale(sub(delta,temp.deltaoffset),step), temp.xy),offset.current), 
                immediate: down, 
                config: { velocity: scale(direction, velocity*step), decay: true},
                // config: { mass: 10, tension: 20 , friction: 40, precision: 1 },
                // onFrame: ()=>{console.log('xy: '+xy.getValue())},
                // config: config.gentle,
                // config: {},
                onFrame: ()=>{
                    let newdate = new Date(newstart.getTime() - xy.getValue()[1] * zoomfactor)
                    onDateChange(newdate)
                    setScaledate(newdate)
                    refscaledate.current = newdate
                    // offset.current = [0,0]
                },
                // onFrame: ()=>{onDateChange( olddate => new Date(olddate.getTime() + xy.getValue()[1] * 1000))},
                // onFrame: setLiveDate(),
                onRest: ()=>{
                  if (!down) setActive(false)
                    //   console.log(' finalxy: '+xy.getValue())
                    // console.log('offset: '+offset.current)
                    // onDateChange(new Date(startdate.getTime() - xy.getValue()[1] * zoomfactor))
                    // offset.current = [0,0]
                }
            })
            return temp
        }
    })



 const [{ dater }, springDate] = useSpring( () => ({ dater: refscaledate.current.getTime()}))

  useLayoutEffect(() => {
    if(!offset.current) offset.current = [0,0 ]
  if(!active) {
    offset.current[1] -= (startdate.getTime() - scaledate.getTime())  / zoomfactor
    // console.log('will spring from: '+scaledate.toJSON()+' to: '+startdate.toJSON())
    // console.log('will spring from: '+refscaledate.current.toJSON()+' to: '+startdate.toJSON())
    // console.log(offset.current)
    // console.log((startdate.getTime() - scaledate.getTime())  / zoomfactor)

    springDate({ 
        from: {
            // dater: scaledate.getTime() 
            dater: refscaledate.current.getTime()
            // dater: 10
        },
        to: {
            dater: startdate.getTime(), 
            // dater: date.getTime()
        },
        reset: true,
        config: {  duration: 30},
        // config: { velocity: 10, decay: true},
        // config: { mass: 10, tension: 20 , friction: 40, precision: 1000 },
        // onFrame: ()=>{console.log('xy: '+xy.getValue())},
        // config: config.gentle,
        immediate: true,
        onFrame: ()=>{
            // console.log(zoomer)
            // setTimescale(scaleText(new Date(dater.value),zoomer.value))
            let _date = new Date(dater.value)
            setScaledate(_date)
            onDateChange(_date)
            // offset.current = [0,(startdate.getTime() - dater.value)  / zoomfactor]
            // console.log(offset.current)
            // setNewstart(_date)
        },
        onRest: ()=>{
            // console.log('Finished')
        }
    })
  }

    // setScaledate(startdate)
    // onDateChange(startdate)
    // setNewstart(startdate)
},[startdate])

// useEffect(() => {
//   console.log(active)
// },[active])

    return (
        <div className="Mask"  >
            <animated.div {...bind()} className='DateSelector' ref={selector} >
                <DateSelectorScale className='scale' date={scaledate} zoomfactor={zoomfactor}></DateSelectorScale>
                
                <div className="TriangleContainer" >
                    <svg height="40" width="20" className="Triangle">
                        <polygon points="20,5 20,35 12,20" />   
                    </svg> 
                </div>        

            </animated.div>
        </div>
  )
}
export default DateSelector
