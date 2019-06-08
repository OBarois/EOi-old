import React, {useState, useEffect} from 'react';
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { add, sub, scale } from 'vec-la'

import './DateSelector.css';

function DateSelector({viewdate, onDateChange}) {

  const [selectorDate, setSelectordate ] = useState(viewdate)
  

    useEffect(() => {     
        console.log('selectorDate: '+selectorDate)
    },[viewdate])

  const handleClick = () => {
    onDateChange(new Date())
  }

  const setLiveDate = (x) => {
    console.log('x: '+x)
    onDateChange(new Date(viewdate.getTime() + x * 1000))
  }

  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

  const bind = useGesture({
    onDrag: ({  down, delta, distance, velocity, active , direction, wheeling, time, first, last, temp = {
                                            xy: xy.getValue(), 
                                            deltaOffset: [0, 0], 
                                            deltaCumul: [0, 0],
                                            lastNewxy: [0, 0],
                                            lastStep: 1, 
                                            lastIncrement: 0,
                                            lastDown: false, 
                                            lastTime: time
                                        }
            }) => {
        let springConfigUp = { mass: 1, tension: 200 , friction: 40, precision: 1 }
        let springConfigDown = { mass: 1, tension: 1200 , friction: 40, precision: 1 }
        let config = {  velocity: scale(direction, velocity), decay: true, precision: 1 }

                
        const onFrame = ({ xy }) => { setLiveDate(xy[1])}
        const onRest = () => { }

        console.log('delta: '+delta[1])
        // console.log('distance: '+distance)



        set({  xy: add(delta, temp.xy) ,   config: down?springConfigDown:config, immediate: down, onRest: onRest, onFrame: onFrame} )
        return temp
        }
      })


  return (
    <div {...bind()} className='DateSelector'>
      {'dateselector: ' + viewdate.toJSON()}
    </div>
  )
}
export default DateSelector
