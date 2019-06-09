import React, {useState, useEffect, useRef} from 'react';
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { add, sub, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'

import './DateSelector.css';

function DateSelector({viewdate, onDateChange}) {

    const selector = useRef()
    const [selectorDate, setSelectordate ] = useState(viewdate)
    // const [step, setStep ] = useState(1)

    // zoomfactor: how long is a pixel in ms
    const [zoomfactor, setZoomfactor ] = useState(1000*60*60)
    

    const handleClick = () => {
        onDateChange(new Date())
    }


    const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

    const bind = useGesture({

    onDrag: ({ active, event, down, delta, velocity, direction, temp = xy.getValue() }) => {
        
        let step = 1
        let Xoffset = selector.current.parentElement.offsetWidth - event.clientX
        if (Xoffset > selector.current.offsetWidth) {
            // step = Xoffset * 0.6
            // setZoomfactor(1000*60*60*24*(selector.current.offsetWidth-Xoffset)/150)
            setZoomfactor(1000*60*60*24)
        } else {
            setZoomfactor(1000*60*60)
        }
        
         
        // if (Xoffset > selector.current.offsetWidth) {
        //     setStep(10)
        // } else {
        //     setStep(1)
        // }

        velocity = (velocity<.15)?0:velocity  
        // console.log(temp.xy[0]-delta[0]) 
        set({ 
            xy: add(scale(delta,step), temp), 
            immediate: down, 
            config: { velocity: scale(direction, velocity*step), decay: true},
            // config: { mass: 10, tension: 20 , friction: 40, precision: 1 },
            // onFrame: ()=>{console.log('xy: '+xy.getValue())},
            // config: config.gentle,
            onFrame: ()=>{
            onDateChange(new Date(selectorDate.getTime() - xy.getValue()[1] * zoomfactor))
            },
            // onFrame: ()=>{onDateChange( olddate => new Date(olddate.getTime() + xy.getValue()[1] * 1000))},
            // onFrame: setLiveDate(),
            onRest: ()=>{
            //   console.log(' finalxy: '+xy.getValue())
            onDateChange(new Date(selectorDate.getTime() - xy.getValue()[1] * zoomfactor))
            }
        })
        return temp
    }


      })


    return (
        <div className="Mask"  >
            <animated.div {...bind()} className='DateSelector' ref={selector} >
            <DateSelectorScale className='scale' date={viewdate} zoomfactor={zoomfactor}></DateSelectorScale>
                
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
