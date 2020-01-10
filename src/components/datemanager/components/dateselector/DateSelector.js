import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { add, sub, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'

import './DateSelector.css';
// import { start } from 'repl';

function DateSelector({startdate, onDateChange, onFinalDateChange}) {
    const STEPS_UP = [ 1000*60*60 ,  1000*60*60*24, 1000*60*60*24*15]
    const STEPS_DOWN = [ 1000*60*60 , 1000*60*10, 1000*60*1.8, 1000*27, 1000*60*60*24]
    

    const selector = useRef()
    const offset = useRef()
    const lastZoom = useRef()
    if(!offset.current) offset.current = [0, 0 ]
    
    const [scaledate, setScaledate ] = useState(startdate)
    // const debouncedScaledate = useDebounce(scaledate, 10);

    const [lastStartdate, setlLastStartdate ] = useState(startdate)
    
    const [newstart, setNewstart ] = useState(startdate)
    const [active, setActive ] = useState(false)

    // zoomfactor: how long is a pixel in ms
    const [zoomfactor, setZoomfactor ] = useState(STEPS_UP[0])
    if (!lastZoom.current) lastZoom.current = STEPS_UP[0]

    // to detect double taps
    const lastTap = useRef()
    const [doubleTapZoom, setDoubleTapZoom] = useState(false)
    const isDoubleTap = () => {
        const now = Date.now();
        if (lastTap.current && (now - lastTap.current) < 300) {
            setDoubleTapZoom(true)
        } else {
            lastTap.current = now
            setDoubleTapZoom(false)
        }
      }
    const handleDoubleTap = () => {
        const now = Date.now();
        console.log('handleDoubleTap')
        if (lastTap.current && (now - lastTap.current) < 300) {
            setDoubleTapZoom(true)
            console.log('DoubleTap')
        } else {
            lastTap.current = now
            setDoubleTapZoom(false)
        }
      }


    const [{ xy }, set] = useSpring(() => ({ xy: [0,0] }))

    const bind = useGesture({

        //onMouseDown: () => {isDoubleTap()},
        onDragEnd: () => {
                setDoubleTapZoom(false)
                lastZoom.current = zoomfactor
                console.log('drag stop')
                

        },

        onDrag: ({  event, first, down, delta, velocity, direction, temp = {
            xy: xy.getValue(),
            deltaoffset: [0,0]
            }
        }) => {
            // event.preventDefault()
            let zoom

            //console.log('delta '+delta[1]+ '  temp.deltaoffset: '+temp.deltaoffset[1]+' temp.xy: '+temp.xy[1]+ ' xy.getValue()[1]: '+xy.getValue()[1])
            if (first) setActive(true)
            if (doubleTapZoom) {
                // zoom = lastZoom.current + lastZoom.current * (delta[1] /30) 
                zoom = lastZoom.current + lastZoom.current * delta[1] * delta[1] * delta[1]
                if (zoom < 1000) zoom = 1000
                if (zoom > 1000*60*60*24*15) zoom = 1000*60*60*24*15
                setZoomfactor(zoom)
                
                setNewstart(scaledate)
                temp.xy = [0,0]
                temp.deltaoffset = delta
            }
            let step = 1

            

            velocity = (Math.abs(velocity)<.2)?0:velocity  
            set({ 
                xy: (doubleTapZoom)?temp.xy:add(add(sub(delta,temp.deltaoffset),offset.current), temp.xy), 
                immediate: down, 
                config: { velocity: scale(direction, velocity*step), decay: true},
                onFrame: ()=>{
                    if (!doubleTapZoom) {
                        let newdate = new Date(newstart.getTime() - xy.getValue()[1] * zoomfactor)
                        setScaledate(newdate)
                        setlLastStartdate(newdate)
    
                    }
                },
                onRest: ()=>{
                    if (!down && !doubleTapZoom) {
                        setActive(false)
                        let newdate = new Date(newstart.getTime() - xy.getValue()[1] * zoomfactor)
                        onFinalDateChange(newdate)
                        offset.current = [0,0]

                    }
                }
            })
            return temp
        }
    })




    useEffect(() => {
        // if(!active) onFinalDateChange(scaledate)  
        
        if(!active) {
            offset.current[1] -= (startdate.getTime() - lastStartdate.getTime())  / zoomfactor
            // console.log(offset.current[1]+ ' /  '+ (startdate.getTime() - lastStartdate.getTime()))
            setScaledate(startdate)
            setlLastStartdate(startdate)
            // onDateChange(startdate)
        }
    },[startdate])

    useEffect(() => {
        onDateChange(scaledate)
    },[scaledate])



    return (
        <animated.div {...bind()} className='DateSelector' ref={selector} >
            <div className="Mask"  onClick={handleDoubleTap}>

                <DateSelectorScale className='scale' date={scaledate} zoomfactor={zoomfactor} immediate={active}></DateSelectorScale>
                
                <div className="TriangleContainer" >
                    <svg height="40" width="20" className="Triangle">
                        <polygon points="20,5 20,35 12,20" />   
                    </svg> 
                </div>        
            </div>

        </animated.div>
                                  )
}
export default DateSelector
