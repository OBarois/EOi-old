import React, {useState, useEffect, useRef} from 'react'
import {useSpring} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { add, sub, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'

import './DateSelector.css';
// import { start } from 'repl';

function DateSelector({startdate, increment, incrementSpeed, onDateChange, onFinalDateChange, onStepChange}) {  /// add increment: true\false and incrementStep. controller will set this props

    const MAXZOOM = 1000*60*60*24*15
    const MINZOOM = 1000
    const DEFZOOM = 1000*60*60
    
    const selector = useRef()
    const lastZoom = useRef()
    if(!lastZoom.current) lastZoom.current = DEFZOOM

    
    const [scaledate, setScaledate ] = useState(startdate)
    // const debouncedScaledate = useDebounce(scaledate, 10);
    

    const [lastStartdate, setlLastStartdate ] = useState(startdate)
    
    const [active, setActive ] = useState(false)
    const [step, setStep ] = useState(60000)
    const [stepLabel, setStepLabel ] = useState('hour')

    // zoomfactor: how long is a pixel in ms
    const [zoomfactor, setZoomfactor ] = useState(DEFZOOM)
    if (!lastZoom.current) lastZoom.current = DEFZOOM

    // to detect double taps
    const lastTap = useRef()
    const doubleTap = useRef()


    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap.current && (now - lastTap.current) < 300) {
            doubleTap.current = true
        } else {
            lastTap.current = now
            doubleTap.current = false
        }
    }


    const [{ posxy_drag}, setyOnDrag] = useSpring(() => ({ posxy_drag: [0,0]  }))
    const [{ xy2 }, sety2, stop2] = useSpring(() => ({ xy2: [0,0] }))
    const [{ posxy_wheel }, setyOnWheel, stop] = useSpring(() => ({posxy_wheel: [0,0] }))
    // const [{ zoom }, setz] = useSpring(() => ({ zoom: DEFZOOM }))


    
    const bind = useGesture({

        onDragEnd: () => {
                lastZoom.current = zoomfactor
        },

        onWheel: ( {delta, movement, shiftKey, first,  direction, down, last, wheeling, memo = {
            lastposxy: posxy_wheel.getValue()
            }
        }) => {
            if (first) {
                stop()
                setActive(true)
                setlLastStartdate(scaledate)
            }
            let zoom
            if ( shiftKey) {
                zoom = zoomfactor - zoomfactor / 5 * direction[0]
                if (zoom < MINZOOM) zoom = MINZOOM
                if (zoom > MAXZOOM) zoom = MAXZOOM
                setZoomfactor(zoom)
                if(!down) setActive(false)
                return memo
            }


            setyOnWheel({                 
                // posxy_wheel: add(movement,memo.lastposxy), // must be cummulative
                // posxy_wheel: scale(movement,0.1), // must be cummulative
                posxy_wheel:movement,
                // immediate: (Math.abs(movement[1])<500), 
                immediate: false,
                // config: { },
                // reset: true,
                onFrame: ()=>{
                        let factor = Math.ceil(posxy_wheel.getValue()[1] * zoomfactor  / step)
                        if (factor == 0 && movement[1] <= 0) factor = -1
                        if (factor == 0 && movement[1] >= 0) factor = 1

                        let nd = lastStartdate.getTime() + factor * step
                        let newdate = new Date(nd)
                        setScaledate(newdate)
                        onDateChange(newdate)

                    // setlLastStartdate(newdate)
                },
                onRest: ()=>{
                    let factor = Math.ceil(posxy_wheel.getValue()[1] * zoomfactor  / step)
                    if (factor == 0 && movement[1] <= 0) factor = -1
                    if (factor == 0 && movement[1] >= 0) factor = 1

                    let nd = lastStartdate.getTime() + factor * step
                    let newdate = new Date(nd)

                    setScaledate(newdate)
                    onDateChange(newdate)
                    onFinalDateChange(newdate)
                    setlLastStartdate(newdate)
                    if(last) {
                        posxy_wheel.setValue([0,0])
                        setActive(false)
                    }
                }
            })
            return memo

        },

        onDrag: ({  event, first, direction,down, movement, delta, velocity, shiftKey }) => {
            //event.preventDefault()
            let zoom

            if (first) {
                console.log('shiftKey: '+shiftKey)
                setActive(true)
                handleDoubleTap()
                setlLastStartdate(scaledate)
            }

            if (doubleTap.current || shiftKey) {

                zoom = zoomfactor - zoomfactor / 50 * ( delta[1] )
                if (zoom < MINZOOM) zoom = MINZOOM
                if (zoom > MAXZOOM) zoom = MAXZOOM
                setZoomfactor(zoom)
                // temp.xy = [0,0]
                if(!down) setActive(false)
                return
            }

            velocity = (Math.abs(velocity)<.2)?0:velocity  

            setyOnDrag({                 
                posxy_drag: movement, 
                immediate: down, 
                config: { velocity: scale(direction, velocity), decay: true},
                onFrame: ()=>{
                    // console.log('y / deltay:  '+xy.getValue()[1]+'/ '+delta[1])
                    if (!first) {
                        let nd = lastStartdate.getTime() - Math.ceil(posxy_drag.getValue()[1] * zoomfactor  / step) * step
                        let newdate = new Date(nd)
                        setScaledate(newdate)
                        onDateChange(newdate)
                        }

                    // setlLastStartdate(newdate)
                },
                onRest: ()=>{
                    if (!down) {
                        let nd = lastStartdate.getTime() - Math.ceil(posxy_drag.getValue()[1] * zoomfactor  / step) * step
                        let newdate = new Date(nd)
                        setScaledate(newdate)
                        onDateChange(newdate)

                        onFinalDateChange(newdate)
                        setlLastStartdate(newdate)
                        setActive(false)

                    }
                }
            })

        }
    },
    {
        // wheel: {
        //     initial: () => [0,0]
        // }
    }
    )


    const moveToDate = (startdate) => {

        if (!active) {
            let deltaoffset = [0,(lastStartdate.getTime() - startdate.getTime())  / zoomfactor]

            // setActive(true)
            stop2()
            sety2({ 
                xy2: deltaoffset,
                immediate: false, 
                config: {reset: true },
                onFrame: ()=>{
                    let newdate = new Date(lastStartdate.getTime() - xy2.getValue()[1] * zoomfactor)
                    setScaledate(newdate)
                    onDateChange(newdate)
                },
                onRest: ()=>{
                     let newdate = new Date(lastStartdate.getTime() - xy2.getValue()[1] * zoomfactor)
                    xy2.setValue([0,0])
                    setScaledate(newdate)
                    onDateChange(newdate)
                    setlLastStartdate(newdate)
                    onFinalDateChange(newdate)
                    // setActive(false)
                }
            })
        } 

    }

    useEffect(() => {
        if(!active) {
            console.log('DateSelector moving date to: '+startdate.toJSON())
            moveToDate(startdate)
        }
    },[startdate])

    // useEffect(() => {
    //     console.log('laststartdate changed: '+lastStartdate.toJSON())
    // },[lastStartdate])

    useEffect(() => {
        console.log('Selector active: '+active)
    },[active])


    useEffect(() => {
        onStepChange(stepLabel)
    },[stepLabel])

    useEffect(() => {
        switch (true) {
            case zoomfactor > 120426316:
                setStep(1000*60*60*24*30)
                setStepLabel('month')
                break
            case zoomfactor > 14544702:
                setStep(1000*60*60*24)
                setStepLabel('day')
                break
            case zoomfactor > 735259:
                setStep(1000*60*60)
                setStepLabel('hour')
                break
            case zoomfactor > 32274:
                setStep(1000*60)
                setStepLabel('minute')
                break
            default:
                setStep(1000)
                setStepLabel('second')
        }
    },[zoomfactor])

    


    return (
        <div {...bind()} className='DateSelector' ref={selector} >
            <div className="Mask"  >

                <DateSelectorScale className='scale' date={scaledate} zoomfactor={zoomfactor} step={step}></DateSelectorScale>
                
                <div className="TriangleContainer" >
                    <svg height="40" width="20" className="Triangle">
                        <polygon points="20,5 20,35 12,20" />   
                    </svg> 
                </div>        
            </div>

        </div>
                                  )
}
export default DateSelector
