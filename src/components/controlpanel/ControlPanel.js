import React, {useState, useEffect, useRef} from "react";
import {useSpring, animated, config} from 'react-spring'
import { useGesture, useDrag } from 'react-use-gesture'
import {Spring} from 'react-spring/renderprops'
import "./controlpanel.css"

// import MissionSelector from "./missionselector";





function ControlPanel(props) {

    const [{ mr },set] = useSpring(() =>({ mr:  -300 }))
    const bind = useGesture( {
        onDrag: ({ down, delta, vxvy }) => {
            if(vxvy[0]>1 || !down && delta[0] > 100) {
                set({
                    mr: -300
                })
            } else {
                set({
                    mr: down?-Math.max(delta[0],0):0
                })
            }
        }
    })


    return   (

        <animated.div {...bind()} style={{ marginRight: mr }} className='ControlPanel'>
           <img className='Logo' src='./images/EOi_logo.png' alt='' onClick={()=>set({mr:0})} />
            {/* <MissionSelector></MissionSelector> */}
            {props.children}
        
        </animated.div>


    )
    
}

export default ControlPanel
