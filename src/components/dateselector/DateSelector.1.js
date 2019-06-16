import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import {useSpring, animated, config} from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { add, sub, scale } from 'vec-la'
import DateSelectorScale from './DateSelectorScale'

import './DateSelector.css';
// import { start } from 'repl';

function DateSelector({startdate, onDateChange, onFinalDateChange}) {
    const STEPS = [ 1000*60*60 , 1000*60*10, 1000*60*1.8, 1000*27, 1000*60*60*24]

    const selector = useRef()
    const offset = useRef()
    // offset.current = [0, 0 ]
    const reflastscaledate = useRef()
    const refscaledate = useRef()
    // refscaledate.current = startdate
    // offset.current=[0,0]
    
    const [scaledate, setScaledate ] = useState(startdate)
    const [lastStartdate, setlLastStartdate ] = useState(startdate)
    
    const [newstart, setNewstart ] = useState(startdate)
    // const [offset, setOffset ] = useState([0,0])
    // const [step, setStep ] = useState(1)
    const [active, setActive ] = useState(false)

    // zoomfactor: how long is a pixel in ms
    const [zoomfactor, setZoomfactor ] = useState(STEPS[0])
    const [scalezoom, setScalezoom ] = useState(zoomfactor)


    const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

    if(!refscaledate.current) {
        console.log('reset refscaledate')
        refscaledate.current = startdate

    }

    const bind = useGesture({

        onDrag: ({  event, first, down, delta, velocity, direction, temp = {
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
            console.log(offset.current)
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
            if (!down) {
                console.log('resetting offset')
                offset.current = [0,0]
            }

            velocity = (velocity<.1)?0:velocity  
            // console.log(sub(delta,temp.deltaoffset)+ '    xy: '+temp.xy) 
            
            set({ 
                // xy: add(scale(sub(delta,temp.deltaoffset),step), temp.xy), 
                xy: add(scale(add(sub(delta,temp.deltaoffset),offset.current),step), temp.xy), 
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
                    if (!down) {
                        setTimeout(()=>setActive(false),800)
                        // setActive(false)
                        let newdate = new Date(newstart.getTime() - xy.getValue()[1] * zoomfactor)
                        onFinalDateChange(newdate)
                    }
                }
            })
            return temp
        }
    })



    // const [{ dater }, springDate] = useSpring( () => ({ dater: refscaledate.current.getTime()}))
    const [{ dater }, springDate] = useSpring( () => ({ dater: scaledate.getTime()}))
    // console.log('just defined spring: '+ scaledate.toJSON())

    useLayoutEffect(() => {
        if(!offset.current) offset.current = [0, 0 ]
        if(!active) {

            // setActive(true)
            offset.current[1] -= (startdate.getTime() - lastStartdate.getTime())  / zoomfactor
            setlLastStartdate(startdate)
            console.log('will spring from: '+refscaledate.current.toJSON()+' to: '+startdate.toJSON() + ' offset: '+ offset.current[1])
            // console.log((startdate.getTime() - scaledate.getTime())  / zoomfactor)

            springDate({ 
                // from: {
                //     // dater: scaledate.getTime()
                //     // dater: refscaledate.current.getTime()
                //     dater: 10
                // },
                to: {
                    dater: startdate.getTime(), 
                    // dater: date.getTime()
                },
                // reset: true,
                config: {  duration: 1000},
                // config: { velocity: 10, decay: true},
                // config: { mass: 10, tension: 20 , friction: 40, precision: 1000 },
                // onFrame: ()=>{console.log('xy: '+xy.getValue())},
                // config: config.gentle,
                immediate: false,
                onFrame: ()=>{
                    // console.log(zoomer)
                    // setTimescale(scaleText(new Date(dater.value),zoomer.value))
                    // let _date = new Date(dater.value)
                    setScaledate(new Date(dater.value))
                    // onDateChange(_date)
                    // offset.current = [0,(startdate.getTime() - dater.value)  / zoomfactor]
                    // console.log(_date.toJSON())
                    // setNewstart(_date)
                },
                onRest: ()=>{
                    onDateChange(new Date(dater.value))
                    // offset.current = [0,0]
                    // setActive(false)
                    // console.log('Finished')
                }
            })
        }

    },[startdate])

    const [{ zoomer }, springZoom] = useSpring(() => ({ zoomer: zoomfactor}))
    useLayoutEffect(() => {
        console.log('zoomfactor: '+zoomfactor+'  to: '+scaledate.toJSON())
        
        springZoom({ 
            to: {
                zoomer: zoomfactor, 
            },
            config: {  duration: 400},
            onFrame: ()=>{
                // console.log(zoomer.value+'/ '+scaledate.toJSON())
                // setTimescale(scaleText(new Date(dater.value),zoomer.value))
                // setTimescale(scaleText(scaledate,zoomer.value))
                setScalezoom(zoomer.value)
            }
        })

    },[zoomfactor])

    useEffect(() => {
        // if(!active) onFinalDateChange(scaledate)  
        console.log(active)
    },[active])


    return (
        <animated.div {...bind()} className='DateSelector' ref={selector} >
            <div className="Mask"  >

                <DateSelectorScale className='scale' date={scaledate} zoomfactor={scalezoom}></DateSelectorScale>
                
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
