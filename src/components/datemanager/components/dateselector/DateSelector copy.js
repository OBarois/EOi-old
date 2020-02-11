import React, {useState, useEffect, useRef} from 'react'
import {useSpring, animated} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { add, sub, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'

import './DateSelector.css';
// import { start } from 'repl';

function DateSelector({startdate, onDateChange, onFinalDateChange, onStepChange}) {

    const MAXZOOM = 1000*60*60*24*15
    const MINZOOM = 1000
    const DEFZOOM = 1000*60*60
    
    const selector = useRef()
    const lastZoom = useRef()
    const lastPos = useRef()
    if(!lastZoom.current) lastZoom.current = DEFZOOM
    if(!lastPos.current) lastPos.current = 0

    
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
    if (!doubleTap.current) doubleTap.current = false

    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap.current && (now - lastTap.current) < 300) {
            doubleTap.current = true
        } else {
            lastTap.current = now
            doubleTap.current = false
        }
    }


    const [{ y2 }, sety2] = useSpring(() => ({ y2: 0 }))
    const [{ y }, sety] = useSpring(() => ({y: 0 }))


    
    const bind = useGesture({

        onDragEnd: () => {
                lastZoom.current = zoomfactor
                onFinalDateChange(scaledate)
        },

        onWheel: ( {first, down,  movement, memo = {
            lastzoom: zoomfactor,
            lastdelta: [0,0],
            currentzoom: zoomfactor,
            y : y.getValue()
            }
        }) => {
            console.log(down)
            console.log(first)
            sety({                 
                y:  movement[1]+memo.y,  
                // immediate: false, 
                onFrame: ()=>{
                    console.log(' wheel:/ movement / memo.y / y :  '+'/ '+movement[1]+'/ '+ memo.y+'/ '+ y.getValue() )
                    let nd = lastStartdate.getTime() + Math.ceil(y.getValue() * zoomfactor  / step) * step
                    let newdate = new Date(nd)
                    console.log(nd)
                    setScaledate(newdate)
                    onDateChange(newdate)
                    
                        // lastPos.current = posy_wheel.getValue()

                    // setlLastStartdate(newdate)
                },
                onRest: ()=>{
                    setActive(false)
                    onFinalDateChange(scaledate)
                    // setlLastStartdate(newdate)
                    // lastPos.current=0
                }
            })
        return memo
        },

        onDrag: ({  event, first, down, delta, shiftKey,  movement, memo = {
            lastzoom: zoomfactor,
            lastdelta: [0,0],
            currentzoom: zoomfactor,
            y : y.getValue()
            }
        }) => {
            //event.preventDefault()
            let zoom

            if (first) {
                console.log('shiftKey: '+shiftKey)
                setActive(true)
                handleDoubleTap()
                // setlLastStartdate(scaledate)
                lastPos.current = 0
                
            }

            if (doubleTap.current || shiftKey) {
                console.log('in double tap')
                console.log(' / movement / delta / y :  '+'/ '+movement[1]+'/ '+ delta[1] )
                // zoom = temp.currentzoom + temp.currentzoom / 50 * (temp.lastdelta[1] - delta[1] )
                zoom = memo.currentzoom + memo.currentzoom / 50 *  delta[1] 
                if (zoom < MINZOOM) zoom = MINZOOM
                if (zoom > MAXZOOM) zoom = MAXZOOM
                setZoomfactor(zoom)
                // temp.xy = [0,0]
                memo.currentzoom = zoom
                memo.lastdelta = delta
                if(!down) setActive(false)
                return memo
            }
            // velocity = (Math.abs(velocity)<.2)?0:velocity  

            sety({                 
                y:  movement[1]+memo.y, 
                // immediate: down, 
                onFrame: ()=>{
                    console.log(' drag:/ movement / delta / y :  '+'/ '+movement[1]+'/ '+ memo.y +'/ '+ y.getValue() )
                    let nd = lastStartdate.getTime() - Math.ceil(y.getValue() * zoomfactor  / step) * step
                    let newdate = new Date(nd)
                    setScaledate(newdate)
                    onDateChange(newdate)

                    // setlLastStartdate(newdate)
                },
                onRest: ()=>{
                    if (!down) {
                        setActive(false)
                        onFinalDateChange(scaledate)
                        // setlLastStartdate(newdate)
                    }
                }
            })
            return memo
        }
    },
    )


    const moveToDate = (startdate) => {
        if (!active) {
            let deltaoffsety = (lastStartdate.getTime() - startdate.getTime())  / zoomfactor
            
            sety2({ 
                y2: deltaoffsety,
                immediate: false, 
                onFrame: ()=>{
                    console.log(y2.getValue())
                    let newdate = new Date(lastStartdate.getTime() - y2.getValue() * zoomfactor)
                    setScaledate(newdate)
                    onDateChange(newdate)
                },
                onRest: ()=>{
                    setActive(false)
                    let newdate = new Date(lastStartdate.getTime() - y2.getValue() * zoomfactor)
                    setScaledate(newdate)
                    setlLastStartdate(newdate)
                }
            })
        }

    }

    useEffect(() => {
        console.log('startdate changed')
        if(!active) {
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
