import React, {useState, useEffect, useRef} from "react";
import {useSpring, animated} from 'react-spring';
import {Spring} from 'react-spring/renderprops'
import "./controlpanel.css"

// import MissionSelector from "./missionselector";





function ControlPanel() {


    /*
    //const props = useSpring({from: { opacity: 0, marginLeft: 0 }, to: { opacity: 1, marginLeft: 100 }})
    const props = useSpring({opacity: 0, to: { opacity: 1}})
    return (
        <animated.div className='ControlPanel' style={props}>I will fade in</animated.div>
    )
*/
    const [active, setActive] = useState(false)

    let styleOn = { opacity: 1, marginRight: 0 }
    let styleOff = { opacity: 1, marginRight: -300 }


    return (

        <Spring
        
            from={ active ? styleOff : styleOn}
            to={ active ? styleOn : styleOff}>
            {props => 
                <div className='ControlPanel' style={props} >
                    <img className='Logo' src='./images/EOi_logo.png' alt='' onClick={()=>setActive((active => !active))} />
                    {/* <MissionSelector></MissionSelector> */}
                
                </div>}
        </Spring>
    )
    
}

export default ControlPanel
