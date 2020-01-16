import React, {useState, useEffect, useRef} from "react";
import {useSpring, animated, config} from 'react-spring'
import { useGesture, useDrag } from 'react-use-gesture'
import {Spring} from 'react-spring/renderprops'
import "./controlpanel.css"

// import MissionSelector from "./missionselector";





function ControlPanel() {

    const [{ mr },set] = useSpring(() =>({ mr:  -300 }))
    const bind = useGesture( {
        onDrag: ({ vxvy }) => {
            console.log('swipe'+vxvy[0])
            if(vxvy[0]>1.5) {
                set({
                    mr: -300
                })
            }
        }
    })


    return   (

        <animated.div {...bind()} style={{ marginRight: mr }} className='ControlPanel'>
           <img className='Logo' src='./images/EOi_logo.png' alt='' onClick={()=>set({mr:0})} />
            {/* <MissionSelector></MissionSelector> */}
        
        </animated.div>


    )
    
}

export default ControlPanel
