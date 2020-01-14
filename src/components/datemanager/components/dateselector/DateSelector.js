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
    const MAXZOOM = 1000*60*60*24*15
    const MINZOOM = 1000
    const DEFZOOM = 1000*60*60
    

    const selector = useRef()
    const offset = useRef()
    if(!offset.current) offset.current = [0, 0 ]

    const lastZoom = useRef()
    if(!lastZoom.current) lastZoom.current = 1000*60*60

    
    const [scaledate, setScaledate ] = useState(startdate)
    // const debouncedScaledate = useDebounce(scaledate, 10);

    const [lastStartdate, setlLastStartdate ] = useState(startdate)
    
    const [newstart, setNewstart ] = useState(startdate)
    const [active, setActive ] = useState(false)
    const [manual, setManual ] = useState(false)

    // zoomfactor: how long is a pixel in ms
    const [zoomfactor, setZoomfactor ] = useState(DEFZOOM)
    if (!lastZoom.current) lastZoom.current = DEFZOOM

    // to detect double taps
    const lastTap = useRef()
    const [doubleTapZoom, setDoubleTapZoom] = useState(false)

    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap.current && (now - lastTap.current) < 300) {
            setDoubleTapZoom(true)
        } else {
            lastTap.current = now
            setDoubleTapZoom(false)
        }
      }


    const [{ xy }, set] = useSpring(() => ({ xy: [0,0] }))

    const bind = useGesture({

        // onMouseDown: (event) => {
        //     event.preventDefault()
        //     handleDoubleTap()
        // },
        onDragEnd: () => {
                setDoubleTapZoom(false)
                lastZoom.current = zoomfactor
        },

        onDrag: ({  event, first, down, delta, velocity, direction, temp = {
            xy: xy.getValue(),
            deltaoffset: [0,0],
            lastdeltaX: 0,
            initialzoom: zoomfactor,
            currentzoom: zoomfactor
            }
        }) => {
            //event.preventDefault()
            let zoom
            // console.log(first)
            // console.log('delta '+delta[1]+ '  temp.deltaoffset: '+temp.deltaoffset[1]+' temp.xy: '+temp.xy[1]+ ' xy.getValue()[1]: '+xy.getValue()[1])
            if (first) {
                setActive(true)
                handleDoubleTap()
            }
            setManual(down)
            if (doubleTapZoom) {
                // console.log((temp.lastdeltaX - delta[1] ))

                // zoom = lastZoom.current + lastZoom.current * (delta[1] /30) 
                //zoom =  temp.initialzoom + delta[1]  * delta[1] * delta[1]
                zoom = temp.currentzoom + temp.currentzoom / 50 * (temp.lastdeltaX - delta[1] )
                //zoom = temp.initialzoom + 5000000 * (MAXZOOM/(1+MAXZOOM - temp.currentzoom)) * delta[1]
                if (zoom < MINZOOM) zoom = MINZOOM
                if (zoom > MAXZOOM) zoom = MAXZOOM
                setZoomfactor(zoom)
                console.log(zoom+' / '+(zoom-1000*60*60*24))
                
                setNewstart(scaledate)
                temp.xy = [0,0]
                temp.deltaoffset = delta
                temp.currentzoom = zoom
                temp.lastdeltaX = delta[1]
            }
            let step = 1
            console.log(' zoomfactor: ' + zoomfactor)
            
            if (zoomfactor >  422274) step = 1000*60
            if (zoomfactor >  4275383) step = 1000*60*60
            if (zoomfactor >  14544702) step = 1000*60*60*24
            if (zoomfactor > 120426316) step = 1000*60*60*24*30
                    

            velocity = (Math.abs(velocity)<.2)?0:velocity  
            set({ 
                xy: (doubleTapZoom)?temp.xy:add(add(sub(delta,temp.deltaoffset),offset.current), temp.xy), 
                immediate: down, 
                config: { velocity: scale(direction, velocity), decay: true},
                onFrame: ()=>{
                    if (!doubleTapZoom) {
                        let newdate
                        if (step!=1) {
                            //Math.ceil((newstart.getTime() - xy.getValue()[1] * zoomfactor)  / (1000*60*60*24*30)) * (1000*60*60*24*30) 
                            newdate = new Date(newstart.getTime() - Math.ceil(xy.getValue()[1] * zoomfactor  / step) * step)
                        } else {
                            newdate = new Date(newstart.getTime() - xy.getValue()[1] * zoomfactor)
                        }
                        setScaledate(newdate)
                        setlLastStartdate(newdate)
    
                    }
                },
                onRest: ()=>{
                    if (!down ) {
                        setActive(false)
                        if (!doubleTapZoom) {
                            let newdate = new Date(newstart.getTime() - xy.getValue()[1] * zoomfactor)
                            onFinalDateChange(newdate)
                            offset.current = [0,0]
    
                        }

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
            <div className="Mask"  >

                <DateSelectorScale className='scale' date={scaledate} zoomfactor={zoomfactor} immediate={active} down={manual}></DateSelectorScale>
                
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
