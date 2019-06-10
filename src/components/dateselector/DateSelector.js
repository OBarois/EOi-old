import React, {useState, useEffect, useRef} from 'react';
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { add, sub, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'

import './DateSelector.css';

function DateSelector({startdate, onDateChange}) {

    const STEPS = [ 1000*60*60 , 1000* 60, 1000*60*60*24]

    const selector = useRef()
    const [scaledate, setScaledate ] = useState(startdate)
    const [newstart, setNewstart ] = useState(startdate)
    // const [step, setStep ] = useState(1)

    // zoomfactor: how long is a pixel in ms
    const [zoomfactor, setZoomfactor ] = useState(STEPS[0])
    


    const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

    const bind = useGesture({

        onDrag: ({ active, event, cancel, down, delta, velocity, direction, temp = {
            xy: xy.getValue(),
            laststeparea: 0,
            deltaoffset: [0,0]
            }
        }) => {
        
            let steparea = 0
            let step = 1
            let Xoffset = selector.current.parentElement.offsetWidth - event.clientX
            if (Xoffset > selector.current.offsetWidth) steparea = 1
            if (Xoffset > selector.current.offsetWidth + 100) steparea = 2
            if (steparea != temp.laststeparea) {
                // step = Xoffset * 0.6
                // setZoomfactor(1000*60*60*24*(selector.current.offsetWidth-Xoffset)/150)
                setZoomfactor(STEPS[steparea])
                setNewstart(scaledate)
                temp.laststeparea = steparea
                temp.xy = [0,0]
                temp.deltaoffset = delta
                
            } 
            
            // if (Xoffset > selector.current.offsetWidth) {
            //     setStep(10)
            // } else {
            //     setStep(1)
            // }

            velocity = (velocity<.15)?0:velocity  
            console.log(sub(delta,temp.deltaoffset)+ '    xy: '+temp.xy) 
            set({ 
                xy: add(scale(sub(delta,temp.deltaoffset),step), temp.xy), 
                immediate: down, 
                config: { velocity: scale(direction, velocity*step), decay: true},
                // config: { mass: 10, tension: 20 , friction: 40, precision: 1 },
                // onFrame: ()=>{console.log('xy: '+xy.getValue())},
                // config: config.gentle,
                onFrame: ()=>{
                    let newdate = new Date(newstart.getTime() - xy.getValue()[1] * zoomfactor)
                    onDateChange(newdate)
                    setScaledate(newdate)
                },
                // onFrame: ()=>{onDateChange( olddate => new Date(olddate.getTime() + xy.getValue()[1] * 1000))},
                // onFrame: setLiveDate(),
                onRest: ()=>{
                    //   console.log(' finalxy: '+xy.getValue())
                    // onDateChange(new Date(startdate.getTime() - xy.getValue()[1] * zoomfactor))
                }
            })
            return temp
        }
    })


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
