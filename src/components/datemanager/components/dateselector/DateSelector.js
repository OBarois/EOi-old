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
    const [{ xy2 }, sety2] = useSpring(() => ({ xy2: [0,0] }))
    const [{ posxy_wheel }, setyOnWheel] = useSpring(() => ({posxy_wheel: [0,0] }))
    // const [{ zoom }, setz] = useSpring(() => ({ zoom: DEFZOOM }))


    
    const bind = useGesture({

        onDragEnd: () => {
                lastZoom.current = zoomfactor
        },

        onWheel: ( {delta, first, down, direction, velocity, xy} ) => {
            console.log(down)
            setyOnWheel({                 
                posxy_wheel: xy, 
                immediate: false, 
                config: { },
                onFrame: ()=>{
                    console.log('posy / deltay:  '+posxy_wheel.getValue()[1]+'/ '+delta[1])
                        let nd = lastStartdate.getTime() + Math.ceil(posxy_wheel.getValue()[1] * zoomfactor  / step) * step
                        let newdate = new Date(nd)
                        setScaledate(newdate)
                        onDateChange(newdate)


                    // setlLastStartdate(newdate)
                },
                onRest: ()=>{
                    if (!down) {
                        setActive(false)
                        onFinalDateChange(scaledate)
                        setlLastStartdate(scaledate)
                    }
                }
            })

        },

        onDrag: ({  event, first, down, movement, delta, velocity, direction, shiftKey, temp = {
            lastzoom: zoomfactor,
            lastdelta: [0,0],
            currentzoom: zoomfactor
            }
        }) => {
            //event.preventDefault()
            let zoom

            if (first) {
                console.log('shiftKey: '+shiftKey)
                setActive(true)
                handleDoubleTap()
                setlLastStartdate(scaledate)
            }

            if (doubleTap.current || shiftKey) {
                console.log('in double tap')
                zoom = temp.currentzoom + temp.currentzoom / 50 * (temp.lastdelta[1] - delta[1] )
                if (zoom < MINZOOM) zoom = MINZOOM
                if (zoom > MAXZOOM) zoom = MAXZOOM
                setZoomfactor(zoom)
                // temp.xy = [0,0]
                temp.currentzoom = zoom
                temp.lastdelta = delta
                if(!down) setActive(false)
                return temp
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
                        setActive(false)
                        onFinalDateChange(scaledate)
                        setlLastStartdate(scaledate)
                    }
                }
            })
            return temp
        }
    },
    {}
    )


    const moveToDate = (startdate) => {
        if (!active) {
            let deltaoffset = [0,(lastStartdate.getTime() - startdate.getTime())  / zoomfactor]
            
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
                    setActive(false)
                    let newdate = new Date(lastStartdate.getTime() - xy2.getValue()[1] * zoomfactor)
                    xy2.setValue([0,0])
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
        <animated.div {...bind()} className='DateSelector' ref={selector} >
            <div className="Mask"  >

                <DateSelectorScale className='scale' date={scaledate} zoomfactor={zoomfactor} step={step}></DateSelectorScale>
                
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
